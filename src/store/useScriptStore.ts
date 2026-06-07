import { create } from 'zustand';
import type { Script } from '@/types';
import { mockScripts } from '@/data/mockScripts';
import { getFromLocalStorage, setToLocalStorage } from '@/hooks/useLocalStorage';

interface ScriptState {
  scripts: Script[];
  addScript: (script: Omit<Script, 'id'>) => void;
  updateScript: (id: string, script: Partial<Script>) => void;
  deleteScript: (id: string) => void;
  getScriptById: (id: string) => Script | undefined;
  updateTagNameInScripts: (oldName: string, newName: string) => void;
  removeTagFromScripts: (tagName: string) => void;
}

const STORAGE_KEY = 'script-killer-scripts';

const initialScripts = getFromLocalStorage<Script[]>(STORAGE_KEY, mockScripts);

export const useScriptStore = create<ScriptState>((set, get) => ({
  scripts: initialScripts,

  addScript: (script) => {
    const newScript: Script = {
      ...script,
      id: `script-${Date.now()}`
    };
    set((state) => {
      const scripts = [...state.scripts, newScript];
      setToLocalStorage(STORAGE_KEY, scripts);
      return { scripts };
    });
  },

  updateScript: (id, script) => {
    set((state) => {
      const scripts = state.scripts.map((s) =>
        s.id === id ? { ...s, ...script } : s
      );
      setToLocalStorage(STORAGE_KEY, scripts);
      return { scripts };
    });
  },

  deleteScript: (id) => {
    set((state) => {
      const scripts = state.scripts.filter((s) => s.id !== id);
      setToLocalStorage(STORAGE_KEY, scripts);
      return { scripts };
    });
  },

  getScriptById: (id) => {
    return get().scripts.find((s) => s.id === id);
  },

  updateTagNameInScripts: (oldName, newName) => {
    set((state) => {
      const scripts = state.scripts.map((s) => ({
        ...s,
        tags: (s.tags || []).map((t) => (t === oldName ? newName : t))
      }));
      setToLocalStorage(STORAGE_KEY, scripts);
      return { scripts };
    });
  },

  removeTagFromScripts: (tagName) => {
    set((state) => {
      const scripts = state.scripts.map((s) => ({
        ...s,
        tags: (s.tags || []).filter((t) => t !== tagName)
      }));
      setToLocalStorage(STORAGE_KEY, scripts);
      return { scripts };
    });
  }
}));
