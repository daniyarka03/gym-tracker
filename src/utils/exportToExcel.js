import * as XLSX from 'xlsx';

export const exportToExcel = (activities) => {
    // Transform activities for Excel export
    const excelData = activities.flatMap(day =>
        day.exercises.map(exercise => ({
            Дата: day.date,
            Упражнение: exercise.name,
            Тип: exercise.type,
            Подходы: exercise.sets.map(set =>
                exercise.type === 'count'
                    ? `${set.reps} повт. (${set.weight || 'без веса'})`
                    : `${set.duration} ${set.unit}`
            ).join(', ')
        }))
    );

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Create workbook and export
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Тренировки");
    XLSX.writeFile(workbook, `fitness_tracker_${new Date().toISOString().split('T')[0]}.xlsx`);
};