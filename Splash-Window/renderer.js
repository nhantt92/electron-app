//javascript of index.html

const { ipcRenderer } = require('electron');

setTimeout(() => {ipcRenderer.send('app-init')}, 5000);