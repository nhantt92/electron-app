//javascript of index.html

const ipc = require('electron').ipcRenderer;
const syncMsgBtn = document.getElementById('sendSyncMsgBtn');
const asyncMsgBtn = document.getElementById('sendAsyncMsgBtn');

syncMsgBtn.addEventListener('click', function(){
    const reply = ipc.sendSync('sync-message', 'Mr.Watson, come here.');
    console.log(reply);
    const message = `Synchronous message reply: ${reply}`;
    document.getElementById('syncReply').innerHTML = message;
});

asyncMsgBtn.addEventListener('click', function() {
   ipc.send('async-message', 'Call main process'); 
});

ipc.on('asyn-reply', function(event, arg){
    const message = `Asynchronous message reply: ${arg}`;
    document.getElementById('asyncReply').innerHTML = message;
});
