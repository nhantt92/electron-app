const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const url = require('url');
const ipc = ipcMain;
const fs = require('fs');

let mainWindow;

ipc.on('open-directory-dialog', function (event) {
    dialog.showOpenDialog({
        title: 'Select a workspace',
        properties: ['openDirectory'],
        defaultPath: '/',
        buttonLabel: "Select..."
    }, function (files) {
        if (files) event.sender.send('selectedItem', files)
    })
});

ipc.on('open-file-dialog', function (event) {
    let startPath = "";
    if (process.platform === 'darwin') {
        startPath = "/Users/<username>/Documents/";
    }
    dialog.showOpenDialog({
        title: 'Select a workspage...',
        properties: ['openFile'],
        defaultPath: startPath,
        buttonLabel: "Select...",
        filters: [
            // {name: 'Images', extensions: ['jpg', 'png', 'gif']},
            { name: 'Text', extensions: ['txt'] }
        ]
    }, function (files) {
        // if(files){
        //     event.sender.send('selectedItem', files);
        // }
        if (files === undefined) return;
        // event.sender.send('selectedItem', files);
        let fileName = files[0];
        fs.readFile(fileName, 'utf-8', (err, data) => {
            if (err) event.sender.send('content-file', `Error: + ${err}`);
            event.sender.send('content-file', data);
        })
    })
});

ipc.on('save-file-dialog', function (event) {
    let startPath = '';
    if (process.platform === 'darwin') startPath = '/Users/<username>/Documnets/';
    dialog.showSaveDialog({
        title: 'Save file ... ',
        defaultPath: startPath,
        buttonLabel: "Save",
        filers: [
            { name: 'Text', extensions: ['txt'] }
        ]
    }, function (file) {
        if (file === undefined) return;
        let theData = "Chirs, 10000";
        fs.writeFile(file, theData, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('It is saved!');
            }
        });
    })
});

ipc.on('display-dialog', function(event, dialogType){
    console.log(dialogType);
    dialog.showMessageBox({
        type: dialogType,
        buttons: ['Save', 'Cancel', 'Don\'t Save'],
        defaultId: 0,
        cancelId: 1,
        title: 'Save Score',
        message: 'Hellp Dialog Message!',
        detail: 'Message detail'
    });
})

function createWindow() {
    mainWindow = new BrowserWindow({ width: 1024, height: 600 });
    mainWindow.loadFile('index.html');
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (mainWindow === null) createWindow();
});
