<template>
  <div id="app" :class="{ 'user-select-none': userSelectNone }">
    <Scrollbar v-show="!showLyrics" ref="scrollbar" />
    <Navbar v-show="showNavbar" ref="navbar" />
    <main
      ref="main"
      :style="{ overflow: enableScrolling ? 'auto' : 'hidden' }"
      @scroll="handleScroll"
    >
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </main>
    <transition name="slide-up">
      <Player v-if="enablePlayer" v-show="showPlayer" ref="player" />
    </transition>
    <Toast />
    <ModalAddTrackToPlaylist v-if="isAccountLoggedIn" />
    <ModalNewPlaylist v-if="isAccountLoggedIn" />
    <transition v-if="enablePlayer" name="slide-up">
      <Lyrics v-show="showLyrics" />
    </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";

import ModalNewPlaylist from "./components/ModalNewPlaylist.vue";
import ModalAddTrackToPlaylist from "./components/ModalAddTrackToPlaylist.vue";
import Navbar from "./components/Navbar.vue";
import Player from "./components/Player.vue";
import Scrollbar from "./components/Scrollbar.vue";
import Toast from "./components/Toast.vue";
import Lyrics from "./views/lyrics.vue";

import { isAccountLoggedIn, isLooseLoggedIn } from "@/utils/auth";

export default {
  name: "App",
  components: {
    Navbar,
    Player,
    Scrollbar,
    Toast,
    ModalAddTrackToPlaylist,
    ModalNewPlaylist,
    Lyrics,
  },
  data() {
    return {
      userSelectNone: false,
    };
  },
  computed: {
    ...mapState(["showLyrics", "settings", "player", "enableScrolling"]),
    isAccountLoggedIn() {
      return isAccountLoggedIn();
    },
    // 判断页面是否展示播放器
    showPlayer() {
      return (
        [
          "mv",
          "loginUsername",
          "login",
          "loginAccount",
        ].includes(this.$route.name) === false
      );
    },
    // 判断是否存在播放器
    enablePlayer() {
      return this.player.enabled;
    },
    // 判断是否展示导航栏
    showNavbar() {
      return true;
    },
  },
  created() {
    window.addEventListener('keydown', this.handleKeydown);
    this.fetchData(); 
  },
  methods: {
    // 网页空格控制播放暂停
    handleKeydown(e) {
      if (e.code === 'Space') { 
        if (e.target.tagName === 'INPUT') return false;
        // if (this.$route.name === 'mv') return false;
        e.preventDefault();
        this.player.playOrPause();
      }
    },
    // 判断是否登陆，来获取用户数据
    fetchData() {
      if (!isLooseLoggedIn()) return;
      this.$store.dispatch('fetchLikedSongs');
      this.$store.dispatch('fetchLikedSongsWithDetails');
      this.$store.dispatch('fetchLikedPlaylist');
      if (isAccountLoggedIn()) {
        this.$store.dispatch('fetchLikedAlbums');
        this.$store.dispatch('fetchLikedArtists');
        this.$store.dispatch('fetchLikedMvs');
        this.$store.dispatch('fetchCloudDisk');
      }
    },
    handleScroll() {
      this.$refs.scrollbar.handleScroll();
    },
  },
};
</script>

<style lang="scss">
#app {
  width: 100%;
  transition: all 0.4s;
}

main {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  overflow: auto;
  padding: 64px 10vw 96px 10vw;
  box-sizing: border-box;
}

@media (max-width: 1336px) {
  main {
    padding: 64px 5vw 96px 5vw;
  }
}

main::-webkit-scrollbar {
  width: 0px;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.4s;
}
.slide-up-enter,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
