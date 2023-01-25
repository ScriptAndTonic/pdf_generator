const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');

const pdfGenerator = require('./helpers/pdf_generator');

if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, 'mainPage/preload.js'),
    },
  });
  // mainWindow.webContents.openDevTools();

  ipcMain.handle('dialog:openDirectory', (event) => openDirectory(event, mainWindow));
  ipcMain.handle('openSettingsPage', (event) => openSettingsPage(event, mainWindow));
  ipcMain.handle('generate-pdfs', generatePDFs);

  mainWindow.loadFile(path.join(__dirname, 'mainPage/index.html'));
};

app.whenReady().then(() => {
  createWindow();
});

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

// --- CUSTOM LOGIC STARTS HERE ---
const generatePDFs = async (_event, pdfTemplateFilePath, excelDataFilePath, outputDirectoryPath) => {
  console.log('Generate PDFs');
  console.log(`Template Path: ${pdfTemplateFilePath}`);
  console.log(`Data File Path: ${excelDataFilePath}`);
  console.log(`Output Directory Path: ${outputDirectoryPath}`);
  await pdfGenerator.generatePDFs(pdfTemplateFilePath, excelDataFilePath, outputDirectoryPath);
  return 'Success';
};

const openDirectory = async (_event, parentWindow) => {
  const { canceled, filePaths } = await dialog.showOpenDialog(parentWindow, {
    title: 'Save Folder',
    message: 'Choose a Folder to Save the generated PDFs',
    buttonLabel: 'Select',
    properties: ['openDirectory'],
  });
  if (canceled) {
    return;
  } else {
    return filePaths[0];
  }
};

const openSettingsPage = async (_event, mainWindow) => {
  console.log('Open Settings Page');
  const settingsWindow = new BrowserWindow({
    parent: mainWindow,
    width: 400,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, 'settingsPage/settingsPreload.js'),
    },
  });
  settingsWindow.webContents.openDevTools();
  settingsWindow.loadFile(path.join(__dirname, 'settingsPage/settingsPage.html'));
};
