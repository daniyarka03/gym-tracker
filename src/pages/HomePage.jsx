import React, {useEffect, useState} from 'react';
import {NotebookPen, Edit2, Plus} from "lucide-react";
import {MEASUREMENT_TYPES} from "../utils/constants";
import {usePageNavigationStore} from "../stores/pageNavigationStore.js";
import {useModalStore} from "../stores/modalStore.js";
import NotesModal from "../components/NotesModal.jsx";
import notesModal from "../components/NotesModal.jsx";
import {useEditingActivityStore} from "../stores/exercisesStore.js";

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
};

const HomePage = ({activities}) => {
    const [editingActivity, setEditingActivity] = useState(null);
    const setCurrentPage = usePageNavigationStore((state) => state.setCurrentPage);
    const setModalContent = useModalStore((state) => state.setModalContent);
    const setModalOpen = useModalStore((state) => state.setModalOpen);
    const isOpen = useModalStore((state) => state.isOpen);
    const modalTitle = useModalStore((state) => state.title);
    const modalNotes = useModalStore((state) => state.notes);
    const setExercise = useEditingActivityStore((state) => state.setExercise);

    useEffect(() => {
        console.log(isOpen)
    }, [])

    return (
        <div className="main-block p-6">
            <h1 className="text-4xl font-serif mb-8">Trainings</h1>
            {activities.map((day, index) => (
                <div key={index} className="mb-8">
                    <h2 className="text-[#E97451] text-lg mb-4">{formatDate(day.date)}</h2>
                    {day.exercises.map((exercise, exIndex) => (
                        <div key={exIndex} className="mb-4 border-b border-gray-200 pb-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <span className="text-xl">{exercise.name}</span>
                                    {exercise.notes && (
                                        <button
                                            onClick={() => {
                                                setModalContent({
                                                    title: exercise.name,
                                                    notes: exercise.notes,
                                                    postTitle: 'Notes'
                                                });
                                                setModalOpen(true);
                                                console.log(exercise)
                                            }}
                                            className="ml-2 text-gray-500 hover:text-[#E97451]"
                                        >
                                            <NotebookPen className="h-4 w-4"/>
                                        </button>
                                    )}
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        {exercise.type === MEASUREMENT_TYPES.COUNT ? (
                                            <div>
                                                {(exercise.sets || []).map((set, setIndex) => (
                                                    <div key={setIndex} className="text-gray-600">
                                                        {setIndex === 0 && (
                                                            <span className="text-xl">
                                                          {(exercise.sets || []).length}x
                                                      </span>
                                                        )}
                                                        <div className="text-sm">
                                                            Set {setIndex + 1}: {set.reps} reps
                                                            {set.weight && ` (${set.weight}kg)`}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div>
                                                {(exercise.sets || []).map((set, setIndex) => (
                                                    <div key={setIndex} className="text-gray-600">
                                                        {setIndex === 0 && (
                                                            <span className="text-xl">
                                                          {(exercise.sets || []).length}x
                                                      </span>
                                                        )}
                                                        <div className="text-sm">
                                                            Set {setIndex + 1}: {set.duration} {set.unit}
                                                            {set.weight && ` (${set.weight}kg)`}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => {
                                            setExercise({
                                                dayIndex: index,
                                                exerciseIndex: exIndex,
                                                ...exercise,
                                                date: day.date
                                            });
                                            console.log({
                                                dayIndex: index,
                                                exerciseIndex: exIndex,
                                                ...exercise,
                                                date: day.date
                                            })
                                            setCurrentPage('edit');
                                        }}
                                        className="text-gray-500 hover:text-[#E97451]"
                                    >
                                        <Edit2 className="h-5 w-5"/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}</div>
            ))}

            <button
                onClick={() => setCurrentPage('new')}
                className="fixed bottom-20 right-6  w-14 h-14 bg-[#E97451] rounded-full flex items-center justify-center text-white text-3xl"
            >
                <Plus/>
            </button>


        </div>
    )
};

export default HomePage;