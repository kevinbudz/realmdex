// src/renderer/hooks/useGameLauncher.js
import { useNotifications, NotificationType } from '../components/Notifications';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import fetch from 'node-fetch';
import AdmZip from 'adm-zip';

export const useGameLauncher = () => {
    const { addNotification } = useNotifications();
    const baseDownloadsPath = path.join(process.env.APPDATA, 'realmdex', 'downloads');

    // URLs for different Flash Player versions
    const flashPlayerUrls = {
        '11': 'https://kevinbudz.github.io/flashplayer_11.exe',
        '18': 'https://kevinbudz.github.io/flashplayer_18.exe',
        '32': 'https://kevinbudz.github.io/flashplayer_32.exe',
    };

    const getFlashPlayerPath = (version) => {
        return path.join(baseDownloadsPath, `flashplayer_${version}.exe`);
    };

    const ensureFlashPlayer = async (version) => {
        const flashPlayerPath = getFlashPlayerPath(version);

        if (!fs.existsSync(flashPlayerPath)) {
            const url = flashPlayerUrls[version];
            addNotification(NotificationType.INFO, `Downloading Flash Player ${version}...`);
            try {
                const response = await fetch(url);
                if (response.ok) {
                    const buffer = await response.buffer();
                    fs.writeFileSync(flashPlayerPath, buffer);
                    addNotification(NotificationType.SUCCESS, `Flash Player ${version} installed.`);
                } else {
                    throw new Error(`Failed to download Flash Player ${version}`);
                }
            } catch (error) {
                addNotification(NotificationType.ERROR, error.message);
                throw error;
            }
        }

        return flashPlayerPath;
    };

    const launchSWF = async (game) => {
        console.log("Attempting to launch SWF for game:", game.title);
        try {
            const flashPlayerVersion = localStorage.getItem('flashPlayerVersion') || '11'; // Default to version 11 if not set
            const flashPlayerPath = await ensureFlashPlayer(flashPlayerVersion);
            const gamePath = path.join(baseDownloadsPath, game.id, `${game.id}.swf`);

            if (!fs.existsSync(gamePath)) {
                addNotification(NotificationType.ERROR, 'Game file not found. Try downloading again.');
                return false;
            }

            exec(`"${flashPlayerPath}" "${gamePath}"`, (err) => {
                if (err) {
                    console.error('Failed to launch game:', err);
                    addNotification(NotificationType.ERROR, `Failed to launch game: ${err.message}`);
                    return false;
                }
                addNotification(NotificationType.SUCCESS, `Launched ${game.title}`);
            });

            return true;
        } catch (error) {
            console.error('Failed to launch game:', error);
            addNotification(NotificationType.ERROR, `Failed to launch game: ${error.message}`);
            return false;
        }
    };

    const launchAIR = async (game) => {
        console.log("Attempting to launch AIR executable for game:", game.title);
        const airZipPath = path.join(baseDownloadsPath, game.id, `${game.id}.zip`);
        const airFolderPath = path.join(baseDownloadsPath, game.id, `air`);
        const executablePath = path.join(airFolderPath, game.executable);
        
        if (!fs.existsSync(executablePath)) {
            console.log(`Extracting AIR application for ${game.id}...`);
            try {
                const zip = new AdmZip(airZipPath);
                zip.extractAllTo(airFolderPath, true);
                console.log(`Extraction complete for ${game.id}.`);
            } catch (error) {
                console.error('Extraction error:', error);
                addNotification(NotificationType.ERROR, `Failed to extract game: ${error.message}`);
                return false;
            }
        }

        exec(`"${executablePath}"`, (err) => {
            if (err) {
                console.error('Failed to launch AIR application:', err);
                addNotification(NotificationType.ERROR, `Failed to launch application: ${err.message}`);
            } else {
                console.log(`Launched ${game.title} successfully.`);
                addNotification(NotificationType.SUCCESS, `Launched ${game.title} successfully.`);
            }
        });

        return true;
    };

    return {
        launchSWF,
        launchAIR,
    };
};