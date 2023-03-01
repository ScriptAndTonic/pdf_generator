const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const Store = require('electron-store');
const store = new Store();
const smtpSettingsKeys = ['smtpHost', 'smtpPort', 'smtpUsername', 'smtpPassword', 'emailSubject'];

const pdfGenerator = require('./helpers/pdf_generator');
const emailer = require('./helpers/emailer');

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

  ipcMain.handle('dialog:openDirectory', openDirectory);
  ipcMain.handle('openSettingsPage', openSettingsPage);
  ipcMain.handle('generatePDFs', generatePDFs);
  ipcMain.handle('saveSettings', saveSettings);
  ipcMain.handle('loadSettings', loadSettings);

  mainWindow.loadFile(path.join(__dirname, 'mainPage/index.html'));
};

app.whenReady().then(() => {
  createWindow();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// --- CUSTOM LOGIC STARTS HERE ---
const generatePDFs = async (_event, pdfGenerationInfo) => {
  console.log('Generate PDFs');
  console.dir(pdfGenerationInfo);
  try {
    const pdfAttachmentsToSend = await pdfGenerator.generatePDFs(pdfGenerationInfo);
    if (pdfGenerationInfo.sendEmails) {
      await emailer.sendMultipleAttachmentEmails(pdfAttachmentsToSend, loadSettings());
    }

    return 'Success';
  } catch (error) {
    console.error(error);
    return error.message;
  }
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

const openSettingsPage = (_event, mainWindow) => {
  console.log('Open Settings Page');
  const settingsWindow = new BrowserWindow({
    parent: mainWindow,
    width: 400,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'settingsPage/settingsPreload.js'),
    },
  });
  // settingsWindow.webContents.openDevTools();

  settingsWindow.loadFile(path.join(__dirname, 'settingsPage/settingsPage.html'));
};

const saveSettings = (_event, newSettings) => {
  smtpSettingsKeys.forEach((key) => {
    store.set(key, newSettings[key]);
  });
  console.log('New Settings Saved');
  console.dir(newSettings);
};

const loadSettings = (_event) => {
  let settings = {};
  if (store.get(smtpSettingsKeys[0])) {
    smtpSettingsKeys.forEach((key) => {
      settings[key] = store.get(key);
    });
  } else {
    settings = initSettings();
  }

  console.log('Loaded Settings');
  console.dir(settings);
  return settings;
};

const initSettings = () => {
  const emptySettings = {};
  smtpSettingsKeys.forEach((key) => {
    emptySettings[key] = '';
    store.set(key, '');
  });
  return emptySettings;
};
