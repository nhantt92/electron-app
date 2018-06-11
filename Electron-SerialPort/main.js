// const SerialPort = require('serialport');
// const Readline = SerialPort.parsers.Readline;
// const ByteLength = SerialPort.parsers.ByteLength;
// const port = new SerialPort('COM4', { baudRate: 9600 });

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const SerialPort = require('serialport');
const port = new SerialPort("COM4", {baudRate: 9600});
var Readline = SerialPort.parsers.Readline;
var ByteLength = SerialPort.parsers.ByteLength;
var parser = new Readline('\r\n');
port.pipe(parser);
parser.on('data', (data)=>{
	var str = data.toString('utf8');
	console.log(str);
});

port.write('Node send\n');

let systemWindow;
let loginWindow;

function createLoginWindow() {
    loginWindow = new BrowserWindow({
        width: 320,
        height: 240,
        frame: false,
        resizable: false,
        backgroundColor: '#FFF',
        alwaysOnTop: true,
        show: true
    });
    loginWindow.loadURL(url.format({
        pathname: path.join(__dirname, '/app/login.html'),
        protocol: 'file:',
        slashes: true
    }));
    loginWindow.on('closed', () => {
        loginWindow = null;
    });
    loginWindow.once('read-to-show', () => {
        loginWindow.show();
        createSystemWindow();
    });
}

function createSystemWindow() {
    systemWindow = new BrowserWindow({ width: 1024, height: 600, show: false});
    systemWindow.loadURL(url.format({
        pathname: path.join(__dirname, '/app/index.html'),
        protocol: 'file:',
        slashes: true
    }));
    systemWindow.on('closed', () => {
        systemWindow = null;
    });
}

app.on('ready', createLoginWindow);

app.on('window-all-closed', ()=>{
    if(process.platform !== 'darwin') app.quit();
});

app.on('activate', ()=>{
    if(systemWindow === null) createSystemWindow();
});
