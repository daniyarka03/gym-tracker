import React, { useState, useEffect } from 'react';
import {
    Swords,
} from 'lucide-react';
import {ACHIEVEMENTS} from "../utils/constants";
import {useLocalActivities} from "../hooks/useLocalActivities.js";

export const AchievementsPage = () => {

    const activities = useLocalActivities();
    const [achievements, setAchievements] = useState([]);

    useEffect(() => {
        const updatedAchievements = ACHIEVEMENTS.map(achievement => ({
            ...achievement,
            completed: achievement.condition(activities)
        }));
        setAchievements(updatedAchievements);
    }, [activities]);


    return (
        <div className="p-6 main-block">
            <h1 className="text-4xl font-serif mb-8">Achievements</h1>

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