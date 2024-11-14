import { useNotifications, NotificationType } from '../components/Notifications';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import AdmZip from 'adm-zip';  // Import the adm-zip module

export const useGameLauncher = () => {
    const { addNotification } = useNotifications();
    const baseDownloadsPath = path.join(process.env.APPDATA, 'realmdex', 'downloads');

    const ensureFlashPlayer = async () => {
        const flashPlayerUrl = "https://kevinbudz.github.io/flashplayer_11.exe"; // Update path if needed
        const flashPlayerPath = path.join(baseDownloadsPath, 'flashplayer_11.exe');

        if (!fs.existsSync(flashPlayerPath)) {
            console.log("Flash Player not found, downloading...");
            const downloaded = await downloadFile(flashPlayerUrl, flashPlayerPath);
            if (!downloaded) {
                throw new Error('Failed to download Flash Player');
            }
        }
        return flashPlayerPath;
    };

    const launchSWF = async (game) => {
        console.log("Attempting to launch SWF for game:", game.title);
        try {
            const flashPlayerPath = await ensureFlashPlayer();
            const gamePath = path.join(baseDownloadsPath, game.id, `${game.id}.swf`);

            if (!fs.existsSync(gamePath)) {
                addNotification(
                    NotificationType.ERROR,
                    'Game file not found. Try downloading again.'
                );
                return false;
            }

            console.log("Using Flash Player from path:", flashPlayerPath);

            exec(`"${flashPlayerPath}" "${gamePath}"`, (err) => {
                if (err) {
                    console.error('Failed to launch game:', err);
                    addNotification(
                        NotificationType.ERROR,
                        `Failed to launch game: ${err.message}`
                    );
                    return false;
                }
                addNotification(
                    NotificationType.SUCCESS,
                    `Launched ${game.title}`
                );
            });

            return true;
        } catch (error) {
            console.error('Failed to launch game:', error);
            addNotification(
                NotificationType.ERROR,
                `Failed to launch game: ${error.message}`
            );
            return false;
        }
    };

    const launchAIR = async (game) => {
        console.log("Attempting to launch AIR executable for game:", game.title);
        const airZipPath = path.join(baseDownloadsPath, game.id, `${game.id}.zip`);
        const airFolderPath = path.join(baseDownloadsPath, game.id, `air`);
        const executablePath = path.join(airFolderPath, game.executable);
        
        // Ensure the AIR directory exists and the executable is present
        if (!fs.existsSync(executablePath)) {
            console.log(`Extracting AIR application for ${game.id}...`);
            try {
                const zip = new AdmZip(airZipPath);
                zip.extractAllTo(airFolderPath, true); // Extracts to the `air` subfolder, retaining .zip after extraction
                console.log(`Extraction complete for ${game.id}.`);
            } catch (error) {
                console.error('Extraction error:', error);
                addNotification(
                    NotificationType.ERROR,
                    `Failed to extract game: ${error.message}`
                );
                return false;
            }
        }

        // Now attempt to run the executable
        exec(`"${executablePath}"`, (err) => {
            if (err) {
                console.error('Failed to launch AIR application:', err);
                addNotification(
                    NotificationType.ERROR,
                    `Failed to launch application: ${err.message}`
                );
            } else {
                console.log(`Launched ${game.title} successfully.`);
                addNotification(
                    NotificationType.SUCCESS,
                    `Launched ${game.title} successfully.`
                );
            }
        });

        return true; // Consider marking as true immediately as it starts the process successfully
    };

    return {
        launchSWF,
        launchAIR,
    };
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