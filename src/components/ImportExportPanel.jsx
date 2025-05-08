import {Download, Upload} from "lucide-react";
import {exportToExcel} from "../utils/exportToExcel.js";
import React, {useRef, useState} from "react";

const ImportExportPanel = ({activities}) => {
    const [importError, setImportError] = useState('');
    const [exportSuccess, setExportSuccess] = useState(false);
    const fileInputRef = useRef(null);
    const exportData = () => {
        const dataStr = JSON.stringify(activities, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `fitness_tracker_export_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setExportSuccess(true);
        setTimeout(() => setExportSuccess(false), 3000);
    };

    const importData = (e) => {
        setImportError('');
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedData = JSON.parse(event.target.result);

                // Validate the imported data structure
                if (!Array.isArray(importedData)) {
                    throw new Error('Invalid data format: expected an array');
                }

                // Basic validation of each activity
                importedData.forEach(day => {
                    if (!day.date) throw new Error('Invalid data: missing date field');
                    if (!Array.isArray(day.exercises)) throw new Error('Invalid data: exercises should be an array');

                    day.exercises.forEach(exercise => {
                        if (!exercise.name) throw new Error('Invalid data: exercise missing name');
                        if (!exercise.type) throw new Error('Invalid data: exercise missing type');
                        if (!Array.isArray(exercise.sets)) throw new Error('Invalid data: sets should be an array');
                    });
                });

                // Update state and localStorage
                localStorage.setItem('activities', JSON.stringify(importedData));

                // Reset file input
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            } catch (error) {
                console.error('Import error:', error);
                setImportError(`Import failed: ${error.message}`);
            }
        };
        reader.readAsText(file);
    };

 return (
     <div className="border border-gray-200 rounded-md p-4 mb-6">
         <h2 className="text-lg font-medium mb-4">Import/Export Data</h2>

         <div className="flex gap-4">
             <div>
                 <button
                     onClick={exportData}
                     className="flex items-center gap-2 bg-[#E97451] text-white py-2 px-4 rounded-md hover:bg-[#D86440] transition-colors"
                 >
                     <Download className="h-4 w-4"/>
                     Export Data
                 </button>
                 {exportSuccess && (
                     <p className="text-green-600 text-sm mt-1">Export successful!</p>
                 )}
             </div>

             <div>
                 <button
                     onClick={() => exportToExcel(activities)}
                     className="flex items-center gap-2 bg-[#E97451] text-white py-2 px-4 rounded-md hover:bg-[#D86440] transition-colors"
                 >
                     <Download className="h-4 w-4"/>
                     Export Data in EXCEL
                 </button>
                 {exportSuccess && (
                     <p className="text-green-600 text-sm mt-1">Export successful!</p>
                 )}
             </div>

             <div>
                 <label
                     className="flex items-center gap-2 bg-gray-100 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors cursor-pointer">
                     <Upload className="h-4 w-4"/>
                     Import Data
                     <input
                         type="file"
                         accept=".json"
                         className="hidden"
                         onChange={importData}
                         ref={fileInputRef}
                     />
                 </label>
                 {importError && (
                     <p className="text-red-600 text-sm mt-1">{importError}</p>
                 )}
             </div>
         </div>
     </div>
 )
};

export default ImportExportPanel;