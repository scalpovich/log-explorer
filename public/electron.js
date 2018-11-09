const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');
const electronLocalshortcut = require('electron-localshortcut');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    icon: path.join(__dirname, 'icon.png')
  });
  mainWindow.maximize();
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.on('closed', () => mainWindow = null);

  electronLocalshortcut.unregister(mainWindow, 'CommandOrControl+H');
  electronLocalshortcut.register(mainWindow, 'CommandOrControl+O', () => {
    mainWindow.webContents.send('keyPress', 'CommandOrControl+O')
  });

  electronLocalshortcut.register(mainWindow, 'CommandOrControl+N', () => {
    mainWindow.webContents.send('keyPress', 'CommandOrControl+N')
  });

  electronLocalshortcut.register(mainWindow, 'CommandOrControl+H', () => {
    mainWindow.webContents.send('keyPress', 'CommandOrControl+H');
  });

  electronLocalshortcut.register(mainWindow, 'Delete', () => {
    mainWindow.webContents.send('keyPress', 'Delete');
  });

  electronLocalshortcut.register(mainWindow, 'Backspace', () => {
    mainWindow.webContents.send('keyPress', 'Backspace');
  });

}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});