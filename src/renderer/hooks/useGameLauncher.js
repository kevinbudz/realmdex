// src/renderer/hooks/useGameLauncher.js
import { useState } from 'react';
import { remote } from '@electron/remote';
import { useNotifications, NotificationType } from '../components/Notifications';
import path from 'path';
import fs from 'fs';
import AdmZip from 'adm-zip';

export const useGameLauncher = () => {
    const { addNotification } = useNotifications();
    const [isExtracting, setIsExtracting] = useState(false);

    const extractAir = async (zipPath, extractPath) => {
        setIsExtracting(true);
        addNotification(
            NotificationType.INFO,
            'Extracting AIR package... This may take a moment.'
        );

        try {
            if (!fs.existsSync(extractPath)) {
                fs.mkdirSync(extractPath, { recursive: true });
            }

            const zip = new AdmZip(zipPath);
            await new Promise((resolve, reject) => {
                zip.extractAllToAsync(extractPath, true, (error) => {
                    if (error) reject(error);
                    else resolve();
                });
            });

            addNotification(
                NotificationType.SUCCESS,
                'AIR package extracted successfully'
            );
            return true;
        } catch (error) {
            addNotification(
                NotificationType.ERROR,
                `Extraction failed: ${error.message}`
            );
            return false;
        } finally {
            setIsExtracting(false);
        }
    };

    const findExecutable = (dirPath, gameId) => {
        const files = fs.readdirSync(dirPath);
        
        const executablePatterns = {
            win32: ['.exe'],
            darwin: ['.app'],
            linux: ['.run', '.sh', '']
        };

        const patterns = executablePatterns[process.platform] || ['.exe'];

        // First, look for game-specific executable
        const gameExe = files.find(file => {
            const lowerFile = file.toLowerCase();
            return patterns.some(ext => 
                lowerFile === `${gameId}${ext}` || 
                lowerFile === `launcher${ext}` ||
                lowerFile === `start${ext}`
            );
        });

        if (gameExe) return path.join(dirPath, gameExe);

        // Look for any executable
        const anyExe = files.find(file => {
            const lowerFile = file.toLowerCase();
            return patterns.some(ext => lowerFile.endsWith(ext));
        });

        if (anyExe) return path.join(dirPath, anyExe);

        // Search subdirectories
        for (const file of files) {
            const fullPath = path.join(dirPath, file);
            if (fs.statSync(fullPath).isDirectory()) {
                const exeInSubdir = findExecutable(fullPath, gameId);
                if (exeInSubdir) return exeInSubdir;
            }
        }

        return null;
    };

    const launchSWF = async (game) => {
        try {
            const settings = JSON.parse(
                fs.readFileSync(
                    path.join(remote.app.getPath('userData'), 'settings.json'),
                    'utf8'
                )
            );

            if (!settings.flashPlayerPath) {
                addNotification(
                    NotificationType.ERROR,
                    'Flash Player path not configured. Please set it in Settings.'
                );
                return false;
            }

            const gamePath = path.join(settings.downloadsPath, game.id, `${game.id}.swf`);
            if (!fs.existsSync(gamePath)) {
                addNotification(
                    NotificationType.ERROR,
                    'Game file not found. Try downloading again.'
                );
                return false;
            }

            const child = require('child_process').spawn(
                settings.flashPlayerPath,
                [gamePath],
                { 
                    detached: true,
                    stdio: 'ignore',
                    windowsHide: false
                }
            );

            child.on('error', (err) => {
                addNotification(
                    NotificationType.ERROR,
                    `Failed to launch game: ${err.message}`
                );
                return false;
            });

            child.unref();
            addNotification(
                NotificationType.SUCCESS,
                `Launched ${game.title}`
            );
            return true;

        } catch (error) {
            addNotification(
                NotificationType.ERROR,
                `Failed to launch game: ${error.message}`
            );
            return false;
        }
    };

    const launchAIR = async (game) => {
        try {
            const settings = JSON.parse(
                fs.readFileSync(
                    path.join(remote.app.getPath('userData'), 'settings.json'),
                    'utf8'
                )
            );

            const zipPath = path.join(settings.downloadsPath, game.id, `${game.id}.zip`);
            const extractPath = path.join(settings.downloadsPath, game.id, 'air');

            if (!fs.existsSync(zipPath)) {
                addNotification(
                    NotificationType.ERROR,
                    'Game files not found. Try downloading again.'
                );
                return false;
            }

            if (!fs.existsSync(extractPath) || !fs.readdirSync(extractPath).length) {
                const extracted = await extractAir(zipPath, extractPath);
                if (!extracted) return false;
            }

            const exePath = findExecutable(extractPath, game.id);
            if (!exePath) {
                addNotification(
                    NotificationType.ERROR,
                    'Could not find game launcher in the extracted files.'
                );
                return false;
            }

            const child = require('child_process').spawn(
                exePath,
                [],
                { 
                    detached: true,
                    stdio: 'ignore',
                    windowsHide: false
                }
            );

            child.on('error', (err) => {
                addNotification(
                    NotificationType.ERROR,
                    `Failed to launch game: ${err.message}`
                );
                return false;
            });

            child.unref();
            addNotification(
                NotificationType.SUCCESS,
                `Launched ${game.title}`
            );
            return true;

        } catch (error) {
            addNotification(
                NotificationType.ERROR,
                `Failed to launch game: ${error.message}`
            );
            return false;
        }
    };

    return {
        launchSWF,
        launchAIR,
        isExtracting
    };
};