const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 700,
        height: 70,
        x: 550,
        y: 50,
        frame: false,
        transparent: true,
        resizable: false,
        alwaysOnTop: true,
        skipTaskbar: true,
        webPreferences: {
            // preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        },
        show: false,
        type: 'toolbar'
    });

    mainWindow.loadFile('index.html');
    
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.on('blur', () => {
        mainWindow.hide();
    });
}

// Modify the app ready handler
app.whenReady().then(() => {
    
    // hot reload for development
    // require('electron-reload')(__dirname, {
    //     electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
    // });

    createWindow();

    // IPC handlers
    ipcMain.on('quit-app', () => {
        app.quit();
    });
});

// on macOS
if (process.platform === 'darwin') {
    app.dock.hide();
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    } 
});
