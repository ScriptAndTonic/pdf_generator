// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  generatePDFs: (pdfTemplateFilePath, excelDataFilePath, outputDirectoryPath) =>
    ipcRenderer.send('generate-pdfs', pdfTemplateFilePath, excelDataFilePath, outputDirectoryPath),
  selectFolder: (outputDirectoryPath) => ipcRenderer.invoke('dialog:openDirectory', outputDirectoryPath),
});
