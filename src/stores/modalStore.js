import {create} from 'zustand';

export const useModalStore = create((set) => ({
    title: "Ошибка!",
    notes: "Заполните название упражнения",
    isOpen: false,
    setModalContent: (content) => set(() => ({
        title: content.title,
        notes: content.notes,
        postTitle: content.postTitle || "",
    })),
    setModalOpen: (isOpen) => set(() => ({ isOpen })),
}));
