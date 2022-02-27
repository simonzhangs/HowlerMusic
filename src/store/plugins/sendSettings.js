export function getSendSettingsPlugin() {
    const electron = window.require('electron');
    const ipcRenderer = electron.ipcRenderer;
    return store => {
        store.subscribe((mutation, state) => {
            if (mutation.type !== 'undateSettings') return;
            ipcRenderer.send('settings',state.settings);
        })
    }
}