const { app, BrowserWindow, ipcMain, Menu, shell, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

const isDev = !app.isPackaged;

// FR-035 / SEC-010: safety reports are persisted locally so an authorised
// adult can review them; nothing ever leaves the device.
function appendSafetyReport(report) {
  const file = path.join(app.getPath('userData'), 'safety-reports.json');
  let reports = [];
  try {
    reports = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!Array.isArray(reports)) reports = [];
  } catch (err) {
    reports = [];
  }
  reports.push(report);
  fs.writeFileSync(file, JSON.stringify(reports, null, 2), 'utf8');
  return file;
}

function readSafetyReports() {
  const file = path.join(app.getPath('userData'), 'safety-reports.json');
  try {
    const reports = JSON.parse(fs.readFileSync(file, 'utf8'));
    return Array.isArray(reports) ? reports : [];
  } catch (err) {
    return [];
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 960,
    minHeight: 640,
    show: false,
    backgroundColor: '#f4f7ff',
    title: 'Innovatia Learning',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: false
    }
  });

  // 13.1: no open internet browsing from within the learner interface.
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  win.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('file://')) event.preventDefault();
  });

  Menu.setApplicationMenu(null);
  win.loadFile(path.join(__dirname, '..', 'app', 'index.html'));
  win.once('ready-to-show', () => win.show());

  if (isDev && process.env.INNOVATIA_DEVTOOLS === '1') {
    win.webContents.openDevTools({ mode: 'detach' });
  }
  return win;
}

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    const [win] = BrowserWindow.getAllWindows();
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  app.whenReady().then(() => {
    ipcMain.handle('app:version', () => app.getVersion());

    ipcMain.handle('safety:report', (event, payload) => {
      const report = {
        id: 'SR-' + Date.now(),
        createdAt: new Date().toISOString(),
        reporterRole: String(payload && payload.reporterRole || 'learner').slice(0, 40),
        context: String(payload && payload.context || '').slice(0, 500),
        status: 'Open'
      };
      const file = appendSafetyReport(report);
      return { ok: true, id: report.id, file };
    });

    ipcMain.handle('safety:list', () => readSafetyReports());

    ipcMain.handle('safety:openFolder', () => {
      shell.openPath(app.getPath('userData'));
      return true;
    });

    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on('window-all-closed', () => {
    app.quit();
  });
}
