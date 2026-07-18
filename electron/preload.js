const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('innovatia', {
  getVersion: () => ipcRenderer.invoke('app:version'),
  submitSafetyReport: (payload) => ipcRenderer.invoke('safety:report', payload),
  listSafetyReports: () => ipcRenderer.invoke('safety:list'),
  openDataFolder: () => ipcRenderer.invoke('safety:openFolder')
});
