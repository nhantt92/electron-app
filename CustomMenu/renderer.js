// const { remote } = require('electron');
// const { Menu } = remote;
const { remote, ipcRenderer } = require('electron');
const ipc = ipcRenderer;

// const myContextMenu = Menu.buildFromTemplate([
//     { lable: 'Cut', role: 'cut'},
//     { lable: 'Copy', role: 'copy'},
//     { lable: 'Paste', role: 'paste'},
//     { lable: 'Select All', role: 'selectall'},
//     { type: 'separator'},
//     { lable: 'Custom', click(){ console.log('Custom Menu')}}
// ]);

// window.addEventListener('contextmenu', (event) => {
//     event.preventDefault();
//     myContextMenu.popup();
// })

window.addEventListener('contextmenu', (event)=>{
    event.preventDefault();
    ipc.send('show-context-menu');
})