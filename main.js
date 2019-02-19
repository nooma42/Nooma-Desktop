const { app, BrowserWindow } = require('electron');
const {ipcMain} = require('electron')
const { net } = require('electron')

function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({  
  minHeight: 600,
  minWidth: 800, 
  nodeIntegration: true,
  width: 800, 
  height: 600
  });
  
  let devtools = new BrowserWindow();
   win.webContents.setDevToolsWebContents(devtools.webContents)
  win.webContents.openDevTools({mode: 'detach'});
  
  win.setMenuBarVisibility(false)
  // and load the index.html of the app.
  win.loadFile('index.html');
  //win.setResizable(false);
}

app.on('ready', createWindow);