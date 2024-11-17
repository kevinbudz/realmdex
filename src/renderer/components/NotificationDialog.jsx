// src/renderer/components/NotificationDialog.jsx
import React from 'react';
import { useTheme, themes } from '../context/ThemeContext';

const NotificationDialog = ({ message, onConfirm, onCancel }) => {
    const { currentTheme } = useTheme();

    // Determine text color based on theme
    const buttonTextClass = currentTheme === 'monochrome' ? 'text-white' : themes[currentTheme].text;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div
                className={`rounded-lg shadow-lg p-6 w-80 ${themes[currentTheme].card} transform transition-transform duration-300 hover:scale-105`}
            >
                <p className={`text-lg font-medium mb-4 ${themes[currentTheme].text}`}>
                    {message}
                </p>
                <div className="flex justify-end gap-4">
                    <button
                        className={`px-4 py-2 rounded ${themes[currentTheme].button} ${buttonTextClass}`}
                        onClick={onCancel}
                    >
                        No
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${themes[currentTheme].button} ${buttonTextClass}`}
                        onClick={onConfirm}
                    >
                        Yes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationDialog;