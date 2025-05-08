import React, {useState} from "react";
import {MEASUREMENT_TYPES, TIME_UNITS} from "../utils/constants.js";
import NotesSection from "../components/NotesSection.jsx";
import {Clock, Hash, Trash2} from "lucide-react";
import {usePageNavigationStore} from "../stores/pageNavigationStore.js";
import {useEditingActivityStore} from "../stores/exercisesStore.js";
import {useLocalActivities} from "../hooks/useLocalActivities.js";

const EditActivityPage = () => {

    const setCurrentPage = usePageNavigationStore((state) => state.setCurrentPage);
    const activities = useLocalActivities();
    const exercise = useEditingActivityStore((state) => state.exercise);

    const [activity, setActivity] = useState({
        title: exercise.name,
        date: exercise.date,
        type: exercise.type || MEASUREMENT_TYPES.COUNT,
        sets: exercise.sets || [],
        notes: exercise.notes || '' // Add notes field with existing value or empty string
    });

    const addSet = () => {
        setActivity(prev => ({
            ...prev,
            sets: [...prev.sets,
                prev.type === MEASUREMENT_TYPES.COUNT
                    ? {reps: '', weight: ''}
                    : {duration: '', unit: 'sec', weight: ''}
            ]
        }));
    };

    const updateSet = (index, newSet) => {
        setActivity(prev => ({
            ...prev,
            sets: prev.sets.map((set, i) =>
                i === index ? newSet : set
            )
        }));
    };

    const removeSet = (index) => {
        setActivity(prev => ({
            ...prev,
            sets: prev.sets.filter((_, i) => i !== index)
        }));
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setActivity(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdateActivity = () => {
        const updatedActivities = [...activities];
        const newExercise = {
            name: activity.title,
            type: activity.type,
            sets: activity.sets,
            notes: activity.notes // Add notes to the updated exercise
        };


        // Check if date has changed
        if (activity.date !== exercise.date) {
            // Remove exercise from old day
            updatedActivities[exercise.dayIndex].exercises.splice(exercise.exerciseIndex, 1);

            if (updatedActivities[exercise.dayIndex].exercises.length === 0) {
                updatedActivities.splice(exercise.dayIndex, 1);
            }

            const existingDayIndex = updatedActivities.findIndex(day => day.date === activity.date);
            if (existingDayIndex !== -1) {
                updatedActivities[existingDayIndex].exercises.push(newExercise);
            } else {
                updatedActivities.push({
                    date: activity.date,
                    exercises: [newExercise]
                });
            }
        } else {
            updatedActivities[exercise.dayIndex].exercises[exercise.exerciseIndex] = newExercise;
        }

        localStorage.setItem('activities', JSON.stringify(updatedActivities));
        setCurrentPage('home');
    };

    const handleDeleteActivity = () => {
        const updatedActivities = [...activities];
        updatedActivities[exercise.dayIndex].exercises.splice(exercise.exerciseIndex, 1);

        // Remove day if no exercises left
        if (updatedActivities[exercise.dayIndex].exercises.length === 0) {
            updatedActivities.splice(exercise.dayIndex, 1);
        }

        localStorage.setItem('activities', JSON.stringify(updatedActivities));
        setCurrentPage('home');
    };

    return (
        <div className="main-block p-6">
            <h1 className="text-4xl font-serif mb-8">Edit activity</h1>

            <div className="space-y-6">
                <div>
                    <label className="text-xl block mb-2">Title of activity</label>
                    <div className="flex items-center justify-between border-b border-gray-300 pb-2">
                        <input
                            type="text"
                            name="title"
                            className="text-xl bg-transparent w-full outline-none"
                            value={activity.title}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div>
                    <label className="text-xl block mb-2">Date</label>
                    <input
                        type="date"
                        name="date"
                        className="text-xl bg-transparent w-full outline-none border-b border-gray-300 pb-2"
                        value={activity.date}
                        onChange={handleInputChange}
                    />
                </div>

                <NotesSection activity={activity} handleInputChange={handleInputChange}/>

                <div>
                    <label className="text-xl block mb-2">Measurement type</label>
                    <div className="flex gap-4 border-b border-gray-300 pb-2">
                        <button
                            className={`flex items-center gap-2 px-4 py-2 rounded ${
                                activity.type === MEASUREMENT_TYPES.COUNT
                                    ? 'bg-[#E97451] text-white'
                                    : 'bg-gray-200'
                            }`}
                            onClick={() => {
                                setActivity(prev => ({
                                    ...prev,
                                    type: MEASUREMENT_TYPES.COUNT,
                                    sets: prev.sets.map(set => ({reps: set.reps || '', weight: set.weight || ''}))
                                }));
                            }}
                        >
                            <Hash className="h-5 w-5"/>
                            Count
                        </button>
                        <button
                            className={`flex items-center gap-2 px-4 py-2 rounded ${
                                activity.type === MEASUREMENT_TYPES.TIME
                                    ? 'bg-[#E97451] text-white'
                                    : 'bg-gray-200'
                            }`}
                            onClick={() => {
                                setActivity(prev => ({
                                    ...prev,
                                    type: MEASUREMENT_TYPES.TIME,
                                    sets: prev.sets.map(set => ({
                                        duration: set.duration || '',
                                        unit: set.unit || 'sec',
                                        weight: set.weight || ''
                                    }))
                                }));
                            }}
                        >
                            <Clock className="h-5 w-5"/>
                            Time
                        </button>
                    </div>
                </div>

                {activity.sets.map((set, index) => (
                    <div key={index} className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-xl">Set {index + 1}</label>
                            {index > 0 && (
                                <button
                                    onClick={() => removeSet(index)}
                                    className="text-red-500"
                                >
                                    <Trash2 className="h-5 w-5"/>
                                </button>
                            )}
                        </div>

                        {activity.type === MEASUREMENT_TYPES.COUNT ? (
                            <div>
                                <label className="text-xl block mb-2">Reps</label>
                                <input
                                    type="number"
                                    className="text-xl bg-transparent w-full outline-none border-b border-gray-300 pb-2"
                                    value={set.reps || ''}
                                    onChange={(e) => updateSet(index, {...set, reps: e.target.value})}
                                    placeholder="20"
                                />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xl block mb-2">Duration</label>
                                    <input
                                        type="number"
                                        className="text-xl bg-transparent w-full outline-none border-b border-gray-300 pb-2"
                                        value={set.duration || ''}
                                        onChange={(e) => updateSet(index, {...set, duration: e.target.value})}
                                        placeholder="60"
                                    />
                                </div>
                                <div>
                                    <label className="text-xl block mb-2">Unit</label>
                                    <select
                                        className="text-xl bg-transparent w-full outline-none border-b border-gray-300 pb-2"
                                        value={set.unit || 'sec'}
                                        onChange={(e) => updateSet(index, {...set, unit: e.target.value})}
                                    >
                                        {TIME_UNITS.map(unit => (
                                            <option key={unit.value} value={unit.value}>
                                                {unit.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="text-xl block mb-2">Weight (kg)</label>
                            <input
                                type="number"
                                className="text-xl bg-transparent w-full outline-none border-b border-gray-300 pb-2"
                                value={set.weight || ''}
                                onChange={(e) => updateSet(index, {...set, weight: e.target.value})}
                                placeholder="20"
                            />
                        </div>
                    </div>
                ))}

                <button
                    onClick={addSet}
                    className="w-full border-2 border-dashed border-gray-300 text-gray-500 py-3 rounded-lg text-xl hover:border-[#E97451] hover:text-[#E97451] transition-colors"
                >
                    Add set
                </button>

                <button
                    className="w-full bg-[#E97451] text-white py-4 rounded-lg text-xl"
                    onClick={handleUpdateActivity}
                >
                    Update
                </button>

                <button
                    className="w-full bg-red-500 mb-15 text-white py-4 rounded-lg text-xl"
                    onClick={handleDeleteActivity}
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default EditActivityPage;