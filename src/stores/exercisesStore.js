import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useExercisesStore = create(
    persist(
        (set, get) => ({
            exercises: [], // Инициализация пустым массивом
            setExercises: (newExercises) =>
                set(() => ({
                    exercises: newExercises,
                })),
            clearExercises: () =>
                set(() => ({
                    exercises: [],
                })),
        }),
        {
            name: 'activities', // Ключ для localStorage
        }
    )
);

export const useEditingActivityStore = create((set) => ({
    exercise: null,

    setExercise: (newExercise) => set({
        exercise: newExercise
    }),

    clearExercise: () => set({
        exercise: null
    })
}));

