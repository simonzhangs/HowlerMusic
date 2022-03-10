// 如果没有更新过，用初始的配置
// 用于初始化 state 状态

import { playlistCategories } from "@/utils/staticData";
import shortcuts from "@/utils/shortcuts";

console.debug('[debug][initLocalStorage.js]');
const enabledPlaylistCategories = playlistCategories
    .filter(c => c.enable)
    .map( c => c.name);

let localStorage = {
    player: {},
    settings: {
        lang: null,
        musicLanguage: 'all',
        appearance: 'auto',
        musicQuality: 320000,
        lyricFontSize: 28,
        outputDevice: 'default',
        showPlaylistsByAppleMusic: true,
        enableUnblockNeteaseMusic: true,
        automaticallyCacheSongs: true,
        cacheLimit: 8192,
        enableReversedMode: false,
        nyancatStyle: false,
        showLyricsTranslation: true,
        lyricsBackgorund: true,
        closeAppOption: 'ask',
        enableDiscardRichPresence: false,
        enableGlobalShortcut: true,
        showLibraryDefault: false,
        subTitleDefault: false,
        enabledPlaylistCategories,
        proxyConfig: {
            protocol: 'noProxy',
            server: '',
            prot: null,
        },
        shortcuts: shortcuts,
    },
    data: {
        user: {},
        likedSongPlaylistID: 0,
        lastRefreshCookieData: 0,
        loginMode: null,
    },
}

export default localStorage;