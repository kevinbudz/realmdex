// src/renderer/hooks/useDownloadsManager.js
import { useState, useEffect } from 'react';
import { app } from '@electron/remote'; // ensure @electron/remote is used
import fs from 'fs';
import path from 'path';

export const useDownloadsManager = () => {
    const [downloadedGames, setDownloadedGames] = useState({});
    const [paths, setPaths] = useState(null);

    useEffect(() => {
        try {
            const downloadsPath = path.join(app.getPath('userData'), 'downloads');
            const manifestPath = path.join(downloadsPath, 'manifest.json');
            setPaths({ downloadsPath, manifestPath });

            if (!fs.existsSync(downloadsPath)) {
                fs.mkdirSync(downloadsPath, { recursive: true });
            }
            if (!fs.existsSync(manifestPath)) {
                fs.writeFileSync(manifestPath, JSON.stringify({}));
            }

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
            [gameId]: files.length ? { timestamp: new Date().toISOString(), files } : undefined
        };
        if (!files.length) {
            delete manifest[gameId];
        }
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
            if (game.urls.swf) {
                const swfPath = path.join(gameDir, `${game.id}.swf`);
                await downloadFile(game.urls.swf, swfPath);
                files.push({ type: 'swf', path: swfPath });
            }

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
        isReady: !!paths,
        updateManifest // Ensure this function is exposed for use
    };
};