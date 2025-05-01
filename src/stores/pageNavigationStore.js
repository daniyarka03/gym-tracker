import {create} from 'zustand';

export const usePageNavigationStore = create((set, get) => ({
    currentPage: 'home',
    setCurrentPage: (page) => set({ currentPage: page }),
}));

