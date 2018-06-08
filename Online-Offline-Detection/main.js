const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const isOnline = require('is-online');

let mainWindow;
let checkIsOnlineInterval;
let currentOnlineStatus;

function checkIsOnline() {
    isOnline().then(online => {
        console.log("Online? "+ online)
        mainWindow.webContents.send('update-online-status', {online: online});
        if(currentOnlineStatus !== online){
            if(process.platform === 'darwin') {
                app.dock.bounce('informational')
            }
        }
        currentOnlineStatus = online
    })
}

function startCheckingOnlineStatus() {
    checkIsOnlineInterval = setInterval(checkIsOnline, 1000);
}

//ipcMain.on('check-online-status', checkIsOnline);

function createWindow() {
    mainWindow = new BrowserWindow({ width: 800, height: 600 });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))
    //mainWindow.webContents.openDevTools();
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    startCheckingOnlineStatus();
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {

    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (mainWindow === null) createWindow();
});
