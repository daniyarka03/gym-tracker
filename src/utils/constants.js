export const MEASUREMENT_TYPES = {
    COUNT: 'count',
    TIME: 'time'
};

export const TIME_UNITS = [
    {label: 'Seconds', value: 'sec'},
    {label: 'Minutes', value: 'min'},
    {label: 'Hours', value: 'hr'}
];

export const ACHIEVEMENTS = [
    {
        id: 1,
        title: "The first steps",
        description: "Add the first exercise",
        icon: "",
        condition: (activities) => activities.length > 0
    }
];