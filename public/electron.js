const {app, globalShortcut, BrowserWindow} = require('electron');

const path = require('path');
const isDev = require('electron-is-dev');
const electronLocalshortcut = require('electron-localshortcut');

let mainWindow;

let globalShortcuts = [
  'CommandOrControl+H',
  'CommandOrControl+W'
];

let localShortcuts = [
  'CommandOrControl+O',
  'CommandOrControl+N',
  'Up',
  'Down'
];

function registerShortcuts () {
  globalShortcuts.forEach(accelerator => {
    globalShortcut.register(accelerator, () => {
      mainWindow.webContents.send('keyPress', accelerator);
    });
  });
}

function unregisterShortcuts () {
  globalShortcuts.forEach(accelerator => {
    globalShortcut.unregister(accelerator);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    icon: path.join(__dirname, 'icon.png'),
  });
  mainWindow.maximize();
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.on('closed', () => mainWindow = null);

  localShortcuts.forEach(accelerator => {
    electronLocalshortcut.register(mainWindow, accelerator, () => {
      mainWindow.webContents.send('keyPress', accelerator)
    });
  });

  registerShortcuts();
  mainWindow.on('focus', registerShortcuts);
  mainWindow.on('blur', unregisterShortcuts);
}

app.on('ready', createWindow);

app.on('open-file', (event, path) => {
  event.preventDefault();
  app.on('ready', () => {
    mainWindow.webContents.send('open-file', path);
  });
});

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