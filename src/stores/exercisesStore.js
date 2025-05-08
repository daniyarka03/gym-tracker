import { create } from 'zustand';

export const useEditingActivityStore = create((set) => ({
    exercise: null,

    setExercise: (newExercise) => set({
        exercise: newExercise
    }),

    clearExercise: () => set({
        exercise: null
    })
}));

