export const exportToCSV = (activities) => {
    const rows = [['Date', 'Exercise', 'Type', 'Reps']];

    activities.forEach(day => {
        day.exercises.forEach(exercise => {
            const reps = exercise.sets.map(set =>
                exercise.type === 'count'
                    ? `${set.reps} reps (${set.weight || 'no weight'})`
                    : `${set.duration} ${set.unit}`
            ).join(', ');

            rows.push([day.date, exercise.name, exercise.type, reps]);
        });
    });

    const csvContent = rows.map(row =>
        row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    const blob = new Blob(
        ['\uFEFF' + csvContent], // ← UTF-8 BOM
        { type: 'text/csv;charset=utf-8;' }
    );

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `fitness_tracker_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
