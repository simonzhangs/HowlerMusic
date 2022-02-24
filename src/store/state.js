import initLocalStorage from './initLocalStorage';
import pkg from '../../package.json';
import undateApp from '@/utils/undateApp';

// 如果没有更新过，用初始的配置
if (localStorage.getItem('appVersion') === null) {
    localStorage.setItem('settings', JSON.stringify(initLocalStorage.settings));
    localStorage.setItem('data', JSON.stringify(initLocalStorage.data));
    localStorage.setItem('appVersion', pkg.version);
}

// 否则，更新配置
undateApp();

export default {
    showLyrics: false,
    enableScrolling: true,
    liked: {
        songs: [],
        songsWithDetails: [], // 音乐库 第一栏目 只有前12首
        playlists: [],
        albums: [],
        artists: [],
        mvs: [],
        cloudDisk: [],
    },
    contextMenu: {
        clickObjectID: 0,
        showMenu: false,
    },
    toast: {
        show: false,
        text: '',
        timer: null,
    },
    modals: {
        addTrackToPlaylistModal: {
            show: false,
            selectedTrackID: 0,
        },
        newPlaylistModal: {
            show: false,
            afterCreateAddTrackID: 0,
        },
    },
    dailyTracks: [],
    lastfm: JSON.parse(localStorage.getItem('lastfm')) || {},
    player: JSON.parse(localStorage.getItem('player')),
    settings: JSON.parse(localStorage.getItem('settings')),
    data: JSON.parse(localStorage.getItem('data')),
};