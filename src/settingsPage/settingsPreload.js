const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveSettings: (settings) => ipcRenderer.invoke('saveSettings', settings),
  loadSettings: () => ipcRenderer.invoke('loadSettings'),
});
