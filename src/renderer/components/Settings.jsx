import React, { useState, useEffect } from 'react';
import { useTheme, themes } from '../context/ThemeContext';
import { Check } from 'lucide-react';
import { useDownloadsManager } from '../hooks/useDownloadsManager';

const Settings = () => {
    const { currentTheme, setCurrentTheme } = useTheme();
    const { isVersionDownloaded, downloadFlashPlayerVersion } = useDownloadsManager();
    const [currentFlashPlayer, setCurrentFlashPlayer] = useState('11');
    const [saved, setSaved] = useState(false);

    const availableFlashPlayers = [
        { version: '11', description: 'Flash Player 11', url: 'https://kevinbudz.github.io/flashplayer_11.exe' },
        { version: '18', description: 'Flash Player 18', url: 'https://example.com/flashplayer_18.exe' },
        { version: '32', description: 'Flash Player 32', url: 'https://example.com/flashplayer_32.exe' },
    ];

    useEffect(() => {
        const savedFlashPlayer = localStorage.getItem('flashPlayerVersion');
        if (savedFlashPlayer) {
            setCurrentFlashPlayer(savedFlashPlayer);
        }
    }, []);

    const handleFlashPlayerChange = async (newVersion) => {
        if (!isVersionDownloaded(newVersion)) {
            const selectedPlayer = availableFlashPlayers.find(p => p.version === newVersion);
            await downloadFlashPlayerVersion(selectedPlayer.url, newVersion);
        }
        setCurrentFlashPlayer(newVersion);
        localStorage.setItem('flashPlayerVersion', newVersion);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

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

    return (
        <div className={`flex-1 ${themes[currentTheme].bg} p-6 overflow-auto custom-scrollbar`}>
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
                        Default Flash Player
                    </h3>
                    <div className="flex flex-col gap-4">
                        {availableFlashPlayers.map(player => (
                            <div
                                key={player.version}
                                onClick={() => handleFlashPlayerChange(player.version)}
                                className={`cursor-pointer p-4 rounded-md transition-all duration-200
                                    ${currentFlashPlayer === player.version ? 'bg-blue-500 text-white' : `${themes[currentTheme].card} ${themes[currentTheme].text}`}`}
                            >
                                {player.description}
                            </div>
                        ))}
                    </div>
                </div>

                <div className={`bg-opacity-50 rounded-lg p-6 mb-6 ${themes[currentTheme].card}`}>
                    <h3 className={`text-lg font-semibold mb-4 ${themes[currentTheme].text}`}>
                        Theme
                    </h3>
                    <div className="grid gap-4">
                        {themeOptions.map(theme => (
                            <div
                                key={theme.id}
                                onClick={() => setCurrentTheme(theme.id)}
                                className={`relative cursor-pointer p-4 rounded-lg transition-all duration-200 
                                           ${currentTheme === theme.id ? `ring-2 ring-${themes[theme.id].button.split('bg-')[1]}` : 'hover:bg-opacity-80'}
                                           ${themes[theme.id].card} ${themes[theme.id].text}`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium">{theme.name}</h3>
                                    </div>
                                    {currentTheme === theme.id && (
                                        <Check size={20} className={themes[theme.id].button.replace('bg-', 'text-')} />
                                    )}
                                </div>
                                <div className="mt-3 flex gap-2">
                                    <div className={`w-6 h-6 rounded ${themes[theme.id].sidebar}`}></div>
                                    <div className={`flex-1 h-6 rounded ${themes[theme.id].bg}`}></div>
                                </div>
                            </div>
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