import { create } from 'zustand';
import type { Customer } from '@/types';
import { getFromLocalStorage, setToLocalStorage } from '@/hooks/useLocalStorage';

interface CustomerState {
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  getCustomerById: (id: string) => Customer | undefined;
}

const STORAGE_KEY = 'script-killer-customers';

const initialCustomers = getFromLocalStorage<Customer[]>(STORAGE_KEY, []);

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: initialCustomers,

  addCustomer: (customer) => {
    const newCustomer: Customer = {
      ...customer,
      id: `customer-${Date.now()}`
    };
    set((state) => {
      const customers = [...state.customers, newCustomer];
      setToLocalStorage(STORAGE_KEY, customers);
      return { customers };
    });
  },

  updateCustomer: (id, customer) => {
    set((state) => {
      const customers = state.customers.map((c) =>
        c.id === id ? { ...c, ...customer } : c
      );
      setToLocalStorage(STORAGE_KEY, customers);
      return { customers };
    });
  },

  deleteCustomer: (id) => {
    set((state) => {
      const customers = state.customers.filter((c) => c.id !== id);
      setToLocalStorage(STORAGE_KEY, customers);
      return { customers };
    });
  },

  getCustomerById: (id) => {
    return get().customers.find((c) => c.id === id);
  }
}));
