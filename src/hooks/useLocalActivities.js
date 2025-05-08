import { useEffect, useState } from 'react';

export const useLocalActivities = () => {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const local = JSON.parse(localStorage.getItem('activities')) || [];
        const localASC = local.sort((a, b) => new Date(b.date) - new Date(a.date));
        setActivities(localASC.length ? localASC : []);
    }, []);

    return activities;
};
