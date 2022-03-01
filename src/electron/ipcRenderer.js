import store from "@/store";

const player = store.state.player;

export function ipcRenderer(vueInstance) {
  const self = vueInstance;
  //添加专有的类名
  document.body.setAttribute("data-electron", "yes");
  document.body.setAttribute(
    "data-electron-os",
    window.require("os").platform()
  );

  // ipc message channel
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;

  ipcRenderer.on("changeRouteTo", (event, path) => {
    self.$router.push(path);
    if (store.state.showLyrics) {
      store.commit("toggleLyrics");
    }
  });

  ipcRenderer.on("search", () => {
    self.$refs.navbar.$refs.searchInput.focus();
    self.$refs.navbar.inputFocus = true;
  });

  ipcRenderer.on("play", () => {
    player.playOrPause();
  });

  ipcRenderer.on("next", () => {
    if (player.isPersonalFM) {
      player.playNextFMTrack();
    } else {
      player.playNextTrack();
    }
  });

  ipcRenderer.on('previous', () => {
      player.playPrevTrack();
  });

  ipcRenderer.on('increaseVolume', () => {
      if(player.volume + 0.1 >= 1) {
          return (player.volume = 1);
      }
      player.volume += 0.1;
  });

  ipcRenderer.on('decreaseVolume', () => {
      if (player.volume - 0.1 <= 0) {
          return (player.volume = 0);
      }
      player.volume -= 0.1;
  });

  ipcRenderer.on('like', () => {
      store.dispatch('likeAtrack', player.currentTrack.id);
  });

  ipcRenderer.on('repeat', () => {
      player.switchRepeatMode();
  });

  ipcRenderer.on('shuffle', () => {
      player.switchShuffle();
  });

  ipcRenderer.on('routerGo', (event,where) => {
      self.$refs.navbar.go(where);
  });

  ipcRenderer.on('nextUp', () => {
      self.$refs.player.goToNextTracksPage();
  });

  ipcRenderer.on('rememberCloseAppOption', (event,value) => {
      store.commit('updateSettings', {
          key: 'closeAppOption',
          value,
      });
  });

  ipcRenderer.on('setPosition', (event,position) => {
      player._howler.seek(position);
  })
}
