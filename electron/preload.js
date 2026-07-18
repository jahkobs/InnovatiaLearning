// Secure bridge between the sandboxed renderer and the main process.
// Only a tiny, explicit surface is exposed (contextIsolation is on).
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('innovatia', {
  // Raise a child-safety / unsafe-content report (SEC-010, FR-035).
  reportSafety: (context) => ipcRenderer.invoke('safety-report', context),
  // Identify that we are running inside the packaged desktop shell.
  isDesktop: true,
  platform: process.platform
});
