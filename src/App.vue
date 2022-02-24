<template>
  <div id="app" :class="{ 'user-select-none': userSelectNone}">
    <Scrollbar v-show="!showLyrics" ref="scrollbar" />
    <Navbar v-show="showNavbar" ref="navbar" />
    <main
      ref="main"
      :style="{ overflow: enableScrolling ? 'auto' : 'hidden' }"
      @scroll="handleScroll"
    >
      <keep-alive>
        <router-view v-if="$router.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$router.meta.keepAlive"></router-view>
    </main>

    <transition name="slide-up">
      <Player v-if="enablePlayer" v-show="showPlayer" ref="player" />
    </transition>
    <Toast />
  </div>
</template>

<script>
import {mapState} from 'vuex';
import Player from './components/Player.vue'
import Scrollbar from './components/Scrollbar.vue';
import Toast from './components/Toast.vue'
import Navbar from './components/Navbar.vue';
export default {
  name: 'App',
  components: {
    Player,
    Scrollbar,
    Navbar,
    Toast,
},
  data() {
    return {
      userSelectNone: false,
    };
  },
  computed: {
    ...mapState(['showLyrics','settings','player','enableScrolling'])
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
