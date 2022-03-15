export default store => {
    // vuex 状态数据本地存储
    store.subscribe((mutations, state) => {
        localStorage.setItem('settings', JSON.stringify(state.settings));
        localStorage.setItem('data', JSON.stringify(state.data));
        localStorage.setItem('player', JSON.stringify(state.player));
        localStorage.setItem('liked', JSON.stringify(state.liked));
    })
}