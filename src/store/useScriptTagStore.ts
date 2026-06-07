import { create } from 'zustand';
import type { ScriptTag } from '@/types';
import { getFromLocalStorage, setToLocalStorage } from '@/hooks/useLocalStorage';
import { useScriptStore } from './useScriptStore';

interface ScriptTagState {
  scriptTags: ScriptTag[];
  addScriptTag: (tag: Omit<ScriptTag, 'id'>) => void;
  updateScriptTag: (id: string, tag: Partial<ScriptTag>) => void;
  deleteScriptTag: (id: string) => void;
  getTagById: (id: string) => ScriptTag | undefined;
  getTagByName: (name: string) => ScriptTag | undefined;
  getTagNames: () => string[];
}

const STORAGE_KEY = 'script-killer-script-tags';

const defaultScriptTags: ScriptTag[] = [
  {
    id: 'tag-1',
    name: '新手友好',
    color: '#10b981',
    description: '适合新手玩家，推理难度适中'
  },
  {
    id: 'tag-2',
    name: '强推理',
    color: '#3b82f6',
    description: '注重逻辑推理，硬核烧脑'
  },
  {
    id: 'tag-3',
    name: '微恐',
    color: '#f59e0b',
    description: '带有轻微恐怖元素'
  },
  {
    id: 'tag-4',
    name: '适合团建',
    color: '#ec4899',
    description: '适合公司团建、朋友聚会'
  }
];

const initialScriptTags = getFromLocalStorage<ScriptTag[]>(STORAGE_KEY, defaultScriptTags);

export const useScriptTagStore = create<ScriptTagState>((set, get) => ({
  scriptTags: initialScriptTags,

  addScriptTag: (tag) => {
    const newTag: ScriptTag = {
      ...tag,
      id: `tag-${Date.now()}`
    };
    set((state) => {
      const scriptTags = [...state.scriptTags, newTag];
      setToLocalStorage(STORAGE_KEY, scriptTags);
      return { scriptTags };
    });
  },

  updateScriptTag: (id, tag) => {
    set((state) => {
      const oldTag = state.scriptTags.find((t) => t.id === id);
      const scriptTags = state.scriptTags.map((t) =>
        t.id === id ? { ...t, ...tag } : t
      );
      setToLocalStorage(STORAGE_KEY, scriptTags);
      if (oldTag && tag.name && oldTag.name !== tag.name) {
        useScriptStore.getState().updateTagNameInScripts(oldTag.name, tag.name);
      }
      return { scriptTags };
    });
  },

  deleteScriptTag: (id) => {
    set((state) => {
      const deletedTag = state.scriptTags.find((t) => t.id === id);
      const scriptTags = state.scriptTags.filter((t) => t.id !== id);
      setToLocalStorage(STORAGE_KEY, scriptTags);
      if (deletedTag) {
        useScriptStore.getState().removeTagFromScripts(deletedTag.name);
      }
      return { scriptTags };
    });
  },

  getTagById: (id) => {
    return get().scriptTags.find((t) => t.id === id);
  },

  getTagByName: (name) => {
    return get().scriptTags.find((t) => t.name === name);
  },

  getTagNames: () => {
    return get().scriptTags.map((t) => t.name);
  }
}));
