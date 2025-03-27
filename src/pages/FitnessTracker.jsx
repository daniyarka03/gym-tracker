import React, { useState, useEffect, useRef } from 'react';
import { User, Sparkles, Wand2, Shirt, Crown, Shield, Swords,  Home, BarChart2, ChevronRight, Plus, Edit2, Trash2, ChevronLeft, Clock, Hash, Download, Upload, NotebookPen } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

import { Toaster, toast } from 'react-hot-toast';

const Progress = ({ value }) => (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className="bg-[#E97451] h-2 rounded-full transition-all duration-300 ease-in-out"
        style={{ width: `${value}%` }}
      />
    </div>
  );

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatChartDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric'
    });
  };

  const MEASUREMENT_TYPES = {
    COUNT: 'count',
    TIME: 'time'
  };
  
  const TIME_UNITS = [
    { label: 'Seconds', value: 'sec' },
    { label: 'Minutes', value: 'min' },
    { label: 'Hours', value: 'hr' }
  ];
  


  const FitnessTracker = () => {
    const [currentPage, setCurrentPage] = useState('home');
  const [editingActivity, setEditingActivity] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', notes: '', postTitle: '' });
    const fileInputRef = useRef(null);
    
    const initialActivities = [
        {
            date: 'Today',
            exercises: [
                { 
                    name: 'Push ups',
                    type: 'count',
                    sets: [
                        { reps: 20, weight: '' },
                        { reps: 15, weight: '' }
                    ]
                },
                {
                    name: 'Plank',
                    type: 'time',
                    sets: [
                        { duration: 60, unit: 'sec' },
                        { duration: 45, unit: 'sec' }
                    ]
                }
            ]
        }
    ];

    const [activities, setActivities] = useState(initialActivities);

    const [importError, setImportError] = useState('');
    const [exportSuccess, setExportSuccess] = useState(false);

    useEffect(() => {
        const local = JSON.parse(localStorage.getItem('activities')) || [];
        const localASC = local.sort((a, b) => new Date(b.date) - new Date(a.date));
        setActivities(localASC.length ? localASC : initialActivities);
    }, []);

  // const SetInput = ({ set, index, type, onUpdate, onDelete }) => {
  //   return (
  //     <div className="flex items-center gap-4 mb-2">
  //       <span className="text-sm text-gray-500">Set {index + 1}</span>
  //
  //       {type === MEASUREMENT_TYPES.COUNT ? (
  //         <>
  //           <input
  //             type="number"
  //             className="w-20 p-2 border rounded"
  //             placeholder="Reps"
  //             value={set.reps || ''}
  //             onChange={(e) => onUpdate(index, { ...set, reps: parseInt(e.target.value) })}
  //           />
  //           <span>reps</span>
  //         </>
  //       ) : (
  //         <>
  //           <input
  //             type="number"
  //             className="w-20 p-2 border rounded"
  //             placeholder="Time"
  //             value={set.duration || ''}
  //             onChange={(e) => onUpdate(index, { ...set, duration: parseInt(e.target.value) })}
  //           />
  //           <select
  //             className="p-2 border rounded"
  //             value={set.unit}
  //             onChange={(e) => onUpdate(index, { ...set, unit: e.target.value })}
  //           >
  //             {TIME_UNITS.map(unit => (
  //               <option key={unit.value} value={unit.value}>{unit.label}</option>
  //             ))}
  //           </select>
  //         </>
  //       )}
  //
  //       <input
  //         type="number"
  //         className="w-20 p-2 border rounded"
  //         placeholder="Weight"
  //         value={set.weight || ''}
  //         onChange={(e) => onUpdate(index, { ...set, weight: e.target.value })}
  //       />
  //       <span>kg</span>
  //
  //       <button
  //         onClick={() => onDelete(index)}
  //         className="text-red-500"
  //       >
  //         <Trash2 className="h-4 w-4" />
  //       </button>
  //     </div>
  //   );
  // };

  const exportData = () => {
    const dataStr = JSON.stringify(activities, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `fitness_tracker_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
};


  const importData = (e) => {
    setImportError('');
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const importedData = JSON.parse(event.target.result);
            
            // Validate the imported data structure
            if (!Array.isArray(importedData)) {
                throw new Error('Invalid data format: expected an array');
            }
            
            // Basic validation of each activity
            importedData.forEach(day => {
                if (!day.date) throw new Error('Invalid data: missing date field');
                if (!Array.isArray(day.exercises)) throw new Error('Invalid data: exercises should be an array');
                
                day.exercises.forEach(exercise => {
                    if (!exercise.name) throw new Error('Invalid data: exercise missing name');
                    if (!exercise.type) throw new Error('Invalid data: exercise missing type');
                    if (!Array.isArray(exercise.sets)) throw new Error('Invalid data: sets should be an array');
                });
            });
            
            // Update state and localStorage
            setActivities(importedData);
            localStorage.setItem('activities', JSON.stringify(importedData));
            
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Import error:', error);
            setImportError(`Import failed: ${error.message}`);
        }
    };
    reader.readAsText(file);
};

  const ImportExportPanel = () => (
    <div className="border border-gray-200 rounded-md p-4 mb-6">
        <h2 className="text-lg font-medium mb-4">Import/Export Data</h2>
        
        <div className="flex flex-col gap-4">
            <div>
                <button 
                    onClick={exportData}
                    className="flex items-center gap-2 bg-[#E97451] text-white py-2 px-4 rounded-md hover:bg-[#D86440] transition-colors"
                >
                    <Download className="h-4 w-4" />
                    Export Data
                </button>
                {exportSuccess && (
                    <p className="text-green-600 text-sm mt-1">Export successful!</p>
                )}
            </div>
            
            <div>
                <label className="flex items-center gap-2 bg-gray-100 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors cursor-pointer">
                    <Upload className="h-4 w-4" />
                    Import Data
                    <input 
                        type="file" 
                        accept=".json" 
                        className="hidden" 
                        onChange={importData}
                        ref={fileInputRef}
                    />
                </label>
                {importError && (
                    <p className="text-red-600 text-sm mt-1">{importError}</p>
                )}
            </div>
        </div>
    </div>
);

const NotesModal = ({ isOpen, onClose, title, notes, postTitle="" }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.73)] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <h3 className="text-xl font-medium">{title} {postTitle}</h3>
        </div>
        <div className="p-5">
          <p className="text-gray-700 whitespace-pre-wrap">{notes}</p>
        </div>
        <div className="p-5 border-t border-gray-200 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-[#E97451] text-white rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => (
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
                  }}
            className="ml-2 text-gray-500 hover:text-[#E97451]"
          >
            <NotebookPen className="h-4 w-4" />
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
            setEditingActivity({
              dayIndex: index,
              exerciseIndex: exIndex,
              ...exercise,
              date: day.date
            });
            setCurrentPage('edit');
          }}
          className="text-gray-500 hover:text-[#E97451]"
        >
          <Edit2 className="h-5 w-5" />
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
          <Plus />
      </button>
  </div>
);

const NotesSection = ({ activity, handleInputChange }) => (
  <div>
    <label className="text-xl block mb-2">Notes</label>
    <textarea
      name="notes"
      className="w-full p-3 border border-gray-300 rounded-lg min-h-24 text-lg bg-transparent outline-none"
      placeholder="Add notes about this exercise..."
      value={activity.notes}
      onChange={handleInputChange}
    />
  </div>
);


const EditActivityPage = () => {
  const [activity, setActivity] = useState({
    title: editingActivity.name,
    date: editingActivity.date,
    type: editingActivity.type || MEASUREMENT_TYPES.COUNT,
    sets: editingActivity.sets || [],
    notes: editingActivity.notes || '' // Add notes field with existing value or empty string
  });

 

  const addSet = () => {
    setActivity(prev => ({
      ...prev,
      sets: [...prev.sets, 
        prev.type === MEASUREMENT_TYPES.COUNT 
          ? { reps: '', weight: '' }
          : { duration: '', unit: 'sec', weight: '' }
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
    const { name, value } = e.target;
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
    if (activity.date !== editingActivity.date) {
      // Remove exercise from old day
      updatedActivities[editingActivity.dayIndex].exercises.splice(editingActivity.exerciseIndex, 1);
      
      // Remove day if no exercises left
      if (updatedActivities[editingActivity.dayIndex].exercises.length === 0) {
        updatedActivities.splice(editingActivity.dayIndex, 1);
      }
      
      // Add to new day or create new day
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
      // Update exercise in same day
      updatedActivities[editingActivity.dayIndex].exercises[editingActivity.exerciseIndex] = newExercise;
    }

    localStorage.setItem('activities', JSON.stringify(updatedActivities));
    setActivities(updatedActivities);
    setCurrentPage('home');
  };

  const handleDeleteActivity = () => {
    const updatedActivities = [...activities];
    updatedActivities[editingActivity.dayIndex].exercises.splice(editingActivity.exerciseIndex, 1);
    
    // Remove day if no exercises left
    if (updatedActivities[editingActivity.dayIndex].exercises.length === 0) {
      updatedActivities.splice(editingActivity.dayIndex, 1);
    }

    localStorage.setItem('activities', JSON.stringify(updatedActivities));
    setActivities(updatedActivities);
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

        <NotesSection activity={activity} handleInputChange={handleInputChange} />

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
                  sets: prev.sets.map(set => ({ reps: set.reps || '', weight: set.weight || '' }))
                }));
              }}
            >
              <Hash className="h-5 w-5" />
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
                  sets: prev.sets.map(set => ({ duration: set.duration || '', unit: set.unit || 'sec', weight: set.weight || '' }))
                }));
              }}
            >
              <Clock className="h-5 w-5" />
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
                  <Trash2 className="h-5 w-5" />
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
                  onChange={(e) => updateSet(index, { ...set, reps: e.target.value })}
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
                    onChange={(e) => updateSet(index, { ...set, duration: e.target.value })}
                    placeholder="60"
                  />
                </div>
                <div>
                  <label className="text-xl block mb-2">Unit</label>
                  <select
                    className="text-xl bg-transparent w-full outline-none border-b border-gray-300 pb-2"
                    value={set.unit || 'sec'}
                    onChange={(e) => updateSet(index, { ...set, unit: e.target.value })}
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
                onChange={(e) => updateSet(index, { ...set, weight: e.target.value })}
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

  const NewActivityPage = () => {
    const [activity, setActivity] = useState({
      title: '',
      date: new Date().toISOString().split('T')[0],
      type: MEASUREMENT_TYPES.COUNT,
      sets: [{ reps: '', weight: '' }],
      notes: '' // Add notes field
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
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
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
      setActivity(prev => ({
        ...prev,
        title: exercise.name,
        type: exercise.type || MEASUREMENT_TYPES.COUNT,
        sets: exercise.sets || [{ reps: '', weight: '' }]
      }));
      setShowSuggestions(false);
    };
  
    const addSet = () => {
      setActivity(prev => ({
        ...prev,
        sets: [...prev.sets, 
          prev.type === MEASUREMENT_TYPES.COUNT 
            ? { reps: '', weight: '' }
            : { duration: '', unit: 'sec', weight: '' }
        ]
      }));
    };
  
    const updateSet = (index, field, value) => {
      setActivity(prev => ({
        ...prev,
        sets: prev.sets.map((set, i) => 
          i === index 
            ? { ...set, [field]: value }
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
                <ChevronRight className="text-[#E97451]" />
              </button>
            </div>
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
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
                    sets: [{ reps: '', weight: '' }]
                  }));
                }}
              >
                <Hash className="h-5 w-5" />
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
                    sets: [{ duration: '', unit: 'sec', weight: '' }]
                  }));
                }}
              >
                <Clock className="h-5 w-5" />
                Time
              </button>
            </div>
          </div>

          <NotesSection activity={activity} handleInputChange={handleInputChange} />
  
          {activity.sets.map((set, index) => (
            <div key={index} className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xl">Set {index + 1}</label>
                {index > 0 && (
                  <button 
                    onClick={() => removeSet(index)}
                    className="text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
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
              // Сохранение активности
              const newExercise = {
                name: activity.title,
                type: activity.type,
                sets: activity.sets,
                notes: activity.notes // Add notes to the saved exercise
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
              setActivities(updatedActivities);
              setCurrentPage('home');
            }}
          >
            Create
          </button>
        </div>
      </div>
    );
  };



  const ProfilePage = () => {
    const totalExercises = activities.reduce((acc, day) => acc + day.exercises.length, 0);
    
    const levels = [
      { name: "Muggle Beginner", threshold: 0, maxExercises: 10, icon: User, color: "bg-gray-500" },
      { name: "First-Year Wizard", threshold: 10, maxExercises: 25, icon: Wand2, color: "bg-blue-500" },
      { name: "Quidditch Apprentice", threshold: 25, maxExercises: 50, icon: Shirt, color: "bg-green-500" },
      { name: "Triwizard Competitor", threshold: 50, maxExercises: 100, icon: Swords, color: "bg-yellow-500" },
      { name: "Order of Phoenix Member", threshold: 100, maxExercises: 200, icon: Shield, color: "bg-purple-500" },
      { name: "Half-Blood Prince", threshold: 200, maxExercises: 300, icon: Crown, color: "bg-red-500" },
      { name: "Master of Death", threshold: 300, maxExercises: 500, icon: Sparkles, color: "bg-black" }
    ];
    
    const currentLevel = levels.findLast(level => totalExercises >= level.threshold) || levels[0];
    const nextLevel = levels.find(level => totalExercises < level.threshold) || levels[levels.length - 1];
    
    const levelProgress = totalExercises - currentLevel.threshold;
    const exercisesForNextLevel = nextLevel.threshold - currentLevel.threshold;
    const levelProgressPercentage = Math.min((levelProgress / exercisesForNextLevel) * 100, 100);
    
    const isMaxLevel = currentLevel === levels[levels.length - 1];
    const currentLevelIndex = levels.indexOf(currentLevel) + 1;
    const LevelIcon = currentLevel.icon;
    
   
    return (
      <div className="p-6 main-block">
        <h1 className="text-4xl font-serif mb-8">Profile</h1>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
          <div className={`w-16 h-16 ${currentLevel.color} rounded-full flex items-center justify-center`}>
              <LevelIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-medium">User</h2>
              <p className="text-gray-600">Level {currentLevelIndex}: {currentLevel.name}</p>
            </div>
          </div>
  
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-medium">Current Level</h3>
            <div className="flex items-center gap-2">
            <div className={`w-12 h-12 ${currentLevel.color} rounded-full flex items-center justify-center text-white font-bold`}>
                {currentLevelIndex}
              </div>
              <span className="text-lg font-medium">{currentLevel.name}</span>
            </div>
          </div>
  
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Level Progress</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{isMaxLevel ? "Master Level" : `Progress to Level ${currentLevelIndex + 1}`}</span>
                <span>
                  {isMaxLevel 
                    ? `${totalExercises}/${currentLevel.maxExercises} exercises`
                    : `${levelProgress}/${exercisesForNextLevel} exercises`}
                </span>
              </div>
              <Progress value={levelProgressPercentage} />
              {!isMaxLevel && (
                <p className="text-sm text-gray-500">
                  Next level: {nextLevel.name} ({nextLevel.threshold} exercises)
                </p>
              )}
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span>Total Progress</span>
              <span>{totalExercises} exercises completed</span>
            </div>
          </div>
        </div>
  
        <br />
        <ImportExportPanel />
      </div>
    );
  };

  const AnalyticsPage = () => {
    const totalWorkouts = activities.reduce((acc, day) => acc + day.exercises.length, 0);
    const uniqueExercises = new Set(activities.flatMap(day => 
      day.exercises.map(ex => ex.name)
    )).size;
    
    const exerciseStats = activities.flatMap(day => 
      day.exercises.map(ex => ex.name)
    ).reduce((acc, name) => {
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});
  
    const mostPopularExercise = Object.entries(exerciseStats)
      .sort(([,a], [,b]) => b - a)[0];
  
    // Подготовка данных для графиков
    const barChartData = Object.entries(exerciseStats).map(([name, count]) => ({
      name: name,
      count: count
    }));
  
    const pieChartData = Object.entries(exerciseStats).map(([name, count]) => ({
      name: name,
      value: count
    }));
    
    // Данные для календаря
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (year, month) => {
      return new Date(year, month + 1, 0).getDate();
    };
    
    const getFirstDayOfMonth = (year, month) => {
      return new Date(year, month, 1).getDay();
    };
    
    // Создаем карту дат с тренировками
    const workoutDates = activities.reduce((acc, day) => {
      acc[day.date] = day.exercises.length;
      return acc;
    }, {});

    const renderCalendar = () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();

      const daysInMonth = getDaysInMonth(year, month);
      let firstDay = getFirstDayOfMonth(year, month);
        // Сдвигаем первый день недели (вс -> 0, пн -> 1 ...)
      firstDay = firstDay === 0 ? 6 : firstDay - 1;

      // Генерируем массив дней
      let days = [];
      for (let i = 1; i <= daysInMonth; i++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const hasWorkout = workoutDates[dateStr] || 0;

        days.push({
          day: i,
          dateStr,
          hasWorkout
        });
      }

      // Добавляем дни предыдущего месяца для заполнения первой недели
      const prevMonthDays = [];
      if (firstDay > 0) {
        const prevMonth = month === 0 ? 11 : month - 1;
        const prevYear = month === 0 ? year - 1 : year;
        const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

        for (let i = 0; i < firstDay; i++) {
          const day = daysInPrevMonth - firstDay + i + 1;
          const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const hasWorkout = workoutDates[dateStr] || 0;

          prevMonthDays.push({
            day,
            dateStr,
            hasWorkout,
            isCurrentMonth: false
          });
        }
      }

      // Добавляем дни следующего месяца для заполнения последней недели
      const nextMonthDays = [];
      const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;

      for (let i = 1; i <= totalCells - (firstDay + daysInMonth); i++) {
        const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const hasWorkout = workoutDates[dateStr] || 0;

        nextMonthDays.push({
          day: i,
          dateStr,
          hasWorkout,
          isCurrentMonth: false
        });
      }

      return [...prevMonthDays, ...days.map(d => ({ ...d, isCurrentMonth: true })), ...nextMonthDays];
    };

    const changeMonth = (delta) => {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() + delta);
      setCurrentDate(newDate);
    };

    const calendarDays = renderCalendar();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const prepareWeightProgressData = () => {
      const exerciseWeights = {};
      
      activities.forEach(day => {
        day.exercises.forEach(exercise => {
          // Get maximum weight from all sets for this exercise
          const maxWeight = Math.max(...(exercise.sets || [])
            .map(set => parseFloat(set.weight) || 0)
          );
          
          if (maxWeight > 0) {
            if (!exerciseWeights[exercise.name]) {
              exerciseWeights[exercise.name] = [];
            }
            
            exerciseWeights[exercise.name].push({
              date: day.date,
              weight: maxWeight,
              formattedDate: formatChartDate(day.date)
            });
          }
        });
      });
    
      // Sort data by date for each exercise
      Object.keys(exerciseWeights).forEach(exercise => {
        exerciseWeights[exercise].sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // Remove duplicate dates, keeping the highest weight for each date
        exerciseWeights[exercise] = exerciseWeights[exercise].reduce((acc, curr) => {
          const existingEntry = acc.find(entry => entry.date === curr.date);
          if (!existingEntry) {
            acc.push(curr);
          } else if (curr.weight > existingEntry.weight) {
            existingEntry.weight = curr.weight;
          }
          return acc;
        }, []);
      });
    
      return exerciseWeights;
    };
  
    const weightProgressData = prepareWeightProgressData();
    const COLORS = ['#E97451', '#FF9B84', '#FFB4A2', '#FFCCBE', '#FFE5DC'];
  
    return (
      <div className="p-6 pb-24 main-block">
        <h1 className="text-4xl font-serif mb-8">Analytics</h1>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-[#E97451] text-lg mb-2">Overview</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xl">Total workouts</span>
                <span className="text-xl font-medium">{totalWorkouts}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xl">Unique exercises</span>
                <span className="text-xl font-medium">{uniqueExercises}</span>
              </div>
            </div>
          </div>
  
          {/* Календарь тренировок */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-[#E97451] text-lg mb-4">Workout Calendar</h2>
            
            <div className="flex justify-between items-center mb-4">
              <button onClick={() => changeMonth(-1)} className="p-2">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h3 className="text-xl font-medium">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <button onClick={() => changeMonth(1)} className="p-2">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {weekDays.map(day => (
                <div key={day} className="text-center p-2 text-gray-500">
                  {day}
                </div>
              ))}


              
              {calendarDays.map((day, index) => (
                <div 
                  key={index} 
                  className={`p-2 text-center rounded-md ${
                    day.isCurrentMonth 
                      ? day.hasWorkout > 0
                        ? 'bg-[#EE9C83] hover:bg-blue-300'
                        : 'bg-gray-100 hover:bg-gray-200'
                      : day.hasWorkout > 0
                        ? 'bg-blue-100 text-gray-500 hover:bg-blue-200'
                        : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  <div className="text-sm">{day.day}</div>
                  {day.hasWorkout > 0 && (
                    <div className="text-xs mt-1">{day.hasWorkout}x</div>
                  )}
                </div>
              ))}
            </div>
          </div>
  
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-[#E97451] text-lg mb-4">Exercise Distribution</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#E97451"
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
  
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-[#E97451] text-lg mb-4">Exercise Frequency</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#E97451" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
  
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-[#E97451] text-lg mb-2">Most popular</h2>
            <div className="space-y-3">
              {mostPopularExercise && (
                <div className="flex justify-between items-center">
                  <span className="text-xl">{mostPopularExercise[0]}</span>
                  <span className="text-xl font-medium">{mostPopularExercise[1]} times</span>
                </div>
              )}
            </div>
          </div>
  
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-[#E97451] text-lg mb-2">Exercise details</h2>
            <div className="space-y-3">
              {Object.entries(exerciseStats).map(([exercise, count]) => (
                <div key={exercise} className="flex justify-between items-center">
                  <span className="text-xl">{exercise}</span>
                  <span className="text-xl font-medium">{count} times</span>
                </div>
              ))}
            </div>
          </div>
  
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-[#E97451] text-lg mb-4">Weight Progress</h2>
            {Object.entries(weightProgressData).map(([exercise, data]) => (
              data.length > 0 && (
                <div key={exercise} className="mb-8">
                  <h3 className="text-lg font-medium mb-4">{exercise}</h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data}>
                        <XAxis 
                          dataKey="formattedDate" 
                          angle={-45} 
                          textAnchor="end" 
                          height={80}
                        />
                        <YAxis 
                          label={{ 
                            value: 'Weight (kg)', 
                            angle: -90, 
                            position: 'insideLeft' 
                          }}
                        />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="weight" 
                          stroke="#E97451" 
                          strokeWidth={2}
                          dot={{ fill: '#E97451' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  {data.length > 1 && (
                    <div className="mt-2 text-sm text-gray-600">
                      Progress: {data[0].weight}kg → {data[data.length - 1].weight}kg
                      ({((data[data.length - 1].weight - data[0].weight) / data[0].weight * 100).toFixed(1)}% change)
                    </div>
                  )}
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    );
  };
  

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-black">
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'new' && <NewActivityPage />}
      {currentPage === 'edit' && editingActivity && <EditActivityPage />}
      {currentPage === 'analytics' && <AnalyticsPage />}
      {currentPage === 'profile' && <ProfilePage />}
      <Toaster />

      <NotesModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title={modalContent.title} 
        notes={modalContent.notes} 
        postTitle={modalContent.postTitle}
      />

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around py-4">
          <button 
            className="flex flex-col items-center"
            onClick={() => setCurrentPage('home')}
          >
            <Home className={`h-6 w-6 ${currentPage === 'home' ? 'text-[#E97451]' : ''}`} />
          </button>
          <button 
            className="flex flex-col items-center"
            onClick={() => setCurrentPage('analytics')}
          >
            <BarChart2 className={`h-6 w-6 ${currentPage === 'analytics' ? 'text-[#E97451]' : ''}`} />
          </button>
          <button 
            className="flex flex-col items-center"
            onClick={() => setCurrentPage('profile')}
          >
            <User className={`h-6 w-6 ${currentPage === 'profile' ? 'text-[#E97451]' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FitnessTracker;