<template>
  <!-- 导航栏组件 -->
  <div>
    <nav>
      <!-- 最大、最小、关闭 -->
      <div class="win32-titlebar">
        <div class="title">ZBoqi-Music</div>
        <div class="controls">
          <div
            class="button minimize codicon codicon-chrome-minimize"
            @click="windowMinimize"
          ></div>
          <div
            class="button max-restore codicon"
            :class="{
              'codicon-chrome-restore': !isWindowMaximized,
              'codicon-chrome-maximize': isWindowMaximized,
            }"
            @click="windowMaxRestore"
          ></div>
          <div
            class="button close codicon codicon-chrome-close"
            @click="windowClose"
          ></div>
        </div>
      </div>
      <!-- 导航栏左： 前进 后退 -->
      <div class="navigation-buttons">
        <button-icon @click.native="go('back')">
          <svg-icon icon-class="arrow-left" />
        </button-icon>
        <button-icon @click.native="go('foward')">
          <svg-icon icon-class="arrow-right" />
        </button-icon>
      </div>
      <!-- 导航栏中： 首页、发现、音乐库 -->
      <div class="navigation-links">
        <router-link to="/" :class="{ active: $route.name === 'home' }">
          {{ $t("nav.home") }}
        </router-link>
        <router-link
          to="/explore"
          :class="{ active: $route.name === 'explore' }"
        >
          {{ $t("nav.explore") }}
        </router-link>
        <router-link
          to="/library"
          :class="{ active: $route.name === 'library' }"
        >
          {{ $t("nav.library") }}
        </router-link>
      </div>
      <!-- 导航栏右： 搜索框 和 个人档案 -->
      <div class="right-part">
        <div class="search-box">
          <div class="container" :class="{ active: inputFocus }">
            <svg-icon icon-class="search" />
            <div class="input">
              <input
                ref="searchInput"
                v-model="keywords"
                type="search"
                :placeholder="inputFocus ? '' : $t('nav.search')"
                @keydown.enter="doSearch"
                @focus="inputFocus = true"
                @blur="inputFocus = false"
              />
            </div>
          </div>
        </div>
        <img class="avatar" :src="avatarUrl" @click="showUserProfileMenu" />
      </div>
    </nav>

    <ContextMenu ref="userProfileMenu">
      <div class="item" @click="toSettings">
        <svg-icon icon-class="settings" />
        {{ $t("library.userProfileMenu.settings") }}
      </div>
      <div v-if="!isLooseLoggedIn" class="item" @click="toLogin">
        <svg-icon icon-class="login" />
        {{ $t("login.login") }}
      </div>
      <div v-if="isLooseLoggedIn" class="item" @click="logout">
        <svg-icon icon-class="logout" />
        {{ $t("library.userProfileMenu.logout") }}
      </div>
      <hr />
      <div class="item" @click="toGithub">
        <svg-icon icon-class="github" />
        {{ $t("nav.github") }}
      </div>
    </ContextMenu>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { isLooseLoggedIn, doLogout } from "@/utils/auth";

// import icons for win32 title bar
// icons by https://github.com/microsoft/vscode-codicons
import "vscode-codicons/dist/codicon.css";

import ContextMenu from "@/components/ContextMenu.vue";
import ButtonIcon from "@/components/ButtonIcon.vue";

const electron =
  process.env.IS_ELECTRON === true ? window.require("electron") : null;
const ipcRenderer =
  process.env.IS_ELECTRON === true ? electron.ipcRenderer : null;

export default {
  name: "Navbar",
  components: {
    ButtonIcon,
    ContextMenu,
  },
  data() {
    return {
      inputFocus: false,
      langs: ["zh-CN", "zh-TW", "en", "tr"],
      keywords: "",
      isWindowMaximized: false,
    };
  },
  computed: {
    ...mapState(["settings", "data"]),
    isLooseLoggedIn() {
      return isLooseLoggedIn();
    },
    avatarUrl() {
      return this.data?.user?.avatarUrl && this.isLooseLoggedIn
        ? `${this.data?.user?.avatarUrl}?param=512y512`
        : "http://s4.music.126.net/style/web2/img/default/default_avatar.jpg?param=60y60";
    },
  },
  created() {
    if (process.env.IS_ELECTRON === true) {
      ipcRenderer.on("isMaximized", (event, value) => {
        this.isWindowMaximized = value;
      });
    }
  },
  methods: {
    go(where) {
      if (where === "back") return;
      if (
        this.$route.name === "search" &&
        this.$route.params.keywords === this.keywords
      ) {
        return;
      }

      this.$router.push({
        name: "search",
        params: { keywords: this.keywords },
      });
    },
    showUserProfileMenu(e) {
      this.$refs.userProfileMenu.openMenu(e);
    },
    logout() {
      if (!confirm("确定要退出登录吗?")) return;
      doLogout();
      this.$router.push({ name: "home" });
    },
    toSettings() {
      this.$router.push({ name: "settings" });
    },
    toGithub() {
      window.open("https://github.com/qier222/YesPlayMusic");
    },
    toLogin() {
      if (process.env.IS_ELECTRON === true) {
        this.$router.push({ name: "loginAccount" });
      } else {
        this.$router.push({ name: "login" });
      }
    },
    windowMinmize() {
      ipcRenderer.send("minimize");
    },
    windowMaxRestore() {
      ipcRenderer.send("maximizeOrUnmaximize");
    },
    windowClose() {
      ipcRenderer.send("close");
    },
  },
};
</script>

<style lang="scss" scoped></style>
