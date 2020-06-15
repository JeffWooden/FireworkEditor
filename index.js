const { app, BrowserWindow, Menu } = require('electron')

function createWindow () {
  // Cree la fenetre du navigateur.
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    icon: __dirname + '/app/assets/icons/fireworks/normal.png'
  })
  win.maximize();

  // and load the index.html of the app.
  win.loadFile('./app/index.html')
}
// Menu.setApplicationMenu(null)
app.whenReady().then(createWindow)