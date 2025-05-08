import {create} from 'zustand';

export const useModalStore = create((set) => ({
    title: "Error!",
    notes: "Fill the name of exercise!",
    isOpen: false,
    setModalContent: (content) => set(() => ({
        title: content.title,
        notes: content.notes,
        postTitle: content.postTitle || "",
    })),
    setModalOpen: (isOpen) => set(() => ({ isOpen })),
}));
