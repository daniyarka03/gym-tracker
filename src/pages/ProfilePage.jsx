import {observer} from "mobx-react-observer";
import {levels} from '../utils/levelsProfile';
import LevelsModal from "../components/LevelsModal.jsx";
import {Medal} from "lucide-react";
import ImportExportPanel from "../components/ImportExportPanel.jsx";
import React, {useState} from "react";
import {usePageNavigationStore} from "../stores/pageNavigationStore.js";

const Progress = ({value}) => (
    <div className="w-full bg-gray-200 rounded-full h-2">
        <div
            className="bg-[#E97451] h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{width: `${value}%`}}
        />
    </div>
);


const ProfilePage = ({activities}) => {
    const totalExercises = activities.reduce((acc, day) => acc + day.exercises.length, 0);
    const currentPage = usePageNavigationStore((state) => state.currentPage);
    const setCurrentPage = usePageNavigationStore((state) => state.setCurrentPage);
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
                    <div
                        className={`w-16 h-16 ${currentLevel.color} rounded-full flex items-center justify-center`}>
                        <LevelIcon className="w-8 h-8 text-white"/>
                    </div>
                    <div>
                        <h2 className="text-2xl font-medium">User</h2>
                        <p className="text-gray-600">Level {currentLevelIndex}: {currentLevel.name}</p>
                    </div>
                </div>

                <LevelsModal
                    currentLevel={currentLevel}
                    totalExercises={totalExercises}
                />

                <button onClick={() => setCurrentPage('achievements')}
                        className="achievement-button flex items-center gap-2 bg-[#E97451] text-white py-2 px-4 rounded-md hover:bg-[#D86440] transition-colors">
                    Achievements <Medal
                    className={`h-6 w-6 ${currentPage === 'achievements' ? 'text-[#E97451]' : ''}`}/>
                </button>


                <div className="space-y-4 mb-6">
                    <h3 className="text-lg font-medium">Current Level</h3>
                    <div className="flex items-center gap-2">
                        <div
                            className={`w-12 h-12 ${currentLevel.color} rounded-full flex items-center justify-center text-white font-bold`}>
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
                        <Progress value={levelProgressPercentage}/>
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

            <br/>
            <ImportExportPanel activities={activities} />
        </div>
    );
};

export default ProfilePage;