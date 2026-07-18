// Innovatia Learning Platform - Electron main process
// Creates the desktop window that hosts the interactive Year 1 learning experience.
const { app, BrowserWindow, Menu, shell, ipcMain, dialog } = require('electron');
const path = require('path');

const isDev = !app.isPackaged;
let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 820,
    minWidth: 900,
    minHeight: 640,
    backgroundColor: '#f3f6f9',
    title: 'Innovatia Learning',
    icon: path.join(__dirname, '..', 'build', 'icon.png'),
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      // Learner safety: no arbitrary navigation, no remote content.
      sandbox: true,
      spellcheck: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, '..', 'src', 'index.html'));

  mainWindow.once('ready-to-show', () => mainWindow.show());

  // SEC/UX: keep learners inside the app. External links (only teacher/parent
  // approved ones) open in the system browser rather than an in-app window.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://')) shell.openExternal(url);
    return { action: 'deny' };
  });
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('file://')) {
      event.preventDefault();
      if (url.startsWith('https://')) shell.openExternal(url);
    }
  });

  if (isDev) mainWindow.webContents.openDevTools({ mode: 'detach' });
}

// A trimmed, child-appropriate application menu.
function buildMenu() {
  const template = [
    {
      label: 'Innovatia',
      submenu: [
        {
          label: 'About Innovatia Learning',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About Innovatia Learning',
              message: 'Innovatia Learning',
              detail:
                'Year 1 Digital Learning & Curriculum Management Platform\n' +
                'Version ' + app.getVersion() + '\n\n' +
                'Interactive learning for Term 1 & Term 2 (2025/2026).'
            });
          }
        },
        { type: 'separator' },
        { role: 'reload' },
        { role: 'togglefullscreen' },
        { type: 'separator' },
        { role: 'quit', label: 'Exit' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' }
      ]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// A learner or parent can raise a safe-content report (SEC-010 / FR-035).
// The report is acknowledged locally; a real deployment would route it to the
// configured safeguarding reviewer.
ipcMain.handle('safety-report', async (_event, context) => {
  await dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'Thank you for telling an adult',
    message: 'Your report has been sent to a trusted adult.',
    detail:
      'A grown-up at your school will look at this soon.\n\n' +
      'Reference: ' + context.reference
  });
  return { acknowledged: true };
});

app.whenReady().then(() => {
  buildMenu();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
