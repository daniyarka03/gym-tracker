import React, { useState, useEffect } from 'react';
import {
    Swords,
} from 'lucide-react';
import * as XLSX from 'xlsx';

const ACHIEVEMENTS = [
    {
        id: 1,
        title: "Первые шаги",
        description: "Добавь первую тренировку",
        icon: <Swords color="gold" size={24} />,
        condition: (activities) => activities.length > 0
    },
    {
        id: 2,
        title: "Недельный марафон",
        description: "Добавь 7 тренировок за неделю",
        icon: <Swords color="orange" size={24} />,
        condition: (activities) => {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            const recentActivities = activities.filter(
                activity => new Date(activity.date) >= oneWeekAgo
            );
            return recentActivities.length >= 7;
        }
    },
    {
        id: 3,
        title: "Мастер Push-ups",
        description: "Выполни 100 отжиманий",
        icon: <Swords color="blue" size={24} />,
        condition: (activities) => {
            const totalPushUps = activities.reduce((total, day) => {
                const pushUpExercises = day.exercises.filter(
                    ex => ex.name.toLowerCase().includes('push up')
                );
                return total + pushUpExercises.reduce((sum, exercise) => {
                    return sum + exercise.sets.reduce((setSum, set) => setSum + (set.reps || 0), 0);
                }, 0);
            }, 0);
            return totalPushUps >= 100;
        }
    }
];

export const AchievementsPage = ({ activities }) => {
    const [achievements, setAchievements] = useState([]);

    useEffect(() => {
        // Check and update achievements based on activities
        const updatedAchievements = ACHIEVEMENTS.map(achievement => ({
            ...achievement,
            completed: achievement.condition(activities)
        }));
        setAchievements(updatedAchievements);
    }, [activities]);

    const exportAchievementsToExcel = () => {
        const exportData = achievements.map(achievement => ({
            Название: achievement.title,
            Описание: achievement.description,
            Выполнено: achievement.completed ? 'Да' : 'Нет'
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Достижения");
        XLSX.writeFile(workbook, `achievements_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    return (
        <div className="p-6 main-block">
            <h1 className="text-4xl font-serif mb-8">Достижения</h1>

            <button
                onClick={exportAchievementsToExcel}
                className="mb-4 flex items-center gap-2 bg-[#E97451] text-white py-2 px-4 rounded-md hover:bg-[#D86440] transition-colors"
            >
                <Swords className="h-4 w-4" />
                Экспорт достижений
            </button>

            <div className="space-y-4">
                {achievements.map((achievement) => (
                    <div
                        key={achievement.id}
                        className={`flex items-center p-4 border rounded-lg ${
                            achievement.completed
                                ? 'bg-green-50 border-green-200'
                                : 'bg-gray-50 border-gray-200'
                        }`}
                    >
                        <div className="mr-4">
                            {achievement.icon}
                        </div>
                        <div className="flex-grow">
                            <h3 className="font-semibold">{achievement.title}</h3>
                            <p className="text-sm text-gray-500">{achievement.description}</p>
                        </div>
                        {achievement.completed && (
                            <Swords color="green" size={20} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};