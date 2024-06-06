import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAppStore = create(
    persist(
      (set) => ({
        role:'',
        setRole: (role) => set((state) => ({ ...state,role })),
      }),
      {
        name: 'finace-storage', // name of the item in the storage (must be unique)
        storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
      }
    )
  )