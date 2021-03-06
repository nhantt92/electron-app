const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;
//let filePath = app.getAppPath() + '/test.txt';
// shell.showItemInFolder(filePath);
//shell.openItem(filePath);
let filePath = app.getAppPath() + '/test.html';
shell.openExternal(filePath);

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
    shell.beep();
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {

    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (mainWindow === null) createWindow();
});
