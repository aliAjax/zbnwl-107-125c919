import { create } from 'zustand';
import type { ScriptType } from '@/types';
import { mockHosts } from '@/data/mockHosts';
import { mockScripts } from '@/data/mockScripts';
import { getFromLocalStorage, setToLocalStorage } from '@/hooks/useLocalStorage';

const defaultScriptTypes: ScriptType[] = [
  { id: 'type-horror', name: '恐怖', sortOrder: 0, active: true, color: 'danger' },
  { id: 'type-emotion', name: '情感', sortOrder: 1, active: true, color: 'gold' },
  { id: 'type-mystery', name: '推理', sortOrder: 2, active: true, color: 'info' },
  { id: 'type-fun', name: '欢乐', sortOrder: 3, active: true, color: 'success' },
  { id: 'type-faction', name: '阵营', sortOrder: 4, active: true, color: 'warning' },
  { id: 'type-other', name: '其他', sortOrder: 5, active: true, color: 'default' }
];

const typeGradientColors: Record<string, string> = {
  'type-horror': 'from-rose-600 to-red-700',
  'type-emotion': 'from-amber-500 to-orange-600',
  'type-mystery': 'from-blue-500 to-indigo-600',
  'type-fun': 'from-emerald-500 to-green-600',
  'type-faction': 'from-purple-500 to-violet-600',
  'type-other': 'from-slate-500 to-slate-600'
};

const legacyTypeNames: Record<string, string> = Object.fromEntries(
  defaultScriptTypes.map((type) => [type.id, type.name])
);

const getTypeAliases = (scriptTypes: ScriptType[], typeId: string) => {
  const type = scriptTypes.find((t) => t.id === typeId);
  return new Set([typeId, type?.name, legacyTypeNames[typeId]].filter(Boolean));
};

interface ScriptTypeUsage {
  scriptCount: number;
  hostCount: number;
  inUse: boolean;
}

interface ScriptTypeState {
  scriptTypes: ScriptType[];
  addScriptType: (name: string, color?: string) => void;
  updateScriptType: (id: string, updates: Partial<ScriptType>) => void;
  deleteScriptType: (id: string) => boolean;
  toggleActive: (id: string) => void;
  reorder: (id: string, direction: 'up' | 'down') => void;
  getTypeName: (typeIdOrName: string) => string;
  getTypeColor: (typeIdOrName: string) => string;
  getTypeGradient: (typeIdOrName: string) => string;
  getActiveTypes: () => ScriptType[];
  getTypeById: (id: string) => ScriptType | undefined;
  getTypeByName: (name: string) => ScriptType | undefined;
  getTypeUsage: (typeId: string) => ScriptTypeUsage;
  isTypeValueMatch: (typeId: string, typeValue?: string) => boolean;
}

const STORAGE_KEY = 'script-killer-script-types';

const initialScriptTypes = getFromLocalStorage<ScriptType[]>(STORAGE_KEY, defaultScriptTypes);

export const useScriptTypeStore = create<ScriptTypeState>((set, get) => ({
  scriptTypes: initialScriptTypes,

  addScriptType: (name, color) => {
    set((state) => {
      const maxSortOrder = Math.max(...state.scriptTypes.map((t) => t.sortOrder), -1);
      const newType: ScriptType = {
        id: `type-${Date.now()}`,
        name,
        sortOrder: maxSortOrder + 1,
        active: true,
        color
      };
      const scriptTypes = [...state.scriptTypes, newType];
      setToLocalStorage(STORAGE_KEY, scriptTypes);
      return { scriptTypes };
    });
  },

  updateScriptType: (id, updates) => {
    set((state) => {
      const scriptTypes = state.scriptTypes.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      );
      setToLocalStorage(STORAGE_KEY, scriptTypes);
      return { scriptTypes };
    });
  },

  deleteScriptType: (id) => {
    const state = get();
    const usage = state.getTypeUsage(id);
    if (usage.inUse) {
      return false;
    }
    set((state) => {
      const scriptTypes = state.scriptTypes.filter((t) => t.id !== id);
      setToLocalStorage(STORAGE_KEY, scriptTypes);
      return { scriptTypes };
    });
    return true;
  },

  getTypeUsage: (typeId) => {
    interface StoredScript { type?: string }
    interface StoredHost { specialty?: string[] }

    const scripts = getFromLocalStorage<StoredScript[]>('script-killer-scripts', mockScripts);
    const hosts = getFromLocalStorage<StoredHost[]>('script-killer-hosts', mockHosts);
    const matchesType = get().isTypeValueMatch;

    const scriptCount = scripts.filter((s) => matchesType(typeId, s.type)).length;
    const hostCount = hosts.filter((h) =>
      h.specialty?.some((specialty) => matchesType(typeId, specialty))
    ).length;

    return {
      scriptCount,
      hostCount,
      inUse: scriptCount > 0 || hostCount > 0
    };
  },

  isTypeValueMatch: (typeId, typeValue) => {
    if (!typeValue) return false;
    return getTypeAliases(get().scriptTypes, typeId).has(typeValue);
  },

  toggleActive: (id) => {
    set((state) => {
      const scriptTypes = state.scriptTypes.map((t) =>
        t.id === id ? { ...t, active: !t.active } : t
      );
      setToLocalStorage(STORAGE_KEY, scriptTypes);
      return { scriptTypes };
    });
  },

  reorder: (id, direction) => {
    set((state) => {
      const sorted = [...state.scriptTypes].sort((a, b) => a.sortOrder - b.sortOrder);
      const index = sorted.findIndex((t) => t.id === id);
      if (index === -1) return state;

      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= sorted.length) return state;

      [sorted[index], sorted[newIndex]] = [sorted[newIndex], sorted[index]];

      const scriptTypes = sorted.map((t, i) => ({ ...t, sortOrder: i }));
      setToLocalStorage(STORAGE_KEY, scriptTypes);
      return { scriptTypes };
    });
  },

  getTypeName: (typeIdOrName) => {
    const state = get();
    const byId = state.scriptTypes.find((t) => t.id === typeIdOrName);
    if (byId) return byId.name;
    const byName = state.scriptTypes.find((t) => t.name === typeIdOrName);
    if (byName) return byName.name;
    return typeIdOrName;
  },

  getTypeColor: (typeIdOrName) => {
    const state = get();
    const byId = state.scriptTypes.find((t) => t.id === typeIdOrName);
    if (byId?.color) return byId.color;
    const byName = state.scriptTypes.find((t) => t.name === typeIdOrName);
    if (byName?.color) return byName.color;
    return 'default';
  },

  getTypeGradient: (typeIdOrName) => {
    const state = get();
    const byId = state.scriptTypes.find((t) => t.id === typeIdOrName);
    if (byId && typeGradientColors[byId.id]) return typeGradientColors[byId.id];
    const byName = state.scriptTypes.find((t) => t.name === typeIdOrName);
    if (byName && typeGradientColors[byName.id]) return typeGradientColors[byName.id];
    return 'from-slate-500 to-slate-600';
  },

  getActiveTypes: () => {
    return get()
      .scriptTypes.filter((t) => t.active)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  },

  getTypeById: (id) => {
    return get().scriptTypes.find((t) => t.id === id);
  },

  getTypeByName: (name) => {
    return get().scriptTypes.find((t) => t.name === name);
  }
}));
