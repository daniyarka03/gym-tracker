import React, {useEffect, useState} from "react";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {
    Bar,
    BarChart,
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";


const formatChartDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
};

const AnalyticsPage = () => {
    const [activities, setActivities] = useState([]);
    useEffect(() => {
        const local = JSON.parse(localStorage.getItem('activities')) || [];
        const localASC = local.sort((a, b) => new Date(b.date) - new Date(a.date));
        setActivities(localASC.length ? localASC : []);
    }, []);
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
        .sort(([, a], [, b]) => b - a)[0];

    const barChartData = Object.entries(exerciseStats).map(([name, count]) => ({
        name: name,
        count: count
    }));

    const pieChartData = Object.entries(exerciseStats).map(([name, count]) => ({
        name: name,
        value: count
    }));

    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    const workoutDates = activities.reduce((acc, day) => {
        acc[day.date] = day.exercises.length;
        return acc;
    }, {});

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const daysInMonth = getDaysInMonth(year, month);
        let firstDay = getFirstDayOfMonth(year, month);
        firstDay = firstDay === 0 ? 6 : firstDay - 1;

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

        return [...prevMonthDays, ...days.map(d => ({...d, isCurrentMonth: true})), ...nextMonthDays];
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

        Object.keys(exerciseWeights).forEach(exercise => {
            exerciseWeights[exercise].sort((a, b) => new Date(a.date) - new Date(b.date));

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
                            <ChevronLeft className="h-5 w-5"/>
                        </button>
                        <h3 className="text-xl font-medium">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h3>
                        <button onClick={() => changeMonth(1)} className="p-2">
                            <ChevronRight className="h-5 w-5"/>
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
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                    ))}
                                </Pie>
                                <Tooltip/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h2 className="text-[#E97451] text-lg mb-4">Exercise Frequency</h2>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barChartData}>
                                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80}/>
                                <YAxis/>
                                <Tooltip/>
                                <Bar dataKey="count" fill="#E97451"/>
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
                                            <Tooltip/>
                                            <Line
                                                type="monotone"
                                                dataKey="weight"
                                                stroke="#E97451"
                                                strokeWidth={2}
                                                dot={{fill: '#E97451'}}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                                {data.length > 1 && (
                                    <div className="mt-2 text-sm text-gray-600">
                                        Progress: {data[0].weight}kg → {data[data.length - 1].weight}kg
                                        ({((data[data.length - 1].weight - data[0].weight) / data[0].weight * 100).toFixed(1)}%
                                        change)
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

export default AnalyticsPage;