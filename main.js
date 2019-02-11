const { app, BrowserWindow } = require('electron');
const {ipcMain} = require('electron')
const { net } = require('electron')

function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({ width: 800, height: 600 });
  //win.openDevTools();
  win.setMenuBarVisibility(false)
  // and load the index.html of the app.
  win.loadFile('index.html');
  win.setResizable(false);
}


function login() {
	console.log("click!");
}

app.on('ready', createWindow);