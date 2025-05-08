import React, { useState, useEffect } from 'react';
import {
    Swords,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import {ACHIEVEMENTS} from "../utils/constants";
import {useLocalActivities} from "../hooks/useLocalActivities.js";


export const AchievementsPage = () => {

    const activities = useLocalActivities();
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
            Name: achievement.title,
            Description: achievement.description,
            Done: achievement.completed ? 'Yes' : 'No'
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Achievements");
        XLSX.writeFile(workbook, `achievements_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    return (
        <div className="p-6 main-block">
            <h1 className="text-4xl font-serif mb-8">Achievements</h1>

            <button
                onClick={exportAchievementsToExcel}
                className="mb-4 flex items-center gap-2 bg-[#E97451] text-white py-2 px-4 rounded-md hover:bg-[#D86440] transition-colors"
            >
                <Swords className="h-4 w-4" />
                Export achievements
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