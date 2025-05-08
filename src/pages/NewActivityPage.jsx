// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from "react";
import {MEASUREMENT_TYPES, TIME_UNITS} from "../utils/constants";
import {
    ChevronRight,
    Trash2,
    Clock,
    Hash,
} from 'lucide-react';
import NotesSection from "../components/NotesSection.jsx";
import {usePageNavigationStore} from "../stores/pageNavigationStore.js";
import {useModalStore} from "../stores/modalStore.js";

const NewActivityPage = () => {
    const setCurrentPage = usePageNavigationStore((state) => state.setCurrentPage);
    const setModalContent = useModalStore((state) => state.setModalContent);
    const setModalOpen = useModalStore((state) => state.setModalOpen);
    const initialActivities = [
        {
            date: 'Today',
            exercises: [
                {
                    name: 'Push ups',
                    type: 'count',
                    sets: [
                        {reps: 20, weight: ''},
                        {reps: 15, weight: ''}
                    ]
                },
                {
                    name: 'Plank',
                    type: 'time',
                    sets: [
                        {duration: 60, unit: 'sec'},
                        {duration: 45, unit: 'sec'}
                    ]
                }
            ]
        }
    ];

    const [activities, setActivities] = useState(initialActivities);

    const [activity, setActivity] = useState({
        title: '',
        date: new Date().toISOString().split('T')[0],
        type: MEASUREMENT_TYPES.COUNT,
        sets: [{reps: '', weight: ''}],
        notes: ''
    });

    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState([]);


    const getUniqueExercises = () => {
        const local = JSON.parse(localStorage.getItem('activities')) || [];
        const exercises = local.flatMap(day =>
            day.exercises.map(ex => ({
                name: ex.name,
                type: ex.type || MEASUREMENT_TYPES.COUNT,
                sets: ex.sets || []
            }))
        );
        return Array.from(new Map(exercises.map(ex => [ex.name, ex])).values());
    };

    useEffect(() => {
        const local = JSON.parse(localStorage.getItem('activities')) || [];
        const localASC = local.sort((a, b) => new Date(b.date) - new Date(a.date));
        setActivities(localASC.length ? localASC : initialActivities);
    }, []);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setActivity(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'title') {
            const exerciseSuggestions = getUniqueExercises()
                .filter(ex => ex.name.toLowerCase().includes(value.toLowerCase()));
            setSuggestions(exerciseSuggestions);
            setShowSuggestions(exerciseSuggestions.length > 0);
        }
    };

    const selectExercise = (exercise) => {
        const local = JSON.parse(localStorage.getItem('activities')) || [];

        const pastExercises = local
            .filter(day =>
                day.exercises.some(ex => ex.name === exercise.name)
            )
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        const lastExercisePerformed = pastExercises.length > 0
            ? pastExercises[0].exercises.find(ex => ex.name === exercise.name)
            : null;

        const lastSets = lastExercisePerformed
            ? lastExercisePerformed.sets
            : [{reps: '', weight: ''}];

        setActivity(prev => ({
            ...prev,
            title: exercise.name,
            type: lastExercisePerformed?.type || exercise.type || MEASUREMENT_TYPES.COUNT,
            sets: lastSets
        }));
        setShowSuggestions(false);
    };

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

    const updateSet = (index, field, value) => {
        setActivity(prev => ({
            ...prev,
            sets: prev.sets.map((set, i) =>
                i === index
                    ? {...set, [field]: value}
                    : set
            )
        }));
    };

    const removeSet = (index) => {
        setActivity(prev => ({
            ...prev,
            sets: prev.sets.filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="main-block p-6">
            <h1 className="text-4xl font-serif mb-8">New activity</h1>

            <div className="space-y-6">
                <div>
                    <label className="text-xl block mb-2">Title of activity</label>
                    <div className="flex items-center justify-between border-b border-gray-300 pb-2">
                        <input
                            type="text"
                            name="title"
                            placeholder="Push ups"
                            className="text-xl bg-transparent w-full outline-none"
                            value={activity.title}
                            onChange={handleInputChange}
                            onFocus={() => {
                                const exercises = getUniqueExercises();
                                setSuggestions(exercises);
                                setShowSuggestions(exercises.length > 0);
                            }}
                        />
                        <button
                            onClick={() => setShowSuggestions(prev => !prev)}
                            className="focus:outline-none"
                        >
                            <ChevronRight className="text-[#E97451]"/>
                        </button>
                    </div>
                    {showSuggestions && suggestions.length > 0 && (
                        <div
                            className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                            {suggestions.map((exercise, index) => (
                                <button
                                    key={index}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:outline-none"
                                    onClick={() => selectExercise(exercise)}
                                >
                                    <div className="text-lg">{exercise.name}</div>
                                </button>
                            ))}
                        </div>
                    )}
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
                                    sets: [{reps: '', weight: ''}]
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
                                    sets: [{duration: '', unit: 'sec', weight: ''}]
                                }));
                            }}
                        >
                            <Clock className="h-5 w-5"/>
                            Time
                        </button>
                    </div>
                </div>

                <NotesSection activity={activity} handleInputChange={handleInputChange}/>

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
                                    value={set.reps}
                                    onChange={(e) => updateSet(index, 'reps', e.target.value)}
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
                                        value={set.duration}
                                        onChange={(e) => updateSet(index, 'duration', e.target.value)}
                                        placeholder="60"
                                    />
                                </div>
                                <div>
                                    <label className="text-xl block mb-2">Unit</label>
                                    <select
                                        className="text-xl bg-transparent w-full outline-none border-b border-gray-300 pb-2"
                                        value={set.unit}
                                        onChange={(e) => updateSet(index, 'unit', e.target.value)}
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
                                value={set.weight}
                                onChange={(e) => updateSet(index, 'weight', e.target.value)}
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
                    className="w-full bg-[#E97451] mb-15 text-white py-4 rounded-lg text-xl"
                    onClick={() => {
                        if (activity.title === '') {
                            setModalContent({
                                title: "Ошибка!",
                                notes: "Заполните название упражнения"
                            });
                            setModalOpen(true);
                            return;
                        }

                        const newExercise = {
                            name: activity.title,
                            type: activity.type,
                            sets: activity.sets,
                            notes: activity.notes
                        };

                        const updatedActivities = [...activities];
                        const existingDayIndex = updatedActivities.findIndex(day => day.date === activity.date);

                        if (existingDayIndex !== -1) {
                            updatedActivities[existingDayIndex].exercises.push(newExercise);
                        } else {
                            updatedActivities.push({
                                date: activity.date,
                                exercises: [newExercise]
                            });
                        }

                        localStorage.setItem('activities', JSON.stringify(updatedActivities));

                        const updatedActivities2 = updatedActivities.sort((a, b) => new Date(b.date) - new Date(a.date));

                        setActivities(updatedActivities2);
                        setCurrentPage('home');
                    }}
                >
                    Create
                </button>
            </div>
        </div>
    );
};

export default NewActivityPage;