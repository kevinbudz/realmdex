// src/renderer/components/Sidebar.jsx
import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Gamepad, Download, Settings } from 'lucide-react';
import { useTheme, themes } from '../context/ThemeContext';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const { currentTheme } = useTheme();

    return (
        <div
            className={`w-[30px] ${themes[currentTheme].sidebar} flex flex-col items-center py-4 space-y-4`}
            style={{ WebkitAppRegion: 'no-drag' }} // Ensure Sidebar is not draggable
        >
            {/* Add the black rectangle at the top */}
            <div style={{ width: '100%', height: '30px', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}></div>
            
            <Tooltip.Provider>
                <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                        <div 
                            className={`text-gray-300 hover:text-white cursor-pointer ${
                                activeTab === 'servers' ? 'text-white' : ''
                            }`}
                            onClick={() => setActiveTab('servers')}
                        >
                            <Gamepad size={20} />
                        </div>
                    </Tooltip.Trigger>
                    <Tooltip.Content side="right">
                        <div className={`${themes[currentTheme].card} text-white px-2 py-1 rounded shadow-lg`}>
                            Servers
                        </div>
                    </Tooltip.Content>
                </Tooltip.Root>

                <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                        <div 
                            className={`text-gray-300 hover:text-white cursor-pointer ${
                                activeTab === 'downloads' ? 'text-white' : ''
                            }`}
                            onClick={() => setActiveTab('downloads')}
                        >
                            <Download size={20} />
                        </div>
                    </Tooltip.Trigger>
                    <Tooltip.Content side="right">
                        <div className={`${themes[currentTheme].card} text-white px-2 py-1 rounded shadow-lg`}>
                            Download
                        </div>
                    </Tooltip.Content>
                </Tooltip.Root>

                <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                        <div 
                            className={`text-gray-300 hover:text-white cursor-pointer ${
                                activeTab === 'settings' ? 'text-white' : ''
                            }`}
                            onClick={() => setActiveTab('settings')}
                        >
                            <Settings size={20} />
                        </div>
                    </Tooltip.Trigger>
                    <Tooltip.Content side="right">
                        <div className={`${themes[currentTheme].card} text-white px-2 py-1 rounded shadow-lg`}>
                            Options
                        </div>
                    </Tooltip.Content>
                </Tooltip.Root>
            </Tooltip.Provider>
        </div>
    );
};

export default Sidebar;