const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        show: false,
        backgroundColor: '#FFF',
        width: 800, 
        height:600,
        minWidth: 800,
        maxWidth: 1024,
        maxHeight: 768,
        minHeight: 600,
        resizable: true,
        movable: true,
        alwaysOnTop: false,
        title: "Hello World",
        //frame: false,
       // titleBarStyle: 'hidden' // only osx
       //transparent: true
    });
    //mainWindow.loadFile('index.html');
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
    // Wait for 'ready-to-show' to display our window
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

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