import React, {useState} from 'react';
import {
    User,
    Home,
    BarChart2,
} from 'lucide-react';

import {AchievementsPage} from "./AchievementsPage.jsx";
import NotesModal from "../components/NotesModal.jsx";
import {useModalStore} from "../stores/modalStore.js";
import HomePage from "./HomePage.jsx";
import NewActivityPage from "./NewActivityPage.jsx";
import EditActivityPage from "./EditActivityPage.jsx";
import AnalyticsPage from "./AnalyticsPage.jsx";
import ProfilePage from "./ProfilePage.jsx";
import {usePageNavigationStore} from "../stores/pageNavigationStore.js";
import {useLocalActivities} from "../hooks/useLocalActivities.js";

const FitnessTracker = () => {
    const currentPage = usePageNavigationStore((state) => state.currentPage);
    const setCurrentPage = usePageNavigationStore((state) => state.setCurrentPage);
    const isOpenModal = useModalStore((state) => state.isOpen);
    const setModalOpen = useModalStore((state) => state.setModalOpen);

    const [modalContent, setModalContent] = useState({title: '', notes: '', postTitle: ''});

    const activities = useLocalActivities();

    return (
        <div className="min-h-screen bg-[#FAF9F6] text-black">
            {currentPage === 'home' && <HomePage />}
            {currentPage === 'new' && <NewActivityPage />}
            {currentPage === 'edit' && <EditActivityPage />}
            {currentPage === 'analytics' && <AnalyticsPage activities={activities}/>}
            {currentPage === 'profile' && <ProfilePage activities={activities}/>}
            {currentPage === 'achievements' && <AchievementsPage activities={activities}/>}

            <NotesModal
                isOpen={isOpenModal}
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
                        <Home className={`h-6 w-6 ${currentPage === 'home' ? 'text-[#E97451]' : ''}`}/>
                    </button>
                    <button
                        className="flex flex-col items-center"
                        onClick={() => setCurrentPage('analytics')}
                    >
                        <BarChart2 className={`h-6 w-6 ${currentPage === 'analytics' ? 'text-[#E97451]' : ''}`}/>
                    </button>
                    <button
                        className="flex flex-col items-center"
                        onClick={() => setCurrentPage('profile')}
                    >
                        <User className={`h-6 w-6 ${currentPage === 'profile' ? 'text-[#E97451]' : ''}`}/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FitnessTracker;