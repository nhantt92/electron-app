const {app, BrowserWindow, webContents, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');

let mainWindow, secondWindow, windowToCapture, windowToPrint;

ipcMain.on('capture-window', event => {
    windowToCapture = BrowserWindow.fromId(event.sender.webContents.id);
    let bounds = windowToCapture.getBounds();
    setTimeout(()=>{
    windowToCapture.webContents.capturePage({x: 0, y: 0, width: bounds.width, height: bounds.height}, imageCaptured)
    }, 500);
});

function imageCaptured(image){
    let desktop = app.getPath('desktop');
    let filePath = desktop + '/' + windowToCapture.getTitle() + '-captured-file.png';
    console.log(filePath);
    let png = image.toPNG();
    fs.writeFileSync(filePath, png);
}

ipcMain.on('print-to-pdf', event => {
    windowToPrint = BrowserWindow.fromId(event.sender.webContents.id);
    windowToPrint.webContents.printToPDF({}, pdfCreated);
});

function pdfCreated(err, data) {
    let desktop = app.getPath('desktop');
    let filePath = desktop + '/' + windowToPrint.getTitle() + '-printed.pdf';
    console.log(filePath);
    if(err) console.log(err.message);
    if(data) {
        fs.writeFile(filePath, data, error => {
            if(error) console.log(error.message);
        });
    }
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
    mainWindow = createWindow('index.html',{width: 800, height: 600, title: 'MAIN', backgroundColor: '#FFF'});
    secondWindow = createWindow('index.html', {width: 400, height: 400, title: 'SECOND', backgroundColor: '#FFF'})
});

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if(mainWindow === null) createWindow();
});