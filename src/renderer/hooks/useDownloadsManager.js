// src/renderer/hooks/useDownloadsManager.js
import { useState, useEffect } from 'react';
import { app } from '@electron/remote';
import fs from 'fs';
import path from 'path';

// Custom hook to manage downloads
export const useDownloadsManager = () => {
    const [downloadedGames, setDownloadedGames] = useState({});
    const [paths, setPaths] = useState(null);

    useEffect(() => {
        try {
            const downloadsPath = path.join(app.getPath('userData'), 'downloads');
            const manifestPath = path.join(downloadsPath, 'manifest.json');
            console.log('Download Path:', downloadsPath);
            console.log('Manifest Path:', manifestPath);

            if (!fs.existsSync(downloadsPath)) {
                fs.mkdirSync(downloadsPath, { recursive: true });
            }
            if (!fs.existsSync(manifestPath)) {
                fs.writeFileSync(manifestPath, JSON.stringify({}));
            }

            setPaths({ downloadsPath, manifestPath });
            loadManifest(manifestPath);
        } catch (error) {
            console.error('Failed to initialize downloads manager:', error);
        }
    }, []);

    const loadManifest = (manifestPath) => {
        try {
            if (manifestPath && fs.existsSync(manifestPath)) {
                const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
                console.log('Loaded manifest:', manifest);
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
        console.log('Updated manifest:', manifest);
        setDownloadedGames(manifest);
    };

    const isGameDownloaded = (gameId) => {
        return !!downloadedGames[gameId];
    };

    const getGameFiles = (gameId) => {
        return downloadedGames[gameId]?.files || [];
    };

    const downloadGame = async (game) => {
        if (!paths) {
            console.error('Paths not initialized!');
            return false;
        }

        const gameDir = path.join(paths.downloadsPath, game.id);
        if (!fs.existsSync(gameDir)) {
            fs.mkdirSync(gameDir, { recursive: true });
        }

        const files = [];
        try {
            if (game.urls.swf) {
                console.log(`Preparing to download SWF for ${game.id}`);
                await attemptDownload(game.urls.swf, game.id, files, 'swf');
            }

            if (game.urls.air) {
                console.log(`Preparing to download AIR (ZIP) for ${game.id}`);
                await attemptDownload(game.urls.air, game.id, files, 'zip');
            }

            if (files.length) {
                updateManifest(game.id, files);
                console.log('Download complete for:', game.id);
                return true;
            }

            console.log('No files downloaded for:', game.id);
            return false;
        } catch (error) {
            console.error('Error during downloadGame for', game.id, ':', error);
            return false;
        }
    };

    const attemptDownload = async (url, gameId, files, type) => {
        console.log(`Attempting to download ${type.toUpperCase()} from URL: ${url}`);
        const filePath = path.join(paths.downloadsPath, gameId, `${gameId}.${type}`);
        try {
            const fileDownloaded = await downloadFile(url, filePath);
            if (fileDownloaded) {
                files.push({ type: type, path: filePath });
                console.log(`Downloaded and saved ${type.toUpperCase()} at:`, filePath);
            } else {
                console.log(`Failed to download ${type.toUpperCase()}`);
            }
        } catch (error) {
            console.error(`Error downloading ${type.toUpperCase()} from ${url}`, error);
        }
    };

    const downloadFile = async (url, filePath) => {
        try {
            const response = await fetch(url);
            if (response.ok) {
                console.log(`Fetch successful from URL: ${url}`);
                const buffer = await response.arrayBuffer();
                fs.writeFileSync(filePath, Buffer.from(buffer));
                return true;
            } else {
                console.error(`Failed to fetch file from ${url} - Status: ${response.status}`);
                return false;
            }
        } catch (error) {
            console.error(`Error downloading file at URL: ${url}`, error);
            return false;
        }
    };

    return {
        downloadGame,
        isGameDownloaded,
        getGameFiles,
        downloadedGames,
        isReady: !!paths,
        updateManifest,
        paths
    };
};