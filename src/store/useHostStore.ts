import { create } from 'zustand';
import type { Host } from '@/types';
import { mockHosts } from '@/data/mockHosts';
import { getFromLocalStorage, setToLocalStorage } from '@/hooks/useLocalStorage';

interface HostState {
  hosts: Host[];
  addHost: (host: Omit<Host, 'id'>) => void;
  updateHost: (id: string, host: Partial<Host>) => void;
  deleteHost: (id: string) => void;
  getHostById: (id: string) => Host | undefined;
}

const STORAGE_KEY = 'script-killer-hosts';

const initialHosts = getFromLocalStorage<Host[]>(STORAGE_KEY, mockHosts);

export const useHostStore = create<HostState>((set, get) => ({
  hosts: initialHosts,

  addHost: (host) => {
    const newHost: Host = {
      ...host,
      id: `host-${Date.now()}`
    };
    set((state) => {
      const hosts = [...state.hosts, newHost];
      setToLocalStorage(STORAGE_KEY, hosts);
      return { hosts };
    });
  },

  updateHost: (id, host) => {
    set((state) => {
      const hosts = state.hosts.map((h) =>
        h.id === id ? { ...h, ...host } : h
      );
      setToLocalStorage(STORAGE_KEY, hosts);
      return { hosts };
    });
  },

  deleteHost: (id) => {
    set((state) => {
      const hosts = state.hosts.filter((h) => h.id !== id);
      setToLocalStorage(STORAGE_KEY, hosts);
      return { hosts };
    });
  },

  getHostById: (id) => {
    return get().hosts.find((h) => h.id === id);
  }
}));
