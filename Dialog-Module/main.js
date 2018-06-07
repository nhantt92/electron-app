const {app, BrowserWindow, ipcMain, dialog} = require('electron');
const path = require('path');
const url = require('url');
const ipc = ipcMain; 

let mainWindow;

ipc.on('open-directory-dialog', function(event) {
    dialog.showOpenDialog({
        properties: ['openDirectory']
    }, function(files){
        if(files) event.sender.send('selectedItem', files)
    })
});

function createWindow() {
    mainWindow = new BrowserWindow({width: 1024, height:600});
    mainWindow.loadFile('index.html');
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') app.quit();
});

app.on('activate', () => { 
    if(mainWindow === null) createWindow();
});
