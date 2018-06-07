// require native Browser window, application life
const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;

function createWindow() {
    // tao mot Browser window
    mainWindow = new BrowserWindow({width: 1024, height:600});
    //load file index.html 
    mainWindow.loadFile('index.html');
    //mainWindow.loadURL('http:facebbook.com');
    //mo Devtools
    //mainWindow.webContents.openDevTools();
    //Emit khi cua so dong
    mainWindow.on('closed', () => {
        //doi tuong cua so, khi su dung nhieu cua so thi co array objectwindow, delete tuong ung
        mainWindow = null;
    });
}

// Phuong thuc nay duoc goi khi elctron finished
// khoi tao va san sang tao browser windows
// mot so API co the su dung sau khi su kien nay xay ra
app.on('ready', createWindow);

//Thoat khi tat ca cua so dong
app.on('window-all-closed', () => {
    // tren OSX no con nam tren Menubar
    // hoat dong duy tri den khi nguoi dung Cmd+Q
    if(process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    // tren OSX no re-create a window on dock icon 
    if(mainWindow === null) createWindow();
});
