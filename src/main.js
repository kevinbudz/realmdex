// src/main.js
const { app, BrowserWindow } = require('electron');

require('@electron/remote/main').initialize();

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: true,
            enableRemoteModule: true
        },
        resizable: false
    });

    require('@electron/remote/main').enable(win.webContents);

    // Set CSP headers
    win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
        responseHeaders: {
            ...details.responseHeaders,
            'Content-Security-Policy': [
                "default-src 'self' 'unsafe-inline' http://localhost:3000; " +
                "img-src 'self' http://localhost:3000 https://*.githubusercontent.com https://*.github.io data:; " +
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
                "font-src 'self' https://fonts.gstatic.com;" + 
                "connect-src 'self' http://localhost:3000 https://*.githubusercontent.com https://*.github.io"
            ]
        }
    });
});
    win.loadURL('http://localhost:3000');
    
    // Open DevTools for debugging
    win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});