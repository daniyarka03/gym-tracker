import React from "react";

const NotesSection = ({activity, handleInputChange}) => (
    <div>
        <label className="text-xl block mb-2">Notes</label>
        <textarea
            name="notes"
            className="w-full p-3 border border-gray-300 rounded-lg min-h-24 text-lg bg-transparent outline-none"
            placeholder="Add notes about this exercise..."
            value={activity.notes}
            onChange={handleInputChange}
        />
    </div>
);

export default NotesSection;