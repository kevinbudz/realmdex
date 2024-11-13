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
        textSecondary: 'text-gray-600',
        button: 'bg-blue-500',
        buttonHover: 'hover:bg-blue-600'
    },
    dark: {
        name: 'Dark',
        bg: 'bg-gray-900',
        card: 'bg-gray-800',
        cardHover: 'hover:bg-gray-700',
        sidebar: 'bg-black',
        text: 'text-white',
        textSecondary: 'text-gray-300',
        button: 'bg-blue-500',
        buttonHover: 'hover:bg-blue-600'
    },
    darkPurple: {
        name: 'Blurple',
        bg: 'bg-purple-950',
        card: 'bg-purple-900',
        cardHover: 'hover:bg-purple-800',
        sidebar: 'bg-purple-950',
        text: 'text-purple-50',
        textSecondary: 'text-purple-200',
        button: 'bg-purple-500',
        buttonHover: 'hover:bg-purple-600'
    },
    darkPastelBlue: {
        name: 'Dark Blue',
        bg: 'bg-slate-950',
        card: 'bg-slate-900',
        cardHover: 'hover:bg-slate-800',
        sidebar: 'bg-slate-950',
        text: 'text-slate-50',
        textSecondary: 'text-slate-200',
        button: 'bg-slate-500',
        buttonHover: 'hover:bg-slate-600'
    },
    darkPastelGreen: {
        name: 'Pine',
        bg: 'bg-emerald-950',
        card: 'bg-emerald-900',
        cardHover: 'hover:bg-emerald-800',
        sidebar: 'bg-emerald-950',
        text: 'text-emerald-50',
        textSecondary: 'text-emerald-200',
        button: 'bg-emerald-500',
        buttonHover: 'hover:bg-emerald-600'
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