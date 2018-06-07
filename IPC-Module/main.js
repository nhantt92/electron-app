const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const url = require('url');
const ipc = ipcMain; 

let mainWindow;

ipc.on('sync-message', function(event, arg){
    event.returnValue = 'Main process listen!'
});

ipc.on('async-message', function(event, arg){
    if(arg === 'Call main process'){
        event.sender.send('asyn-reply', ', Main process listen and reply async');
    }
})

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
