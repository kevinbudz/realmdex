// src/renderer/components/Downloads.jsx
import React from 'react';
import { Download, ChevronRight, Star, Users } from 'lucide-react';
import { useTheme, themes } from '../context/ThemeContext';
import { useGameData } from '../hooks/useGameData';

const CategoryBadge = ({ children }) => (
    <span className="text-xs px-2 py-1 rounded-full bg-opacity-10 bg-white text-white text-shadow-sm">
        {children}
    </span>
);

const DownloadCard = ({ game }) => {
    const { currentTheme } = useTheme();
    const [playerCount, setPlayerCount] = React.useState("?");
    const [isHovered, setIsHovered] = React.useState(false);

    React.useEffect(() => {
        const fetchPlayerCount = async () => {
            if (!game.urls.playerCount) {
                setPlayerCount("?");
                return;
            }

            try {
                const response = await fetch(game.urls.playerCount);
                if (!response.ok) throw new Error('Failed to fetch');
                const count = await response.text();
                setPlayerCount(count);
            } catch (error) {
                setPlayerCount("?");
            }
        };

        fetchPlayerCount();
        const interval = setInterval(fetchPlayerCount, 60000);
        return () => clearInterval(interval);
    }, [game.urls.playerCount]);

    return (
        <div 
            className={`relative group rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${themes[currentTheme].card}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative w-full pt-[100%]">
                <img 
                    src={game.altBanner || game.banner} 
                    alt={game.title}
                    className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-60 transition-opacity duration-300 ${isHovered ? 'opacity-80' : ''}`} />
                
                {/* Format badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                    {game.urls.swf && <CategoryBadge>Flash Game</CategoryBadge>}
                    {game.urls.air && <CategoryBadge>AIR Compatible</CategoryBadge>}
                </div>

                {/* Version and player count */}
                <div className="absolute top-4 right-4 flex items-center gap-3">
                    <span className="flex items-center gap-1 text-white text-sm text-shadow-sm">
                        <Users size={14} className="drop-shadow" />
                        {playerCount} online
                    </span>
                </div>

                {/* Main content */}
                <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col">
                    <h3 className="text-2xl font-bold text-white mb-2 text-shadow-lg">
                        {game.title}
                    </h3>
                    <p className="text-gray-200 text-sm mb-4 line-clamp-2 leading-relaxed text-shadow">
                        {game.description}
                    </p>
                    
                    {/* Version tag */}
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs text-white/90 text-shadow-sm">
                            Version {game.version}
                        </span>
                    </div>

                    {/* Single download button */}
                    <div className="transform translate-y-0 group-hover:translate-y-0 transition-all duration-300">
                        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg 
                                       flex items-center justify-center gap-2 transition-all duration-200 group
                                       shadow-lg hover:shadow-xl">
                            <Download size={18} />
                            <span className="font-medium">Download</span>
                            <ChevronRight size={16} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                        </button>
                        {/* Included formats text */}
                        <div className="text-center mt-2 text-xs text-white/80 text-shadow">
                            Includes: {[
                                game.urls.swf && 'SWF',
                                game.urls.air && 'AIR'
                            ].filter(Boolean).join(' + ')}
                        </div>
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
        <div className={`flex-1 ${themes[currentTheme].bg} p-8 overflow-auto`}>
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h2 className={`text-3xl font-bold ${themes[currentTheme].text}`}>
                        Available Games
                    </h2>
                    <div className="flex gap-4">
                        {/* Add filter/sort options here if needed */}
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {games.map((game) => (
                        <DownloadCard key={game.id} game={game} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Downloads;