import initLocalStorage from './initLocalStorage';
import pkg from '../../package.json';
import updateApp from '@/utils/updateApp';

// 如果没有更新过，用初始的配置
if (localStorage.getItem('appVersion') === null) {
    localStorage.setItem('settings', JSON.stringify(initLocalStorage.settings));
    localStorage.setItem('data', JSON.stringify(initLocalStorage.data));
    localStorage.setItem('appVersion', pkg.version);
}

// 否则，更新配置
updateApp();

export default {
    showLyrics: false,
    enableScrolling: true,
    // 个人音乐库
    liked: {
        songs: [],
        songsWithDetails: [], // 音乐库 第一栏目 只有前12首
        playlists: [],
        albums: [],
        artists: [],
        mvs: [],
        cloudDisk: [],
        playHistory: {}, //自己加的 library 为了不报错
    },
    // 点击或右键 弹出菜单栏
    contextMenu: {
        clickObjectID: 0,
        showMenu: false,
    },
    // 文本提示信息
    toast: {
        show: false,
        text: '',
        timer: null,
    },
    // 新建歌单或添加到歌单 状态信息
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
    player: JSON.parse(localStorage.getItem('player')),
    settings: JSON.parse(localStorage.getItem('settings')),
    data: JSON.parse(localStorage.getItem('data')),
};