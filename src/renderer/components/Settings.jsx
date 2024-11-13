// src/renderer/components/Settings.jsx
import React from 'react';
import { useTheme, themes } from '../context/ThemeContext';  // Add themes import
import { Check } from 'lucide-react';

const ThemeOption = ({ id, name, current, onClick }) => (
    <div
        onClick={() => onClick(id)}
        className={`relative p-4 rounded-lg cursor-pointer transition-all duration-200 
                   ${current === id ? 'ring-2 ring-blue-500' : 'hover:bg-opacity-80'}
                   ${themes[id].card} ${themes[id].text}`}
    >
        <div className="flex items-center justify-between">
            <div>
                <h3 className="font-medium">{name}</h3>
            </div>
            {current === id && (
                <Check size={20} className="text-blue-500" />
            )}
        </div>
        
        {/* Theme Preview */}
        <div className="mt-3 flex gap-2">
            <div className={`w-6 h-6 rounded ${themes[id].sidebar}`}></div>
            <div className={`flex-1 h-6 rounded ${themes[id].bg}`}></div>
        </div>
    </div>
);

const Settings = () => {
    const { currentTheme, setCurrentTheme } = useTheme();

    const themeOptions = 
    [{
        id: 'light',
        name: 'Light',
        description: ''
    },
    {
        id: 'dark',
        name: 'Dark',
        description: ''
    },
    {
        id: 'darkPurple',
        name: 'Blurple',
        description: ''
    },
    {
        id: 'darkPastelBlue',
        name: 'Dark Blue',
        description: ''
    },
    {
        id: 'darkPastelGreen',
        name: 'Pine',
        description: ''
    }];

    return (
        <div className={`flex-1 ${themes[currentTheme].bg} p-6 overflow-auto`}>
            <div className="max-w-2xl mx-auto">
                <h2 className={`text-2xl font-bold mb-6 ${themes[currentTheme].text}`}>
                    Settings
                </h2>
                
                <div className={`bg-opacity-50 rounded-lg p-6 mb-6 ${themes[currentTheme].card}`}>
                    <h3 className={`text-lg font-semibold mb-4 ${themes[currentTheme].text}`}>
                        Theme
                    </h3>
                    <div className="grid gap-4">
                        {themeOptions.map(theme => (
                            <ThemeOption
                                key={theme.id}
                                id={theme.id}
                                name={theme.name}
                                current={currentTheme}
                                onClick={setCurrentTheme}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;