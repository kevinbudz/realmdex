// src/renderer/components/Downloads.jsx
import React from 'react';
import { Download } from 'lucide-react';
import { useTheme, themes } from '../context/ThemeContext';
import gamesData from '../data/games.json';

const DownloadCard = ({ game }) => {
    const { currentTheme } = useTheme();
    
    return (
        <div className={`relative group rounded-lg shadow overflow-hidden ${themes[currentTheme].card}`}>
            <div className="relative w-full pt-[100%]">
                <img 
                    src={game.altBanner || game.banner} 
                    alt={game.title}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black opacity-40 group-hover:opacity-70 transition-opacity duration-200" />
                
                <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                    <div>
                        <h3 className="text-2xl font-bold mb-1">{game.title}</h3>
                        <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-sm 
                                ${game.urls.air ? 'bg-purple-500' : 'bg-blue-500'}`}>
                                {game.urls.air ? 'AIR + SWF' : 'SWF Only'}
                            </span>
                            <span className="text-sm opacity-90">
                                v{game.version}
                            </span>
                        </div>
                        <p className="mt-3 text-sm opacity-90 line-clamp-3">
                            {game.description}
                        </p>
                    </div>
                    
                    <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
                        {game.urls.air ? (
                            <div className="flex gap-2">
                                <button className="flex-1 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg 
                                                 flex items-center justify-center gap-2 transition-colors duration-200">
                                    <Download size={18} />
                                    Download AIR
                                </button>
                                <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg 
                                                 flex items-center justify-center gap-2 transition-colors duration-200">
                                    <Download size={18} />
                                    Download SWF
                                </button>
                            </div>
                        ) : (
                            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg 
                                             flex items-center justify-center gap-2 transition-colors duration-200">
                                <Download size={18} />
                                Download SWF
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

    if (isLoading) {
        return (
            <div className={`flex-1 ${themes[currentTheme].bg} p-4 flex items-center justify-center`}>
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <p className={`${themes[currentTheme].text}`}>Loading available games...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex-1 ${themes[currentTheme].bg} p-4 overflow-auto`}>
            <div className="max-w-7xl mx-auto">
                <h2 className={`text-2xl font-bold mb-6 ${themes[currentTheme].text}`}>
                    Available Games
                </h2>
                
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {games.map((game) => (
                        <DownloadCard key={game.id} game={game} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Downloads;