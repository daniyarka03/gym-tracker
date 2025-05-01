import React from "react";
import {useModalStore} from "../stores/modalStore.js";

const NotesModal = () => {
    const isOpen = useModalStore((state) => state.isOpen);
    const title = useModalStore((state) => state.title);
    const notes = useModalStore((state) => state.notes);
    const setModalOpen = useModalStore((state) => state.setModalOpen);
    console.log("Modal isOpen:", isOpen); // <--- проверка
    if (!isOpen) return null;

    const onCloseModal = () => {
        setModalOpen(false);
    }

    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.73)] bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md mx-4 overflow-hidden">
                <div className="p-5 border-b border-gray-200">
                    <h3 className="text-xl font-medium">{title} </h3>
                </div>
                <div className="p-5">
                    <p className="text-gray-700 whitespace-pre-wrap">{notes}</p>
                </div>
                <div className="p-5 border-t border-gray-200 flex justify-end">
                    <button
                        onClick={() => onCloseModal()}
                        className="px-4 py-2 bg-[#E97451] text-white rounded-md"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotesModal;