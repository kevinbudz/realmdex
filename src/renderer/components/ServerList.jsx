// src/renderer/components/ServerList.jsx
import React, { useEffect, useState } from 'react';
import { useTheme, themes } from '../context/ThemeContext';
import { useGameData } from '../hooks/useGameData';
import { useNotifications, NotificationType } from '../components/Notifications';
import { useDownloadsManager } from '../hooks/useDownloadsManager';
import { Download, ChevronRight, Plus, User, RefreshCw } from 'lucide-react';
import { useGameLauncher } from '../hooks/useGameLauncher';
import fs from 'fs';
import fetch from 'node-fetch'; // Ensure node-fetch is available

const FlashIcon = () => (
    <svg width="16" height="16" viewBox="0 0 512 512" fill="currentColor">
        <path d="M440.8,11.2H71.2C37.6,11.2,11.2,37.6,11.2,71.2v369.6c0,33.6,26.4,60,60,60h369.6c33.6,0,60-26.4,60-60V71.2C500.8,37.6,474.4,11.2,440.8,11.2z M380.4,270.8l-119.2,180c-4,6-10.4,9.2-16.8,9.2c-4,0-8.4-1.2-12-3.6c-9.2-6-12-18.4-6-27.6l91.2-137.6H220.4c-8.4,0-16-4.8-19.6-12.4c-3.6-7.6-2.4-16.4,2.8-22.8L322,74c6.4-8,18-9.2,26-2.8c8,6.4,9.2,18,2.8,26L266,208h114c7.6,0,14.8,4,18.8,10.8C402.8,225.2,402,235.2,396.8,242L380.4,270.8z"/>
    </svg>
);

const AirIcon = () => (
    <svg width="16" height="16" viewBox="0 0 512 512" fill="currentColor">
        <path d="M480,0H32C14.4,0,0,14.4,0,32v448c0,17.6,14.4,32,32,32h448c17.6,0,32-14.4,32-32V32C512,14.4,497.6,0,480,0z M364.8,294.4c-6.4,12.8-16,24-28.8,32c-12.8,8-27.2,12.8-44.8,12.8h-60.8l-19.2,60.8h-52.8l76.8-240h97.6c17.6,0,32,4.8,44.8,12.8c11.2,8,20.8,19.2,25.6,32c4.8,12.8,6.4,27.2,3.2,43.2C403.2,265.6,392,283.2,364.8,294.4z"/>
        <path d="M347.2,208c-1.6-6.4-4.8-11.2-9.6-14.4c-4.8-3.2-11.2-4.8-19.2-4.8h-44.8l-22.4,70.4h44.8c8,0,14.4-1.6,20.8-4.8c6.4-3.2,11.2-8,14.4-14.4c3.2-6.4,4.8-12.8,4.8-19.2C347.2,216,347.2,211.2,347.2,208z"/>
    </svg>
);

const DiscordIcon = () => (
  <svg width="20" height="20" viewBox="0 -28.5 256 256" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
    <g>
      <path d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z" fill="#cccccd" fill-rule="nonzero"></path>
    </g>
  </svg>
);

const ServerCard = ({ game }) => {
    const { currentTheme } = useTheme();
    const { isGameDownloaded, downloadGame, isReady, getGameFiles } = useDownloadsManager();
    const { launchSWF, launchAIR, isExtracting } = useGameLauncher();
    const { addNotification } = useNotifications();
    const [isDownloaded, setIsDownloaded] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [playerCount, setPlayerCount] = useState(null);

    useEffect(() => {
        if (isReady) {
            setIsDownloaded(isGameDownloaded(game.id));
        }
    }, [isReady, game.id, isGameDownloaded]);

    // Fetch the player count
    const fetchPlayerCount = async () => {
        try {
            const response = await fetch(game.playerCountUrl);
            if (response.ok) {
                const count = await response.text();
                setPlayerCount(count);
            } else {
                console.error('Failed to fetch player count', response.status);
            }
        } catch (error) {
            console.error('Error fetching player count:', error);
        }
    };

    const handleDiscordClick = () => {
        if (game.discordLink) {
            require('electron').shell.openExternal(game.discordLink);
        }
    };

    useEffect(() => {
        fetchPlayerCount(); // Initial fetch
        const interval = setInterval(fetchPlayerCount, 120000); // Polling every 120 seconds
        return () => clearInterval(interval); // Cleanup on component unmount
    }, [game.playerCountUrl]);

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

    const handlePlaySWF = async () => {
        const success = await launchSWF(game);
        if (!success) {
            setIsDownloaded(false);
            addNotification(
                NotificationType.ERROR,
                'Game files may be corrupted. Please try downloading again.'
            );
        }
    };

    const handlePlayAIR = async () => {
        const success = await launchAIR(game);
        if (!success) {
            setIsDownloaded(false);
            addNotification(
                NotificationType.ERROR,
                'Game files may be corrupted. Please try downloading again.'
            );
        }
    };

    const handleRefresh = async () => {
        try {
            const localFiles = getGameFiles(game.id);
            const mismatches = await Promise.all(localFiles.map(async (file) => {
                const localSize = fs.statSync(file.path).size;
                const response = await fetch(file.type === 'swf' ? game.urls.swf : game.urls.air, { method: 'HEAD' });
                const remoteSize = parseInt(response.headers.get('content-length'), 10);
                return localSize !== remoteSize;
            }));
            
            if (mismatches.some(mismatch => mismatch)) {
                if (window.confirm(`There is an update available for ${game.title}. Would you like to update?`)) {
                    handleDownload();
                }
            } else {
                addNotification(
                    NotificationType.INFO,
                    `${game.title} is up to date.`
                );
            }
        } catch (error) {
            addNotification(
                NotificationType.ERROR,
                `Error checking for updates: ${error.message}`
            );
        }
    };

    return (
        <div className={`${themes[currentTheme].card} rounded-xl shadow overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group`}>
            <div className="relative w-full pt-[56.25%] bg-gray-200">
                <img 
                    src={game.banner}
                    alt={game.title}
                    className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    crossOrigin="anonymous"
                />
                
                <div className="absolute top-2 left-2">
                    {game.discordLink && (
                        <button 
                            className="inline-block p-1 transition-colors duration-200" 
                            onClick={handleDiscordClick}
                        >
                            <DiscordIcon />
                        </button>
                    )}
                </div>
                
                <div className="absolute top-2 right-2 flex space-x-2">
                    <button 
                        className="inline-block p-1 transition-colors duration-200 text-white bg-transparent shadow-md hover:shadow-lg"
                        onClick={handleRefresh}
                        title="Check for Updates"
                    >
                        <RefreshCw size={18} />
                    </button>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200
                        ${
                            game.urls.swf && game.urls.air
                                ? 'bg-green-500 text-white' // Both
                                : game.urls.air
                                ? 'bg-blue-500 text-white' // Only AIR
                                : 'bg-red-500 text-white' // Only Flash, if ever added
                        }`}
                    >
                        {
                            game.urls.swf && game.urls.air
                                ? 'AIR + SWF'
                                : game.urls.air
                                ? 'AIR Only'
                                : 'SWF Only'
                        }
                    </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent pt-8 pb-2 px-3">
                    <div className="flex justify-between items-center">
                        <span className="text-white/90 text-sm px-2 py-1 rounded bg-black/30 backdrop-blur-sm">
                            v{game.version}
                        </span>
                        <span className="text-white/90 text-sm px-2 py-1 rounded bg-black/30 backdrop-blur-sm">
                            {playerCount !== null ? `${playerCount} Players` : 'Loading...'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="p-4">
                <h3 className={`text-lg font-bold truncate ${themes[currentTheme].text} group-hover:text-blue-500 transition-colors duration-200`}>
                    {game.title}
                </h3>
                <p className={`text-sm mt-1 mb-3 ${themes[currentTheme].textSecondary}`}>
                    {game.description}
                </p>
                {isDownloaded ? (
                    <div className="flex gap-2 mt-auto">
                        {game.urls.swf && (
                            <button 
                                onClick={handlePlaySWF}
                                className={`flex-1 ${themes[currentTheme].button} ${themes[currentTheme].buttonHover} 
                                          text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 
                                          transition-all duration-200 group/button`}
                            >
                                <FlashIcon />
                                <span className="font-medium">Play SWF</span>
                                <ChevronRight size={16} className="opacity-0 -ml-4 group-hover/button:opacity-100 group-hover/button:ml-0 transition-all duration-200" />
                            </button>
                        )}
                        {game.urls.air && (
                            <button 
                                onClick={handlePlayAIR}
                                disabled={isExtracting}
                                className={`flex-1 ${isExtracting ? 'bg-gray-500' : `${themes[currentTheme].button} ${themes[currentTheme].buttonHover}`}
                                          text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 
                                          transition-all duration-200 group/button`}
                            >
                                {isExtracting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span className="font-medium">Extracting...</span>
                                    </>
                                ) : (
                                    <>
                                        <AirIcon />
                                        <span className="font-medium">Play AIR</span>
                                        <ChevronRight size={16} className="opacity-0 -ml-4 group-hover/button:opacity-100 group-hover/button:ml-0 transition-all duration-200" />
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                ) : (
                    <button 
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className={`w-full ${isDownloading ? 'bg-gray-500' : `${themes[currentTheme].button} ${themes[currentTheme].buttonHover}`}
                                  text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 
                                  transition-all duration-200 group/button`}
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
                                <ChevronRight size={16} className="opacity-0 -ml-4 group-hover/button:opacity-100 group-hover/button:ml-0 transition-all duration-200" />
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};

const CompactServerCard = ({ game, launchSWF, launchAIR }) => {
    const { currentTheme } = useTheme();
    const [playerCount, setPlayerCount] = useState(null);

    const fetchPlayerCount = async () => {
        try {
            const response = await fetch(game.playerCountUrl);
            if (response.ok) {
                const count = await response.text();
                setPlayerCount(count);
            } else {
                console.error('Failed to fetch player count', response.status);
            }
        } catch (error) {
            console.error('Error fetching player count:', error);
        }
    };

    useEffect(() => {
        fetchPlayerCount();
        const interval = setInterval(fetchPlayerCount, 120000);
        return () => clearInterval(interval);
    }, [game.playerCountUrl]);

    return (
        <div className={`flex justify-between items-center p-2 ${themes[currentTheme].card} rounded shadow mb-2`}>
            <div className="flex-1 cursor-pointer" onClick={game.urls.swf ? () => launchSWF(game) : () => launchAIR(game)}>
                <span className={`font-medium ${themes[currentTheme].text}`}>{game.title}</span>
            </div>
            <div className="flex items-center gap-2">
                <User size={16} className={`${themes[currentTheme].textSecondary}`} />
                <span className={`${themes[currentTheme].textSecondary}`}>
                    {playerCount !== null ? playerCount : '-'}
                </span>
            </div>
        </div>
    );
};


const AddServerCard = ({ onOpenDownloads }) => {
    const { currentTheme } = useTheme();
    return (
        <div 
            onClick={onOpenDownloads}
            className={`${themes[currentTheme].card} rounded-lg shadow overflow-hidden cursor-pointer 
                       transition-all duration-200 hover:shadow-lg ${themes[currentTheme].cardHover}`}
        >
            <div className={`relative w-full pt-[56.25%] ${themes[currentTheme].card} flex items-center justify-center`}>
                <div className={`absolute inset-0 flex flex-col items-center justify-center ${themes[currentTheme].textSecondary}`}>
                    <Plus size={48} className={`${themes[currentTheme].button.replace('bg-', 'text-')}`} />
                    <span className={`${themes[currentTheme].text}`}>Browse Games</span>
                </div>
            </div>
        </div>
    );
};

const LoadingState = () => {
    const { currentTheme } = useTheme();
    return (
        <div className={`flex-1 ${themes[currentTheme].bg} p-4 flex items-center justify-center`}>
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <p className={`${themes[currentTheme].text}`}>Loading games...</p>
            </div>
        </div>
    );
};

const ServerList = ({ setActiveTab, isCompactMode }) => {
    const { currentTheme } = useTheme();
    const { games, isLoading } = useGameData();
    const { isGameDownloaded } = useDownloadsManager();
    const { launchSWF, launchAIR } = useGameLauncher();

    if (isLoading) {
        return (
            <div className={`flex-1 ${themes[currentTheme].bg} p-4 flex items-center justify-center`}>
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <p className={`${themes[currentTheme].text}`}>Loading games...</p>
                </div>
            </div>
        );
    }

    const downloadedGames = games.filter(game => isGameDownloaded(game.id));

    return (
        <div className={`flex-1 ${themes[currentTheme].bg} p-4 custom-scrollbar`}>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {downloadedGames.map((game) => (
                    <ServerCard key={game.id} game={game} />
                ))}
                <AddServerCard onOpenDownloads={() => setActiveTab('downloads')} />
            </div>
        </div>
    );
};

export default ServerList;