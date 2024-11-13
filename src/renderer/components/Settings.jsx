// src/renderer/components/Settings.jsx
import React from 'react';
import { useTheme, themes } from '../context/ThemeContext';
import { Check, Folder, Monitor, Download } from 'lucide-react';
import { remote } from '@electron/remote';
const path = require('path');
const fs = require('fs');

// Component for handling directory selection
const DirectorySelector = ({ label, value, onChange, icon: Icon, placeholder }) => {
    const { currentTheme } = useTheme();
    
    const handleSelect = async () => {
        try {
            const result = await remote.dialog.showOpenDialog({
                properties: ['openDirectory']
            });
            
            if (!result.canceled && result.filePaths.length > 0) {
                onChange(result.filePaths[0]);
            }
        } catch (error) {
            console.error('Failed to open dialog:', error);
        }
    };

    return (
        <div className={`${themes[currentTheme].card} p-4 rounded-lg`}>
            <label className="flex flex-col gap-2">
                <span className={`flex items-center gap-2 ${themes[currentTheme].text} font-medium`}>
                    <Icon size={20} />
                    {label}
                </span>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={value || ''}
                        placeholder={placeholder}
                        readOnly
                        className={`flex-1 px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 ${themes[currentTheme].text}`}
                    />
                    <button
                        onClick={handleSelect}
                        className={`px-4 py-2 ${themes[currentTheme].button} ${themes[currentTheme].buttonHover} 
                                  text-white rounded flex items-center gap-2 transition-colors duration-200`}
                    >
                        <Folder size={16} />
                        Browse
                    </button>
                </div>
            </label>
        </div>
    );
};

// Component for selecting and displaying theme options
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
            
            {/* Theme Preview */}
            <div className="mt-3 flex gap-2">
                <div className={`w-6 h-6 rounded ${themes[id].sidebar}`}></div>
                <div className={`flex-1 h-6 rounded ${themes[id].bg}`}></div>
            </div>
        </div>
    );
};

// Main Settings component with default download path logic
const Settings = () => {
    const { currentTheme, setCurrentTheme } = useTheme();
    const [paths, setPaths] = React.useState({
        flashPlayerPath: '',
        downloadsPath: ''
    });
    const [saved, setSaved] = React.useState(false);

    const themeOptions = [
        { id: 'light', name: 'Light' },
        { id: 'dark', name: 'Dark' },
        { id: 'darkPurple', name: 'Blurple' },
        { id: 'darkPastelBlue', name: 'Dark Blue' },
        { id: 'darkPastelGreen', name: 'Pine' },
        { id: 'solarizedLight', name: 'Solarized Light' },
        { id: 'solarizedDark', name: 'Solarized Dark' },
        { id: 'monochrome', name: 'Monochrome' },
        { id: 'highContrast', name: 'High Contrast' }
    ];

    // Load paths and attempt to use reasonable defaults
    React.useEffect(() => {
        loadPaths();
    }, []);

    const loadPaths = () => {
        try {
            const userDataPath = remote.app.getPath('userData');
            const settingsPath = path.join(userDataPath, 'settings.json');
            
            if (fs.existsSync(settingsPath)) {
                const loadedSettings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
                setPaths(loadedSettings);
            } else {
                // Set defaults
                const defaultSettings = {
                    flashPlayerPath: '',
                    downloadsPath: path.join(remote.app.getPath('downloads'), 'FlashGames') // Default path
                };
                setPaths(defaultSettings);
                savePaths(defaultSettings);
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    };

    const savePaths = (newPaths) => {
        try {
            const userDataPath = remote.app.getPath('userData');
            const settingsPath = path.join(userDataPath, 'settings.json');
            fs.writeFileSync(settingsPath, JSON.stringify(newPaths, null, 2));
            
            // Show saved indicator
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    };

    const handlePathChange = (key, value) => {
        const newPaths = { ...paths, [key]: value };
        setPaths(newPaths);
        savePaths(newPaths);
    };

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

                {/* Theme Settings */}
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

                {/* Directory Settings */}
                <div className={`bg-opacity-50 rounded-lg p-6 mb-6 ${themes[currentTheme].card}`}>
                    <h3 className={`text-lg font-semibold mb-4 ${themes[currentTheme].text}`}>
                        Directories
                    </h3>
                    <div className="space-y-4">
                        <DirectorySelector
                            label="Flash Player Standalone Directory"
                            value={paths.flashPlayerPath}
                            onChange={(value) => handlePathChange('flashPlayerPath', value)}
                            icon={Monitor}
                            placeholder="Select Flash Player directory..."
                        />

                        <DirectorySelector
                            label="Downloads Directory"
                            value={paths.downloadsPath}
                            onChange={(value) => handlePathChange('downloadsPath', value)}
                            icon={Download}
                            placeholder="Select downloads directory..."
                        />
                    </div>
                </div>

                {/* Help Text */}
                <div className={`mt-4 text-sm ${themes[currentTheme].textSecondary}`}>
                    <h3 className="font-medium mb-2">About these settings:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Flash Player Standalone is required to play .swf files</li>
                        <li>Downloads directory is where your games will be stored</li>
                        <li>Settings are saved automatically</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Settings;