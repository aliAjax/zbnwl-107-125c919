import { create } from 'zustand';
import type { Memo, MemoStatus, MemoCategory } from '@/types';
import { getFromLocalStorage, setToLocalStorage } from '@/hooks/useLocalStorage';

interface MemoState {
  memos: Memo[];
  addMemo: (memo: Omit<Memo, 'id' | 'createdAt' | 'status'>) => void;
  updateMemo: (id: string, memo: Partial<Memo>) => void;
  deleteMemo: (id: string) => void;
  toggleMemoStatus: (id: string) => void;
  getMemosByStatus: (status: MemoStatus) => Memo[];
  getMemosByCategory: (category: MemoCategory) => Memo[];
}

const STORAGE_KEY = 'script-killer-memos';

const defaultMemos: Memo[] = [
  {
    id: 'memo-1',
    title: '3号房间打扫',
    content: '今天下午3点前打扫完3号房间，检查桌椅是否完好',
    category: 'room',
    status: 'pending',
    createdAt: new Date().toISOString()
  },
  {
    id: 'memo-2',
    title: '补充剧本道具',
    content: '《雾鸦馆》缺少手电筒道具，需要购买补充',
    category: 'props',
    status: 'pending',
    createdAt: new Date().toISOString()
  }
];

const initialMemos = getFromLocalStorage<Memo[]>(STORAGE_KEY, defaultMemos);

export const useMemoStore = create<MemoState>((set, get) => ({
  memos: initialMemos,

  addMemo: (memo) => {
    const newMemo: Memo = {
      ...memo,
      id: `memo-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    set((state) => {
      const memos = [newMemo, ...state.memos];
      setToLocalStorage(STORAGE_KEY, memos);
      return { memos };
    });
  },

  updateMemo: (id, memo) => {
    set((state) => {
      const memos = state.memos.map((m) =>
        m.id === id ? { ...m, ...memo } : m
      );
      setToLocalStorage(STORAGE_KEY, memos);
      return { memos };
    });
  },

  deleteMemo: (id) => {
    set((state) => {
      const memos = state.memos.filter((m) => m.id !== id);
      setToLocalStorage(STORAGE_KEY, memos);
      return { memos };
    });
  },

  toggleMemoStatus: (id) => {
    set((state) => {
      const memos = state.memos.map((m) => {
        if (m.id === id) {
          const newStatus: MemoStatus = m.status === 'pending' ? 'completed' : 'pending';
          return {
            ...m,
            status: newStatus,
            completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined
          };
        }
        return m;
      });
      setToLocalStorage(STORAGE_KEY, memos);
      return { memos };
    });
  },

  getMemosByStatus: (status) => {
    return get().memos.filter((m) => m.status === status);
  },

  getMemosByCategory: (category) => {
    return get().memos.filter((m) => m.category === category);
  }
}));
