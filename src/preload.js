const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
	executeCode: (code) => ipcRenderer.invoke("execute-code", code),
	windowAction: (action) => ipcRenderer.send("window-action", action),
});

console.log("Electron API cargada correctamente");
