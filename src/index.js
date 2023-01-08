const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { generate } = require('rxjs');

const pdfGenerator = require('./pdf_generator/pdf_generator');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  ipcMain.handle('dialog:openDirectory', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
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
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  ipcMain.on('generate-pdfs', generatePDFs);
  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

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
