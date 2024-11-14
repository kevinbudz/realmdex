import React from 'react';
import { getCurrentWindow } from '@electron/remote';
import { useTheme, themes } from '../context/ThemeContext';
import { Minus, X } from 'lucide-react';

const ScreenLivery = () => {
  const window = getCurrentWindow();
  const { currentTheme } = useTheme();
  const iconSize = 20;

  return (
    <div className="fixed top-0 left-0 right-0 flex items-center h-10 z-50">
      <div
        className="flex-1 h-full"
        style={{ WebkitAppRegion: 'drag', marginLeft: '30px' }} // Margin adjusts for sidebar space
      >
        {/* Only this area is draggable */}
      </div>
      <div className="flex space-x-2 pr-2" style={{ WebkitAppRegion: 'no-drag' }}>
        <button 
          onClick={() => window.minimize()}
          className={`p-2 rounded ${themes[currentTheme].cardHover} ${themes[currentTheme].text}`}
        >
          <Minus size={iconSize} />
        </button>
        <button 
          onClick={() => window.close()} 
          className={`p-2 rounded ${themes[currentTheme].cardHover} ${themes[currentTheme].text}`}
        >
          <X size={iconSize} />
        </button>
      </div>
    </div>
  );
};

export default ScreenLivery;