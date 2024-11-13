const AdmZip = require('adm-zip');
const path = require('path');
const fs = require('fs');

export const extractZip = async (zipPath, extractPath) => {
    return new Promise((resolve, reject) => {
        try {
            // Create extraction directory if it doesn't exist
            if (!fs.existsSync(extractPath)) {
                fs.mkdirSync(extractPath, { recursive: true });
            }

            const zip = new AdmZip(zipPath);
            
            // Extract the ZIP file
            zip.extractAllToAsync(extractPath, true, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(true);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
};
