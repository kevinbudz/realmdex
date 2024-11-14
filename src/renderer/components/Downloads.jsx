// src/renderer/components/Downloads.jsx
import React from 'react';
import { Download, ChevronRight, Trash2, Users, User } from 'lucide-react';
import { useTheme, themes } from '../context/ThemeContext';
import { useGameData } from '../hooks/useGameData';
import { useDownloadsManager } from '../hooks/useDownloadsManager';
import { useNotifications, NotificationType } from '../components/Notifications';
import { shell } from 'electron';
const path = require('path');

const DownloadCard = ({ game }) => {
    const { currentTheme } = useTheme();
    const { downloadGame, isGameDownloaded, getGameFiles, updateManifest, paths, uninstallGame } = useDownloadsManager();
    const { addNotification } = useNotifications();
    const [isDownloaded, setIsDownloaded] = React.useState(false);
    const [isDownloading, setIsDownloading] = React.useState(false);

    React.useEffect(() => {
        setIsDownloaded(isGameDownloaded(game.id));
    }, [game.id, isGameDownloaded]);

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const success = await downloadGame(game);
            if (success) {
                setIsDownloaded(true);
                addNotification(
                    NotificationType.SUCCESS,
                    `Successfully downloaded ${game.title}`
                );
            } else {
                addNotification(
                    NotificationType.ERROR,
                    `Failed to download ${game.title}`
                );
            }
        } catch (error) {
            addNotification(
                NotificationType.ERROR,
                `Download error: ${error.message}`
            );
        } finally {
            setIsDownloading(false);
        }
    };

    const handleUninstall = () => {
        if (!paths) {
            console.error('Paths not initialized!');
            return;
        }
        
        // Use uninstallGame method from the hook to handle uninstallation directly
        uninstallGame(game.id);

        setIsDownloaded(false);
        addNotification(
            NotificationType.SUCCESS,
            `${game.title} uninstalled successfully.`
        );
    };

    return (
        <div className={`relative group rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${themes[currentTheme].card}`}>
            <div className="relative w-full pt-[100%]">
                <img 
                    src={game.altBanner || game.banner} 
                    alt={game.title}
                    className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-60 transition-opacity duration-300`} />

                <div className="absolute top-4 right-4 flex items-center gap-3">
                    <span className="flex items-center gap-1 text-white text-sm text-shadow-sm">
                        <Users size={14} className="drop-shadow" />
                    </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col">
                    <h3 className="text-2xl font-bold text-white mb-2 text-shadow-lg">
                        {game.title}
                    </h3>
                    <p className="text-gray-200 text-sm mb-4 line-clamp-2 leading-relaxed text-shadow">
                        {game.description}
                    </p>

                    <div className="flex gap-2">
                        {isDownloaded ? (
                            <>
                                <button className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                                    <ChevronRight size={18} />
                                    <span className="font-medium">
                                        Already Downloaded
                                    </span>
                                </button>
                                <button 
                                    onClick={handleUninstall}
                                    className="flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </>
                        ) : (
                            <button 
                                onClick={handleDownload}
                                disabled={isDownloading}
                                className={`w-full ${isDownloading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'}
                                          text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 
                                          transition-all duration-200 group shadow-lg hover:shadow-xl`}
                            >
                                {isDownloading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span className="font-medium">
                                            Downloading...
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <Download size={18} />
                                        <span className="font-medium">
                                            Download
                                        </span>
                                        <ChevronRight size={16} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const Downloads = () => {
    const { currentTheme } = useTheme();
    const { games, isLoading } = useGameData();

    const handleServerRedirect = () => {
        shell.openExternal('https://github.com/kevinbudz/realmdex'); // Opens URL in the external browser
    };

    if (isLoading) {
        return (
            <div className={`flex-1 ${themes[currentTheme].bg} p-4 flex items-center justify-center custom-scrollbar`}>
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <p className={`${themes[currentTheme].text}`}>Loading available games...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex-1 ${themes[currentTheme].bg} p-8 overflow-auto custom-scrollbar`}>
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {games.map((game) => (
                        <DownloadCard key={game.id} game={game} />
                    ))}
                    <div
                        className={`relative group rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-xl ${themes[currentTheme].card}`}
                        onClick={handleServerRedirect}
                    >
                        <div className="relative w-full pt-[56.25%] ${themes[currentTheme].card} flex items-center justify-center">
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <User size={30} className={themes[currentTheme].text} />
                                <div className="text-center">
                                    <h3 className={`${themes[currentTheme].textSecondary}`}>Wanna add your server?</h3>
                                    <p className={`${themes[currentTheme].textSecondary}`}>Click here!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Downloads;