const { ipcRenderer } = require('electron');
let onlineStatus;
const updateOnlineStatus = (event, status) => {
    console.log(status);
    if(status.online){
        document.body.style.backgroundColor = 'green'
        document.getElementById('h2-checking').style.display = 'none'
        document.getElementById('h2-online').style.display = 'block'
        document.getElementById('h2-offline').style.display = 'none'
    } else {
        document.body.style.backgroundColor = 'red'
        document.getElementById('h2-checking').style.display = 'none'
        document.getElementById('h2-online').style.display = 'none'
        document.getElementById('h2-offline').style.display = 'block'
    }
    if(this.onlineStatus !== undefined && this.onlineStatus !== status.online) {
        let note = new Notification('You are ' + (status.online ? 'online' : 'offline'),
                                    {body: 'You are now ' + (status.online ? 'online' : 'offline')})
        note.onclick = () => {
            console.log('Notification clicked!');
        }
    }
    this.onlineStatus = status.online;
}

ipcRenderer.on('update-online-status', updateOnlineStatus);

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
document.getElementById('checkStatusButton').addEventListener('click', updateOnlineStatus);

updateOnlineStatus();

// const checkOnlineStatus = () => {
//     document.body.style.backgroundColor = 'white'
//     document.getElementById('h2-checking').style.display = 'block'
//     document.getElementById('h2-online').style.display = 'none'
//     document.getElementById('h2-offline').style.display = 'none'
//     ipcRenderer.on('checkOnlineStatus');
// }

// window.addEventListener('online', checkOnlineStatus);
// window.addEventListener('offline', checkOnlineStatus);
// document.getElementById('checkStatusButton').addEventListener('click', checkOnlineStatus, false);

// checkOnlineStatus();