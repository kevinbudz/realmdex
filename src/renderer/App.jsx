// src/renderer/App.jsx
import React, { useState } from 'react';
import { ThemeProvider, useTheme, themes } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import ServerList from './components/ServerList';
import Downloads from './components/Downloads';
import Settings from './components/Settings';

const AppContent = () => {
    const [activeTab, setActiveTab] = useState('servers');
    const { currentTheme } = useTheme();

    return (
        <div className={`flex h-screen ${themes[currentTheme].bg}`}>
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            {activeTab === 'servers' && <ServerList setActiveTab={setActiveTab} />}
            {activeTab === 'downloads' && <Downloads />}
            {activeTab === 'settings' && <Settings />}
        </div>
    );
};

const App = () => {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
};

export default App;