const {app, BrowserWindow, webContents, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');

let mainWindow, secondWindow, windowToCapture;

ipcMain.on('capture-window', event => {
    windowToCapture = BrowserWindow.fromId(event.sender.webContents.id);
    let bounds = windowToCapture.getBounds();
    windowToCapture.webContents.capturePage({x: 0, y: 0, width: bounds.width, height: bounds.height}, imageCaptured);
});

function imageCaptured(image){
    let desktop = app.getPath('desktop');
    let filePath = desktop + '/' + windowToCapture.getTitle() + '-captured-file.png';
    console.log(filePath);
    let png = image.toPNG();
    fs.writeFileSync(filePath, png);
}

function createWindow(fileStr, options) {
    let win = new BrowserWindow(options);
    win.webContents.on('did-start-loading', event => {
        console.log('did-start-loading', event.sender.webContents.browserWindowOptions.title);
    });

    win.webContents.on('dom-ready', event => {
        console.log('dom-ready');
    });

    win.webContents.on('did-finish-load', event =>{
        console.log('did-finish-load', event.sender.webContents.getTitle());
    });

    win.webContents.on('did-stop-loading', event=>{
        console.log('did-stop-loading', event.sender.webContents.id);
    })

    win.loadURL(url.format({
        pathname: path.join(__dirname, fileStr),
        protocol: 'file:',
        slashes: true
    }));
    //win.webContents.openDevTools();
    win.on('closed', () => {
        win = null;
    });
    return win;
}

app.on('ready', () => {
    mainWindow = createWindow('index.html',{width: 800, height: 600, title: 'MAIN'});
    secondWindow = createWindow('index.html', {width: 400, height: 400, title: 'SECOND'})
});

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if(mainWindow === null) createWindow();
});