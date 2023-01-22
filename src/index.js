const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { generate } = require('rxjs');

const pdfGenerator = require('./pdf_generator/pdf_generator');

if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  ipcMain.handle('dialog:openDirectory', () => openDirectory(mainWindow));

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
  ipcMain.on('generate-pdfs', generatePDFs);
  // ipcMain.on('open-settings-page', openSettingsPage);
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
const generatePDFs = async (event, pdfTemplateFilePath, excelDataFilePath, outputDirectoryPath) => {
  console.log('Main received');
  console.dir(event);
  console.log(pdfTemplateFilePath);
  console.log(excelDataFilePath);
  console.log(outputDirectoryPath);
  console.log(`Template Path: ${pdfTemplateFilePath}`);
  console.log(`Data File Path: ${excelDataFilePath}`);
  console.log(`Output Directory Path: ${outputDirectoryPath}`);
  await pdfGenerator.generatePDFs(pdfTemplateFilePath, excelDataFilePath, outputDirectoryPath);
};

const openDirectory = async (parentWindow) => {
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

// const openSettingsPage = async (event) => {
//   const mainWindow = new BrowserWindow({parent
//     width: 400,
//     height: 500,
//     webPreferences: {
//       preload: path.join(__dirname, 'preload.js'),
//     },
//   });
// };
