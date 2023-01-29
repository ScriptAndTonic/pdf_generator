const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  generatePDFs: (pdfGenerationInfo) => ipcRenderer.invoke('generatePDFs', pdfGenerationInfo),
  selectFolder: (outputDirectoryPath) => ipcRenderer.invoke('dialog:openDirectory', outputDirectoryPath),
  openSettingsPage: () => ipcRenderer.invoke('openSettingsPage'),
});
