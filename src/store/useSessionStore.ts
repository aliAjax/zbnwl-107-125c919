import { create } from 'zustand';
import type { Session } from '@/types';
import { mockSessions } from '@/data/mockSessions';
import { getFromLocalStorage, setToLocalStorage } from '@/hooks/useLocalStorage';

interface SessionState {
  sessions: Session[];
  addSession: (session: Omit<Session, 'id'>) => void;
  updateSession: (id: string, session: Partial<Session>) => void;
  deleteSession: (id: string) => void;
  getSessionById: (id: string) => Session | undefined;
  getSessionsByDate: (date: Date) => Session[];
}

const STORAGE_KEY = 'script-killer-sessions';

const initialSessions = getFromLocalStorage<Session[]>(STORAGE_KEY, mockSessions);

export const useSessionStore = create<SessionState>((set, get) => ({
  sessions: initialSessions,

  addSession: (session) => {
    const newSession: Session = {
      ...session,
      id: `session-${Date.now()}`
    };
    set((state) => {
      const sessions = [...state.sessions, newSession];
      setToLocalStorage(STORAGE_KEY, sessions);
      return { sessions };
    });
  },

  updateSession: (id, session) => {
    set((state) => {
      const sessions = state.sessions.map((s) =>
        s.id === id ? { ...s, ...session } : s
      );
      setToLocalStorage(STORAGE_KEY, sessions);
      return { sessions };
    });
  },

  deleteSession: (id) => {
    set((state) => {
      const sessions = state.sessions.filter((s) => s.id !== id);
      setToLocalStorage(STORAGE_KEY, sessions);
      return { sessions };
    });
  },

  getSessionById: (id) => {
    return get().sessions.find((s) => s.id === id);
  },

  getSessionsByDate: (date) => {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    return get().sessions.filter((s) => {
      const sessionDate = new Date(s.startTime);
      return sessionDate >= targetDate && sessionDate < nextDay;
    });
  }
}));
