import { useState, useEffect } from 'react';
const electron = require('electron');
const { app } = electron.remote || require('@electron/remote');
const fs = require('fs');
const path = require('path');

export const useDownloadsManager = () => {
    const [downloadedGames, setDownloadedGames] = useState({});
    
    // Use useEffect to initialize paths to avoid undefined app
    const [paths, setPaths] = useState(null);

    useEffect(() => {
        try {
            const downloadsPath = path.join(app.getPath('userData'), 'downloads');
            const manifestPath = path.join(app.getPath('userData'), 'downloads', 'manifest.json');
            setPaths({ downloadsPath, manifestPath });

            // Initialize directories
            if (!fs.existsSync(downloadsPath)) {
                fs.mkdirSync(downloadsPath, { recursive: true });
            }
            if (!fs.existsSync(manifestPath)) {
                fs.writeFileSync(manifestPath, JSON.stringify({}));
            }

            // Load initial manifest
            loadManifest(manifestPath);
        } catch (error) {
            console.error('Failed to initialize downloads manager:', error);
        }
    }, []);

    const loadManifest = (manifestPath) => {
        try {
            if (manifestPath && fs.existsSync(manifestPath)) {
                const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
                setDownloadedGames(manifest);
            }
        } catch (error) {
            console.error('Error loading downloads manifest:', error);
            setDownloadedGames({});
        }
    };

    const updateManifest = (gameId, files) => {
        if (!paths) return;
        
        const manifest = {
            ...downloadedGames,
            [gameId]: {
                timestamp: new Date().toISOString(),
                files
            }
        };
        fs.writeFileSync(paths.manifestPath, JSON.stringify(manifest, null, 2));
        setDownloadedGames(manifest);
    };

    const isGameDownloaded = (gameId) => {
        return !!downloadedGames[gameId];
    };

    const getGameFiles = (gameId) => {
        return downloadedGames[gameId]?.files || [];
    };

    const downloadGame = async (game) => {
        if (!paths) return false;

        const gameDir = path.join(paths.downloadsPath, game.id);
        if (!fs.existsSync(gameDir)) {
            fs.mkdirSync(gameDir, { recursive: true });
        }

        const files = [];
        try {
            // Download SWF if available
            if (game.urls.swf) {
                const swfPath = path.join(gameDir, `${game.id}.swf`);
                await downloadFile(game.urls.swf, swfPath);
                files.push({ type: 'swf', path: swfPath });
            }

            // Download ZIP if available
            if (game.urls.zip) {
                const zipPath = path.join(gameDir, `${game.id}.zip`);
                await downloadFile(game.urls.zip, zipPath);
                files.push({ type: 'zip', path: zipPath });
            }

            updateManifest(game.id, files);
            return true;
        } catch (error) {
            console.error('Download failed:', error);
            return false;
        }
    };

    const downloadFile = async (url, filePath) => {
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();
        fs.writeFileSync(filePath, Buffer.from(buffer));
    };

    return {
        downloadGame,
        isGameDownloaded,
        getGameFiles,
        downloadedGames,
        isReady: !!paths
    };
};