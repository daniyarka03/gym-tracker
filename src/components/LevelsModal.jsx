import React, { useState } from 'react';
import { levels } from '../utils/levelsProfile.js';

const LevelsModal = ({ currentLevel, totalExercises }) => {
    const [isOpen, setIsOpen] = useState(false);

    const getCurrentLevelIndex = () => {
        return levels.findIndex(level => level === currentLevel);
    };

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const currentLevelIndex = getCurrentLevelIndex();

    return (
        <>
            <button
                onClick={openModal}
                className="w-full mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
                View All Levels
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-[rgba(0,0,0,0.73)] bg-opacity-50 z-50 flex items-center justify-center"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto p-6 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
                        >
                            ✕
                        </button>

                        <h2 className="text-2xl font-bold mb-6 text-center">Levels Overview</h2>

                        <div className="relative pl-8">
                            {/* Vertical Line */}
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-200">
                                <div
                                    className="absolute top-0 left-0 w-1 bg-green-500 transition-all duration-500"
                                    style={{
                                        height: `${((currentLevelIndex + 1) / levels.length) * 100}%`
                                    }}
                                ></div>
                            </div>

                            {levels.map((level, index) => {
                                const LevelIcon = level.icon;
                                const isPassed = index <= currentLevelIndex;
                                const isCurrentLevel = index === currentLevelIndex;

                                return (
                                    <div
                                        key={level.name}
                                        className="relative pl-12 pb-8 last:pb-0"
                                    >
                                        {/* Checkpoint */}
                                        <div
                                            className={`
                        absolute left-[-20px] top-0 w-10 h-10 rounded-full flex items-center justify-center
                        ${level.color} text-white
                        ${isPassed
                                                ? 'opacity-100'
                                                : 'opacity-50'}
                      `}
                                        >
                                            <LevelIcon className="w-5 h-5" />
                                        </div>

                                        {/* Level Card */}
                                        <div
                                            className={`
                        rounded-lg p-4 shadow-md
                        ${isPassed
                                                ? 'bg-gray-100 border border-gray-200'
                                                : 'bg-white border'}
                        ${isCurrentLevel
                                                ? 'ring-2 ring-green-500 border-green-500'
                                                : ''}
                      `}
                                        >
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h3 className="text-lg font-medium">{level.name}</h3>
                                                    <p className="text-sm text-gray-500">
                                                        {level.threshold} exercises
                                                    </p>
                                                </div>
                                                {isPassed && (
                                                    <span className="text-green-600 font-bold">✓</span>
                                                )}
                                            </div>

                                            {isCurrentLevel && (
                                                <div className="mt-2 text-sm">
                                                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                                        <div
                                                            className="bg-green-600 h-2.5 rounded-full"
                                                            style={{
                                                                width: `${Math.min((totalExercises / level.maxExercises) * 100, 100)}%`
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <p className="text-xs text-gray-600 mt-1">
                                                        {totalExercises}/{level.maxExercises} exercises
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default LevelsModal;