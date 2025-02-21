import React, { useState, useEffect } from 'react';
import { Home, BarChart2, User, ChevronRight, Plus, Edit2, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
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

const FitnessTracker = () => {
    const [currentPage, setCurrentPage] = useState('home');
  const [editingActivity, setEditingActivity] = useState(null);
  const initialActivities = [
    {
      date: 'Today',
      exercises: [
        { name: 'Push ups', reps: '20x', weight: '' },
        { name: 'Sitdowns', reps: '20x', weight: '' },
        { name: 'Back exercise', weight: '25kg', sets: '3x10' },
        { name: 'Legs exercise', weight: '12kg', sets: '3x12' }
      ]
    },
    {
      date: 'Feb 17',
      exercises: [
        { name: 'Push ups', reps: '20x', weight: '' },
        { name: 'Sitdowns', reps: '20x', weight: '' }
      ]
    }
  ];

  const [activities, setActivities] = useState(initialActivities);
  const [newActivity, setNewActivity] = useState({
    title: '',
    date: '',
    reps: '',
    weight: ''
  });

  useEffect(() => {
    const local = JSON.parse(localStorage.getItem('activities')) || [];
    setActivities(local.length ? local : initialActivities);
  }, []);

  const HomePage = () => (
    <div className="main-block p-6">
      <h1 className="text-4xl font-serif mb-8">Trainings</h1>
      
      {activities.map((day, index) => (
        <div key={index} className="mb-8">
          <h2 className="text-[#E97451] text-lg mb-4">{formatDate(day.date)}</h2>
          
          {day.exercises.map((exercise, exIndex) => (
            <div key={exIndex} className="mb-4 border-b border-gray-200 pb-4">
              <div className="flex justify-between items-center">
                <span className="text-xl">{exercise.name}</span>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xl">
                      {exercise.reps || `${exercise.sets}`}
                    </span>
                    {exercise.weight && (
                      <div className="text-sm text-gray-600">
                        Weight: {exercise.weight}
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
          ))}
        </div>
      ))}
      <button 
        onClick={() => setCurrentPage('new')}
        className="fixed bottom-20 right-6 w-14 h-14 bg-[#E97451] rounded-full flex items-center justify-center text-white text-3xl"
      >
        <Plus />
      </button>
    </div>
  );

  const EditActivityPage = () => {
    const [activity, setActivity] = useState({
      title: editingActivity.name,
      date: editingActivity.date,
      reps: editingActivity.reps ? editingActivity.reps.replace('x', '') : '',
      weight: editingActivity.weight ? editingActivity.weight.replace('kg', '') : ''
    });

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
        reps: activity.reps ? `${activity.reps}x` : null,
        weight: activity.weight ? `${activity.weight}kg` : '',
      };

      const existingDay = updatedActivities[editingActivity.dayIndex];
      existingDay.exercises[editingActivity.exerciseIndex] = newExercise;

      localStorage.setItem('activities', JSON.stringify(updatedActivities));
      setActivities(updatedActivities);
      setCurrentPage('home');
    };

    const handleDeleteActivity = () => {
      const updatedActivities = [...activities];
      updatedActivities[editingActivity.dayIndex].exercises.splice(editingActivity.exerciseIndex, 1);
      
      // Удаляем день, если упражнений больше нет
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

          <div>
            <label className="text-xl block mb-2">Reps</label>
            <input 
              type="text"
              name="reps"
              className="text-xl bg-transparent w-full outline-none border-b border-gray-300 pb-2"
              value={activity.reps}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="text-xl block mb-2">Weight (kg)</label>
            <input 
              type="text"
              name="weight"
              className="text-xl bg-transparent w-full outline-none border-b border-gray-300 pb-2"
              value={activity.weight}
              onChange={handleInputChange}
            />
          </div>

          <button 
            className="w-full bg-[#E97451] text-white py-4 rounded-lg text-xl"
            onClick={handleUpdateActivity}
          >
            Update
          </button>

          <button 
            className="w-full bg-red-500 text-white py-4 rounded-lg text-xl"
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
      reps: '',
      weight: ''
    });

    const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const getUniqueExercises = () => {
    const local = JSON.parse(localStorage.getItem('activities')) || [];
    const exercises = local.flatMap(day => 
      day.exercises.map(ex => ({
        name: ex.name,
        reps: ex.reps || '',
        weight: ex.weight || ''
      }))
    );
    
    // Удаляем дубликаты по имени
    return Array.from(new Map(exercises.map(ex => [ex.name, ex])).values());
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setActivity(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'title') {
      // Фильтруем подсказки при вводе
      const exerciseSuggestions = getUniqueExercises()
        .filter(ex => ex.name.toLowerCase().includes(value.toLowerCase()));
      setSuggestions(exerciseSuggestions);
      setShowSuggestions(exerciseSuggestions.length > 0);
    }
  };

    const handleCreateNewActivity = () => {
      if (!activity.title || !activity.date) return;
      const local = JSON.parse(localStorage.getItem('activities')) || [];
      const activities = local.length ? local : initialActivities;
  
      const newExercise = {
        name: activity.title,
        reps: activity.reps ? `${activity.reps}x` : null,
        weight: activity.weight ? `${activity.weight}kg` : '',
      };
  
      const existingDateIndex = activities.findIndex(day => day.date === activity.date);
  
      if (existingDateIndex !== -1) {
        setActivities((prevActivities) => {
          const updatedActivities = [...prevActivities];
          updatedActivities[existingDateIndex].exercises.push(newExercise);
          localStorage.setItem('activities', JSON.stringify(updatedActivities));
          return updatedActivities; // Возвращаем новое состояние
        });
      } else {
        setActivities((prevActivities) => {
          const newActivities = [
            ...prevActivities,
            {
              date: activity.date,
              exercises: [newExercise],
            },
          ];
          localStorage.setItem('activities', JSON.stringify(newActivities));
          return newActivities; // Возвращаем новое состояние
        });
      }

      
     
      setActivity({
        title: '',
        date: new Date().toISOString().split('T')[0],
        reps: '',
        weight: ''
      });
      setCurrentPage('home');
    };

    const selectExercise = (exercise) => {
        setActivity(prev => ({
          ...prev,
          title: exercise.name,
          reps: exercise.reps ? exercise.reps.replace('x', '') : '',
          weight: exercise.weight ? exercise.weight.replace('kg', '') : ''
        }));
        setShowSuggestions(false);
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
                  <div className="text-sm text-gray-600">
                    {exercise.reps && `Reps: ${exercise.reps}`}
                    {exercise.weight && ` Weight: ${exercise.weight}`}
                  </div>
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
            <label className="text-xl block mb-2">Reps</label>
            <input 
              type="text"
              name="reps"
              placeholder="20"
              className="text-xl bg-transparent w-full outline-none border-b border-gray-300 pb-2"
              value={activity.reps}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="text-xl block mb-2">Weight (kg)</label>
            <input 
              type="text"
              name="weight"
              placeholder="20"
              className="text-xl bg-transparent w-full outline-none border-b border-gray-300 pb-2"
              value={activity.weight}
              onChange={handleInputChange}
            />
          </div>

          <button 
            className="w-full bg-[#E97451] text-white py-4 rounded-lg text-xl mt-8"
            onClick={handleCreateNewActivity}
          >
            Create
          </button>
        </div>
      </div>
    );
  };

  const ProfilePage = () => {
    const totalExercises = activities.reduce((acc, day) => acc + day.exercises.length, 0);
    const progressPercentage = Math.min((totalExercises / 100) * 100, 100);

    return (
      <div className="p-6">
        <h1 className="text-4xl font-serif mb-8">Profile</h1>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-[#E97451] rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-medium">User</h2>
              <p className="text-gray-600">Fitness Enthusiast</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Progress</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Level Progress</span>
                <span>{totalExercises}/100 exercises</span>
              </div>
              <Progress value={progressPercentage} />
            </div>
          </div>
        </div>
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

    const prepareWeightProgressData = () => {
        const exerciseWeights = {};
        
        activities.forEach(day => {
          day.exercises.forEach(exercise => {
            if (exercise.weight) {
              if (!exerciseWeights[exercise.name]) {
                exerciseWeights[exercise.name] = [];
              }
              exerciseWeights[exercise.name].push({
                date: day.date,
                weight: parseInt(exercise.weight),
                formattedDate: formatDate(day.date)
              });
            }
          });
        });
  
        // Сортируем данные по дате для каждого упражнения
        Object.keys(exerciseWeights).forEach(exercise => {
          exerciseWeights[exercise].sort((a, b) => new Date(a.date) - new Date(b.date));
        });
  
        return exerciseWeights;
      };
  
      const weightProgressData = prepareWeightProgressData();
  
    const COLORS = ['#E97451', '#FF9B84', '#FFB4A2', '#FFCCBE', '#FFE5DC'];
  
    return (
      <div className="p-6 pb-24">
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