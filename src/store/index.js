import Vue from 'vue';
import Vuex from 'vuex';

import state from './state';
import mutations from './mutations';
import actions from './actions';

import { changeAppearance } from '@/utils/common';
import Player from '@/utils/Player';

import saveToLocalStorage from './plugins/localStorage';
// import { getSendSettingsPlugin } from './plugins/sendSettings';

// import createPersistedState from 'vuex-persistedstate';
Vue.use(Vuex);

let plugins = [saveToLocalStorage];
const options = {
  state,
  mutations,
  actions,
  plugins,
};
const store = new Vuex.Store(options);

if ([undefined, null].includes(store.state.settings.lang)) {
  const defaultLang = 'en';
  const langMapper = new Map()
    .set('zh', 'zh-CN')
    .set('zh-TW', 'zh-TW')
    .set('en', 'en')
    .set('tr', 'tr');
  store.state.settings.lang =
    langMapper.get(
      langMapper.has(navigator.language)
        ? navigator.language
        : navigator.language.slice(0, 2)
    ) || defaultLang;
  localStorage.setItem('settings', JSON.stringify(store.state.settings));
}

changeAppearance(store.state.settings.appearance);

window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', () => {
    if (store.state.settings.appearance === 'auto') {
      changeAppearance(store.state.settings.appearance);
    }
  });

let player = new Player();
player = new Proxy(player, {
  set(target, prop, val) {
    target[prop] = val;
    if (prop === '_howler') return true;
    target.saveSelfToLocalStorage();
    return true;
  },
});

store.state.player = player;

export default store;
