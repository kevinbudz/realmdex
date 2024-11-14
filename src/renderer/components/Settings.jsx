// src/renderer/components/Settings.jsx
import React, { useEffect, useState } from 'react';
import { useTheme, themes } from '../context/ThemeContext';
import { Check, Folder, Monitor, Download } from 'lucide-react';
const path = require('path');
const fs = require('fs');

// Assume 'flashplayer.exe' is stored under resources/flashplayer
const defaultFlashPlayerPath = path.join(__dirname, 'resources', 'flashplayer_11.exe');

// Default to a dedicated downloads directory in userData
const defaultDownloadsPath = path.join(process.env.USERPROFILE || process.env.HOME, 'FlashGames');

const ensureDirExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// Component for displaying directory selection but not requiring input
const DirectorySelector = ({ label, value, icon: Icon, placeholder, isReadOnly = true }) => {
    const { currentTheme } = useTheme();
    return (
        <div className={`${themes[currentTheme].card} p-4 rounded-lg`}>
            <label className="flex flex-col gap-2">
                <span className={`flex items-center gap-2 ${themes[currentTheme].text} font-medium`}>
                    <Icon size={20} />
                    {label}
                </span>
                <input
                    type="text"
                    value={value || ''}
                    placeholder={placeholder}
                    readOnly={isReadOnly}
                    className={`flex-1 px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 ${themes[currentTheme].text}`}
                />
            </label>
        </div>
    );
};

const ThemeOption = ({ id, name, current, onClick }) => {
    return (
        <div
            onClick={() => onClick(id)}
            className={`relative p-4 rounded-lg cursor-pointer transition-all duration-200 
                       ${current === id ? `ring-2 ring-${themes[id].button.split('bg-')[1]}` : 'hover:bg-opacity-80'}
                       ${themes[id].card} ${themes[id].text}`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-medium">{name}</h3>
                </div>
                {current === id && (
                    <Check size={20} className={themes[id].button.replace('bg-', 'text-')} />
                )}
            </div>
            
            <div className="mt-3 flex gap-2">
                <div className={`w-6 h-6 rounded ${themes[id].sidebar}`}></div>
                <div className={`flex-1 h-6 rounded ${themes[id].bg}`}></div>
            </div>
        </div>
    );
};

const Settings = () => {
    const { currentTheme, setCurrentTheme } = useTheme();
    const [paths, setPaths] = useState({
        flashPlayerPath: defaultFlashPlayerPath,
        downloadsPath: defaultDownloadsPath
    });
    const [saved, setSaved] = useState(false);

    const themeOptions = [
        { id: 'light', name: 'Light' },
        { id: 'dark', name: 'Dark' },
        { id: 'darkPurple', name: 'Purple' },
        { id: 'darkPastelBlue', name: 'Dark Blue' },
        { id: 'darkPastelGreen', name: 'Pine' },
        { id: 'solarizedLight', name: 'Solarized Light' },
        { id: 'solarizedDark', name: 'Solarized Dark' },
        { id: 'monochrome', name: 'Monochrome' }
    ];

    useEffect(() => {}, []);

    return (
        <div className={`flex-1 ${themes[currentTheme].bg} p-6 overflow-auto`}>
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className={`text-2xl font-bold ${themes[currentTheme].text}`}>
                        Settings
                    </h2>
                    {saved && (
                        <div className="flex items-center gap-2 text-green-500">
                            <Check size={20} />
                            <span>Settings saved</span>
                        </div>
                    )}
                </div>            

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

                <div className={`mt-4 text-sm ${themes[currentTheme].textSecondary}`}>
                    <h3 className="font-medium mb-2">About these settings:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>A default Flash Player Standalone executable will be used if not configured.</li>
                        <li>A default downloads directory is set.</li>
                        <li>Settings are saved automatically.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Settings;