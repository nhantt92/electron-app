const { Menu, MenuItem, ipcMain, app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');


let mainWindow;
const contextMenu = new Menu();
contextMenu.append(new MenuItem({label: 'Cut', role: 'cut'}));
contextMenu.append(new MenuItem({label: 'Copy', role: 'copy'}));
contextMenu.append(new MenuItem({label: 'Paste', role: 'paste'}));
contextMenu.append(new MenuItem({label: 'Select All', role: 'selectall'}));
contextMenu.append(new MenuItem({type:'separator'}));
contextMenu.append(new MenuItem({label: 'Custom', click(){console.log('Custom Menu')}}));

ipcMain.on('show-context-menu', function(event) {
    const win = BrowserWindow.fromWebContents(event.sender);
    contextMenu.popup(win);
})

let template = [
    {
        label: 'Edit',
        submenu: [
            {
                label: 'Undo',
                accelerator: 'CmdOrCtrl+Z',
                role: 'undo'
            },
            {
                label: 'Redo',
                accelerator: 'Shift+CmdOrCtrl+Z',
                role: 'redo'
            },
            {
                type: 'separator'
            },
            {
                label: 'Cut',
                accelerator: 'CmdOrCtrl+X',
                role: 'cut'
            },
            {
                label: 'Copy',
                accelerator: 'CmdOrCtrl+C',
                role: 'copy'
            },
            {
                label: 'Paste',
                accelerator: 'CmdOrCtrl+V',
                role: 'paste'
            },
            {
                label: 'Select All',
                accelerator: 'CmdOrCtrl+A',
                role: 'selectall'
            }
        ]
    },
    {
        label: 'View',
        submenu: [
            {
                label: 'Reload',
                accelerator: 'CmdOrCtrl+R',
                click: (item, focuseWindow) => {
                    if (focuseWindow) {
                        // on reload, start fresh and close any old
                        // open secondary windows
                        if (focuseWindow.id === 1) {
                            BrowserWindow.getAllWindows().forEach((win) => {
                                if (win.id > 1) win.close();
                            });
                        }
                        focuseWindow.reload();
                    }
                }
            },
            {
                label: 'Toggle Full Screen',
                accelerator: (function(){
                    if(process.platform === 'darwin') return 'Ctrl+Command+F';
                    else return 'F11'
                })(),
                click: function(item, focuseWindow) {
                    if(focuseWindow){
                        focuseWindow.setFullScreen(!focuseWindow.isFullScreen());
                    }
                }
            },
            {
                label: 'Toggle Developer Tools',
                accelerator: (function(){
                    if(process.platform === 'drawin') return 'Alt+Command+I';
                    else return 'Ctrl+Shift+I';
                })(),
                click: function(item, focuseWindow) {
                    if(focuseWindow) focuseWindow.toggleDevTools();
                }
            }
        ]
    }, {
        label: 'Window',
        role: 'Window',
        submenu: [{
            label: 'Minimize',
            accelerator: 'CmdOrCtrl+M',
            role: 'minimize'
        }, {
            label: 'Close',
            accelerator: 'CmdOrCtrl+W',
            role: 'close'
        }, {
            type: 'separator'
        }, {
            label: 'Reopen Window',
            accelerator: 'CmdOrCtrl+Shift+T',
            enabled: false,
            key: 'reopenMenuItem',
            click: function(){
                app.emit('activate')
            }
        }]
    },{
        label: 'Help',
        role: 'help',
        submenu: [{
            label: 'Learn More',
            click: function() {
                electron.shell.openExternal('http://electron.atom.io');
            }
        }]
    }
];

template[3].submenu.push({
    type: 'separator'
    },{
        label: 'Bring All to Front',
        role: 'front'
    }
)

// OSX

if (process.platform === 'darwin') {
    let name = 'App Name'
    template.unshift({
        label: name,
        submenu: [
            {
                label: `About ${name}`,
                role: 'about',
            },
            { type: 'separator' },
            {
                label: 'Preferences',
                accelerator: 'Command+,',
                click: appPrefs
            },
            { type: 'separator' },
            {
                label: 'Services',
                role: 'services',
                submenu: [],
            },
            { type: 'separator' },
            {
                label: `Hide ${name}`,
                accelerator: 'Command+H',
                role: 'hide',
            }, {
                label: 'Hide Others',
                accelerator: 'Command+Alt+H',
                role: 'hideothers',
            }, {
                label: 'Show All',
                role: 'unhide',
            },
            { type: 'separator' },
            {
                label: `Quit ${name}`,
                accelerator: 'Command+Q',
                click: function () {
                    app.quit()
                }
            }]
    })
}

let windowMenu = {
    label: 'Window',
    role: 'window',
    submenu: [{
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize'
    }, {
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
        role: 'close'
    }, {
        type: 'separator'
    }, {
        label: 'Reopen Window',
        accelerator: 'CmdOrCtrl+Shift+T',
        enabled: false,
        key: 'reopenMenuItem',
        click: () => { app.emit('activate') }
    }]
}

if (process.platform === 'darwin') {
    template[2].submenu.push({
        type: 'separator'
    }, {
            label: 'Bring All to Front',
            role: 'front'
        });
}


function createWindow() {
    mainWindow = new BrowserWindow({
        show: false,
        backgroundColor: '#FFF',
        width: 1024,
        height: 600,
        title: "Hello World",
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

app.on('ready', () => {
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (mainWindow === null) createWindow();
});