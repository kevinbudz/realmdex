// src/renderer/context/ThemeContext.jsx
import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const themes = {
    light: {
        name: 'Light',
        bg: 'bg-gray-100',
        card: 'bg-white',
        sidebar: 'bg-gray-800',
        text: 'text-gray-800',
        textSecondary: 'text-gray-600',
        hover: 'hover:bg-gray-50'
    },
    dark: {
        name: 'Dark',
        bg: 'bg-gray-900',
        card: 'bg-gray-800',
        sidebar: 'bg-black',
        text: 'text-white',
        textSecondary: 'text-gray-300',
        hover: 'hover:bg-gray-700'
    },
    darkPurple: {
        name: 'Dark Purple',
        bg: 'bg-gray-900',
        card: 'bg-gray-800',
        sidebar: 'bg-purple-900',
        text: 'text-white',
        textSecondary: 'text-purple-200',
        hover: 'hover:bg-purple-800'
    }
};

export const ThemeProvider = ({ children }) => {
    const [currentTheme, setCurrentTheme] = useState('light');

    return (
        <ThemeContext.Provider value={{ currentTheme, setCurrentTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};