import { create } from 'zustand';
import type { ScriptType, BadgeVariant } from '@/types';
import { getFromLocalStorage, setToLocalStorage } from '@/hooks/useLocalStorage';

interface ScriptTypeState {
  scriptTypes: ScriptType[];
  addScriptType: (type: Omit<ScriptType, 'id'>) => void;
  updateScriptType: (id: string, type: Partial<ScriptType>) => void;
  deleteScriptType: (id: string) => void;
  getScriptTypeById: (id: string) => ScriptType | undefined;
  getScriptTypeByName: (name: string) => ScriptType | undefined;
  getTypeNames: () => string[];
}

const STORAGE_KEY = 'script-killer-script-types';

const defaultScriptTypes: ScriptType[] = [
  {
    id: 'type-1',
    name: '恐怖',
    color: '#f43f5e',
    gradientClass: 'from-rose-600 to-red-700',
    badgeVariant: 'danger'
  },
  {
    id: 'type-2',
    name: '情感',
    color: '#f59e0b',
    gradientClass: 'from-amber-500 to-orange-600',
    badgeVariant: 'gold'
  },
  {
    id: 'type-3',
    name: '推理',
    color: '#3b82f6',
    gradientClass: 'from-blue-500 to-indigo-600',
    badgeVariant: 'info'
  },
  {
    id: 'type-4',
    name: '欢乐',
    color: '#10b981',
    gradientClass: 'from-emerald-500 to-green-600',
    badgeVariant: 'success'
  },
  {
    id: 'type-5',
    name: '阵营',
    color: '#a855f7',
    gradientClass: 'from-purple-500 to-violet-600',
    badgeVariant: 'warning'
  },
  {
    id: 'type-6',
    name: '其他',
    color: '#64748b',
    gradientClass: 'from-slate-500 to-slate-600',
    badgeVariant: 'default'
  }
];

const initialScriptTypes = getFromLocalStorage<ScriptType[]>(STORAGE_KEY, defaultScriptTypes);

export const useScriptTypeStore = create<ScriptTypeState>((set, get) => ({
  scriptTypes: initialScriptTypes,

  addScriptType: (type) => {
    const newType: ScriptType = {
      ...type,
      id: `type-${Date.now()}`
    };
    set((state) => {
      const scriptTypes = [...state.scriptTypes, newType];
      setToLocalStorage(STORAGE_KEY, scriptTypes);
      return { scriptTypes };
    });
  },

  updateScriptType: (id, type) => {
    set((state) => {
      const scriptTypes = state.scriptTypes.map((t) =>
        t.id === id ? { ...t, ...type } : t
      );
      setToLocalStorage(STORAGE_KEY, scriptTypes);
      return { scriptTypes };
    });
  },

  deleteScriptType: (id) => {
    set((state) => {
      const scriptTypes = state.scriptTypes.filter((t) => t.id !== id);
      setToLocalStorage(STORAGE_KEY, scriptTypes);
      return { scriptTypes };
    });
  },

  getScriptTypeById: (id) => {
    return get().scriptTypes.find((t) => t.id === id);
  },

  getScriptTypeByName: (name) => {
    return get().scriptTypes.find((t) => t.name === name);
  },

  getTypeNames: () => {
    return get().scriptTypes.map((t) => t.name);
  }
}));
