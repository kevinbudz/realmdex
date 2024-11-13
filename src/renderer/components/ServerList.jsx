import React from 'react';
import { Plus } from 'lucide-react';
import { useTheme, themes } from '../context/ThemeContext';
import gamesData from '../data/games.json';

// Flash Icon Component
const FlashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 512 512" fill="currentColor">
    <path d="M440.8,11.2H71.2C37.6,11.2,11.2,37.6,11.2,71.2v369.6c0,33.6,26.4,60,60,60h369.6c33.6,0,60-26.4,60-60V71.2
      C500.8,37.6,474.4,11.2,440.8,11.2z M380.4,270.8l-119.2,180c-4,6-10.4,9.2-16.8,9.2c-4,0-8.4-1.2-12-3.6c-9.2-6-12-18.4-6-27.6
      l91.2-137.6H220.4c-8.4,0-16-4.8-19.6-12.4c-3.6-7.6-2.4-16.4,2.8-22.8L322,74c6.4-8,18-9.2,26-2.8c8,6.4,9.2,18,2.8,26L266,208h114
      c7.6,0,14.8,4,18.8,10.8C402.8,225.2,402,235.2,396.8,242L380.4,270.8z"/>
  </svg>
);

// Adobe AIR Icon Component
const AirIcon = () => (
  <svg width="16" height="16" viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M256,32c-12.8,0-24.8,4.8-34.4,13.6l-179.2,164.8C26.4,222.4,20.8,238.4,24,254.4s22.4,27.2,39.2,27.2h102.4l-51.2,89.6
      c-7.2,12.8-6.4,28,2.4,39.2s21.6,16,36,12.8l140.8-25.6c14.4-2.4,26.4-12,32-25.6c6.4-13.6,6.4-28.8-1.6-41.6L292,280h99.2
      c16,0,31.2-8.8,39.2-23.2c7.2-14.4,5.6-32-4-45.6L290.4,53.6C281.6,41.6,269.6,32,256,32z M256,160
      c26.4,0,48-21.6,48-48s-21.6-48-48-48s-48,21.6-48,48S229.6,160,256,160z"/>
  </svg>
);

const ServerCard = ({ game }) => {
  const { currentTheme } = useTheme();
  const [playerCount, setPlayerCount] = React.useState("?");

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
    <div className={`${themes[currentTheme].card} rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-200`}>
      <div className="relative w-full pt-[56.25%] bg-gray-200">
        <img
          src={game.banner}
          alt={game.title}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className={`inline-block px-2 py-1 rounded text-sm font-medium 
              ${game.urls.air ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
            {game.urls.air ? 'AIR + SWF' : 'SWF Only'}
          </span>
        </div>
        <div className="absolute bottom-2 right-2 flex gap-2">
          <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
            {playerCount} playing
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className={`text-lg font-semibold truncate ${themes[currentTheme].text}`}>
          {game.title}
        </h3>
        <p className={`text-sm mt-1 line-clamp-2 ${themes[currentTheme].textSecondary}`}>
          {game.description}
        </p>
        <div className="mt-3 flex gap-2">
          <button className="flex items-center gap-1 px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white text-sm">
            <FlashIcon />
            .swf
          </button>
          {game.urls.air && (
            <button className="flex items-center gap-1 px-3 py-1 rounded bg-purple-500 hover:bg-purple-600 text-white text-sm">
              <AirIcon />
              AIR
            </button>
          )}
        </div>
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
                 transition-all duration-200 hover:shadow-lg ${themes[currentTheme].hover}`}>
      <div className="relative w-full pt-[56.25%] bg-gray-100 flex items-center justify-center">
        <div className={`absolute inset-0 flex flex-col items-center justify-center ${themes[currentTheme].textSecondary}`}>
          <Plus size={60} />
          <span className="mt-2 font-medium">Browse Games</span>
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

const ServerList = ({ setActiveTab }) => {
    const { currentTheme } = useTheme();
    const { games, isLoading } = useGameData();

    if (isLoading) {
        return <LoadingState />;
    }

    return (
        <div className={`flex-1 ${themes[currentTheme].bg} p-4 overflow-auto`}>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {games.map((game) => (
                    <ServerCard key={game.id} game={game} />
                ))}
                <AddServerCard onOpenDownloads={() => setActiveTab('downloads')} />
            </div>
        </div>
    );
};

export default ServerList;