const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;
let splashWindow;

ipcMain.on('app-init', event => {
    if(splashWindow) {
        setTimeout(() => {
            splashWindow.close()
        }, 500);
    }
    mainWindow.show();
})

function createSplashWindow() {
    splashWindow = new BrowserWindow({
        width: 320,
        height: 240,
        frame: false,
        resizable: false,
        backgroundColor: '#FFF',
        alwaysOnTop: true,
        show: false
    });
    splashWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'splash.html'),
        protocol: 'file:',
        slashes: true
    }));
    splashWindow.on('closed', () => {
        splashWindow = null;
    });
    splashWindow.once('ready-to-show', () => {
        splashWindow.show();
        createWindow()
    })
}

function createWindow() {
    mainWindow = new BrowserWindow({ width: 800, height: 600, show: false });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))
    //mainWindow.webContents.openDevTools();
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', createSplashWindow);

// app.on('ready', createWindow);

app.on('window-all-closed', () => {

    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (mainWindow === null) createWindow();
});


ipcMain.on('get-version', event => {
    console.log(app.getVersion());
    event.sender.send('set-version', app.getVersion());
})

