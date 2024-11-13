// src/renderer/context/ThemeContext.jsx
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
        sidebar: 'bg-purple-700',  // Changed to a different shade for contrast
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
        sidebar: 'bg-blue-800',  // Changed to a different shade for contrast
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
        sidebar: 'bg-green-800',  // Changed to a different shade for contrast
        text: 'text-emerald-50',
        textSecondary: 'text-emerald-200',
        button: 'bg-emerald-500',
        buttonHover: 'hover:bg-emerald-600'
    },
    solarizedLight: {
        name: 'Solarized Light',
        bg: 'bg-[#fdf6e3]',
        card: 'bg-[#eee8d5]',
        cardHover: 'hover:bg-[#e8e0c7]',
        sidebar: 'bg-[#d5c39b]',
        text: 'text-[#586e75]',
        textSecondary: 'text-[#657b83]',
        button: 'bg-[#268bd2]',
        buttonHover: 'hover:bg-[#2692d6]'
    },
    solarizedDark: {
        name: 'Solarized Dark',
        bg: 'bg-[#002b36]',
        card: 'bg-[#073642]',
        cardHover: 'hover:bg-[#0b3a4a]',
        sidebar: 'bg-[#0b3a4a]',
        text: 'text-[#839496]',
        textSecondary: 'text-[#93a1a1]',
        button: 'bg-[#268bd2]',
        buttonHover: 'hover:bg-[#268fd2]'
    },
    monochrome: {
        name: 'Monochrome',
        bg: 'bg-[#d5d5d5]',
        card: 'bg-[#ffffff]',
        cardHover: 'hover:bg-[#e5e5e5]',
        sidebar: 'bg-[#c5c5c5]',
        text: 'text-[#1a1a1a]',
        textSecondary: 'text-[#2a2a2a]',
        button: 'bg-[#404040]',
        buttonHover: 'hover:bg-[#505050]'
    },
    highContrast: {
        name: 'High Contrast',
        bg: 'bg-[#000000]',
        card: 'bg-[#ffffff]',
        cardHover: 'hover:bg-[#e0e0e0]',
        sidebar: 'bg-[#ffcc00]',
        text: 'text-[#000000]',
        textSecondary: 'text-[#333333]',
        button: 'bg-[#ff0000]',
        buttonHover: 'hover:bg-[#ff3333]'
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