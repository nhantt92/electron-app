const { ipcRenderer } = require('electron');

document.getElementById('captureButton').addEventListener('click', captureButtonClickHandler);

function captureButtonClickHandler(){
    ipcRenderer.send('capture-window');
}