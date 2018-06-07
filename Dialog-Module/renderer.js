//javascript of index.html

const ipc = require('electron').ipcRenderer;
const selectDirBtn = document.getElementById('select-directory');
const selectFileBtn = document.getElementById('select-file');
const saveFileBtn = document.getElementById('save-file');

selectDirBtn.addEventListener('click', function(event){
    ipc.send('open-directory-dialog');
});

ipc.on('selectedItem', function(event, path){
    document.getElementById('selectedItem').innerHTML = `PATH: ${path}`
});

selectFileBtn.addEventListener('click', function(event){
    ipc.send('open-file-dialog');
});

ipc.on('content-file', function(event, path){
    document.getElementById('content-file').innerHTML = `${path}`
});

saveFileBtn.addEventListener('click', function(event){
    ipc.send('save-file-dialog');
})
