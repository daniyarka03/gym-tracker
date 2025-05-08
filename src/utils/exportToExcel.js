import * as XLSX from 'xlsx';

export const exportToExcel = (activities) => {
    const excelData = activities.flatMap(day =>
        day.exercises.map(exercise => ({
            Date: day.date,
            Exercise: exercise.name,
            Type: exercise.type,
            Reps: exercise.sets.map(set =>
                exercise.type === 'count'
                    ? `${set.reps} reps. (${set.weight || 'without weight'})`
                    : `${set.duration} ${set.unit}`
            ).join(', ')
        }))
    );

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Create workbook and export
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Exercises");
    XLSX.writeFile(workbook, `fitness_tracker_${new Date().toISOString().split('T')[0]}.xlsx`);
};