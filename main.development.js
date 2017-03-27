import { app, BrowserWindow, Menu, shell, screen, crashReporter, ipcMain } from 'electron';
import rmdir from 'rimraf';

let mainWindow = null;

// crash reporter
// crashReporter.start({
//   productName: 'YourName',
//   companyName: 'YourCompany',
//   submitURL: 'http://localhost:4567/crashReporter',
//   // submitURL: 'http://localhost:1127/',
//   autoSubmit: true
// });

// Execute a crash
// setTimeout(() => {
//   process.crash();
// }, 3000);


if (process.env.NODE_ENV === 'development') {
  require('electron-debug')(); // eslint-disable-line global-require
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('ready', async () => {
  let size = screen.getPrimaryDisplay().size; // ディスプレイのサイズを取得する

  mainWindow = new BrowserWindow({
    width: 1024,
    height: 728,
    transparent: false,
    show: false,
    frame: true,
    resizable: true
  });

  mainWindow.show();

  mainWindow.loadURL(`file://${__dirname}/app/app.html`);

  if (process.env.NODE_ENV === 'development') {
    mainWindow.openDevTools();
  }

  // アプリケーションを quit する
  ipcMain.on('app-quit', function (event) {
    app.quit();
  });

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  if (process.platform === 'darwin') {
    // Mac の場合
  } else {
    // それ以外
  }
});
