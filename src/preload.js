// src/preload.js
const { contextBridge, ipcRenderer } = require('electron');
const { app } = require('@electron/remote'); // Importing app here.

contextBridge.exposeInMainWorld('electron', {
    getAppPath: () => app.getAppPath(),
    getPath: (name) => app.getPath(name),  // Exposing path fetching as a function
});