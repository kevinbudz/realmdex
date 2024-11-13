import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = {
    light: {
        name: 'Light',
        bg: 'bg-gray-100',
        card: 'bg-white',
        cardHover: 'hover:bg-gray-50',
        sidebar: 'bg-gray-800',
        text: 'text-gray-800',
        textSecondary: 'text-gray-600'
    },
    dark: {
        name: 'Dark',
        bg: 'bg-gray-900',
        card: 'bg-gray-800',
        cardHover: 'hover:bg-gray-700',
        sidebar: 'bg-black',
        text: 'text-white',
        textSecondary: 'text-gray-300'
    },
    darkPurple: {
        name: 'Dark Purple',
        bg: 'bg-deep-purple-950',     // Almost black with purple tint
        card: 'bg-deep-purple-900',   // Very dark purple
        cardHover: 'hover:bg-deep-purple-800',
        sidebar: 'bg-deep-purple-950',
        text: 'text-deep-purple-50',
        textSecondary: 'text-deep-purple-200'
    },
    darkPastelBlue: {
        name: 'Dark Pastel Blue',
        bg: 'bg-slate-950', // Almost black blue
        card: 'bg-slate-900',
        cardHover: 'hover:bg-slate-800',
        sidebar: 'bg-slate-950',
        text: 'text-slate-50',
        textSecondary: 'text-slate-200'
    },
    darkPastelGreen: {
        name: 'Dark Pastel Green',
        bg: 'bg-emerald-950', // Almost black green
        card: 'bg-emerald-900',
        cardHover: 'hover:bg-emerald-800',
        sidebar: 'bg-emerald-950',
        text: 'text-emerald-50',
        textSecondary: 'text-emerald-200'
    }
};

export const ThemeProvider = ({ children }) => {
    const [currentTheme, setCurrentTheme] = useState(() => {
        try {
            const savedTheme = localStorage.getItem('theme');
            return savedTheme || 'light';
        } catch {
            return 'light';
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('theme', currentTheme);
        } catch (error) {
            console.error('Failed to save theme preference:', error);
        }
    }, [currentTheme]);

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