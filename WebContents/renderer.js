const { ipcRenderer } = require('electron');

document.getElementById('captureButton').addEventListener('click', captureButtonClickHandler);
document.getElementById('printButton').addEventListener('click', printButtonClickHandler);

function captureButtonClickHandler(){
    ipcRenderer.send('capture-window');
}

function printButtonClickHandler(){
    ipcRenderer.send('print-to-pdf');
}