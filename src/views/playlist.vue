<template>
  <div v-show="show" class="playlist">
    <div
      v-if="specilPlaylist === undefined && !isLikeSongsPage"
      class="playlist-info"
    >
      <!-- 第一栏目 第一部分 封面 -->
      <Cover
        :id="playlist.id"
        :image-url="playlist.coverImgUrl | resizeImage(1024)"
        :show-play-button="true"
        :always-show-shadow="true"
        :click-cover-to-play="true"
        :fixed-size="288"
        type="playlist"
        :cover-hover="false"
        :play-button-size="18"
        @click.right.native="openMenu"
      />
      <!-- 第一栏目 第二部分 歌单信息 -->
      <div class="info">
        <!-- 歌单标题 -->
        <div class="title" @click.right="openMenu">
          <span v-if="playlist.privacy === 10" class="lock-icon">
            <svg-icon icon-class="lock" />
          </span>
          {{ playlist.name }}
        </div>
        <!-- 歌单创建者 -->
        <div class="artist">
          Playlist by
          <span
            v-if="
              [
                5277771961, 5277965913, 5277969451, 5277778542, 5278068783,
              ].includes(playlist.id)
            "
            style="font-weight: 600"
            >Apple Music
          </span>
          <a
            v-else
            :href="`https://music.163.com/#/user/home?id=${playlist.creator.userId}`"
            target="blank"
            >{{ playlist.creator.nickname }}</a
          >
        </div>
        <!-- 更新时间 歌曲数量 -->
        <div class="date-and-count">
          {{ $t('playlist.updateAt') }}
          {{ playlist.updateTime | formatDate }} · {{ playlist.trackCount }}
          {{ $t('common.songs') }}
        </div>
        <!-- 歌单描述 -->
        <div class="description" @click="toggleFullDescription">
          {{ playlist.description }}
        </div>
        <!-- 播放 收藏 操作按钮 -->
        <div class="buttons">
          <ButtonTwoTone icon-class="play" @click.native="playPlaylistByID()">
            {{ $t('common.play') }}
          </ButtonTwoTone>
          <ButtonTwoTone
            v-if="playlist.creator.userId !== data.user.userId"
            :icon-class="playlist.subscribed ? 'heart-solid' : 'heart'"
            :icon-button="true"
            :horizontal-padding="0"
            :color="playlist.subscribed ? 'blue' : 'grey'"
            :text-color="playlist.subscribed ? '#335eea' : ''"
            :backgroundColor="
              playlist.subscribed ? 'var(--color-secondary-bg)' : ''
            "
            @click.native="likePlaylist"
          >
          </ButtonTwoTone>
          <ButtonTwoTone
            icon-class="more"
            :icon-button="true"
            :horizontal-padding="0"
            color="gray"
            @click.native="openMenu"
          >
          </ButtonTwoTone>
        </div>
      </div>
      <!-- 歌单内搜索 -->
      <div v-if="displaySearchInPlaylist" class="search-box">
        <div class="container" :class="{ active: inputFocus }">
          <svg-icon icon-class="search" />
          <div class="input">
            <input
              v-model.trim="inputSearchKeyWords"
              v-focus
              :placeholder="inputFocus ? '' : $t('playlist.search')"
              @input="inputDebounce()"
              @focus="inputFocus = true"
              @blur="inputFocus = false"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- 特殊歌单 标题和副标题 -->
    <div v-if="specialPlaylistInfo !== undefined" class="special-playlist">
      <div
        class="title"
        :class="specialPlaylistInfo.gradient"
        @click.right="openMenu"
      >
        {{ specialPlaylistInfo.name }}
      </div>
      <div class="subtitle">
        {{ playlist.englishTitle }} · {{ playlist.updateFrequency }}
      </div>

      <div class="buttons">
        <ButtonTwoTone
          class="play-button"
          icon-class="play"
          color="grey"
          @click.native="playPlaylistByID()"
        >
          {{ $t('common.play') }}
        </ButtonTwoTone>
        <ButtonTwoTone
          v-if="playlist.creator.userId !== data.user.userId"
          :icon-class="playlist.subscribed ? 'heart-solid' : 'heart'"
          :icon-button="true"
          :horizontal-padding="0"
          :color="playlist.subscribed ? 'blue' : 'grey'"
          :text-color="playlist.subscribed ? '#335eea' : ''"
          :backgroundColor="
            playlist.subscribed ? 'var(--color-secondary-bg)' : ''
          "
          @click.native="likePlaylist"
        >
        </ButtonTwoTone>
        <ButtonTwoTone
          icon-class="more"
          :icon-button="true"
          :horizontal-padding="0"
          color="gray"
          @click.native="openMenu"
        >
        </ButtonTwoTone>
      </div>
    </div>

    
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import NProgress from 'nprogress';
import {
  getPlaylistDetail,
  subscribePlaylist,
  deletePlaylist,
} from '@/api/playlist';

import { getTrackDetail } from '@/api/track';
import { isAccountLoggedIn } from '@/utils/auth';
import nativeAlert from '@/utils/nativeAlert';
import locale from '@/locale';

import ButtonTwoTone from '@/components/ButtonTwoTone.vue';
import ContextMenu from '@/components/ContextMenu.vue';
import TrackList from '@/components/TrackList.vue';
import Cover from '@/components/Cover.vue';
import Modal from '@/components/Modal.vue';
import SvgIcon from '@/components/SvgIcon.vue';

const specialPlaylist = {
  2829816518: {
    name: '欧美私人订制',
    gradient: 'gradient-pink-purple-blue',
  },
  2890490211: {
    name: '助眠鸟鸣声',
    gradient: 'gradient-green',
  },
  5089855855: {
    name: '夜的胡思乱想',
    gradient: 'gradient-moonstone-blue',
  },
  2888212971: {
    name: '全球百大DJ',
    gradient: 'gradient-orange-red',
  },
  2829733864: {
    name: '睡眠伴侣',
    gradient: 'gradient-midnight-blue',
  },
  2829844572: {
    name: '洗澡时听的歌',
    gradient: 'gradient-yellow',
  },
  2920647537: {
    name: '还是会想你',
    gradient: 'gradient-dark-blue-midnight-blue',
  },
  2890501416: {
    name: '助眠白噪声',
    gradient: 'gradient-sky-blue',
  },
  5217150082: {
    name: '摇滚唱片行',
    gradient: 'gradient-yellow-red',
  },
  2829961453: {
    name: '古风音乐大赏',
    gradient: 'gradient-fog',
  },
  4923261701: {
    name: 'Trance',
    gradient: 'gradient-light-red-light-blue ',
  },
  5212729721: {
    name: '欧美点唱机',
    gradient: 'gradient-indigo-pink-yellow',
  },
  3103434282: {
    name: '甜蜜少女心',
    gradient: 'gradient-pink',
  },
  2829896389: {
    name: '日系私人订制',
    gradient: 'gradient-yellow-pink',
  },
  2829779628: {
    name: '运动随身听',
    gradient: 'gradient-orange-red',
  },
  2860654884: {
    name: '独立女声精选',
    gradient: 'gradient-sharp-blue',
  },
  898150: {
    name: '浪漫婚礼专用',
    gradient: 'gradient-pink',
  },
  2638104052: {
    name: '牛奶泡泡浴',
    gradient: 'gradient-fog',
  },
  5317236517: {
    name: '后朋克精选',
    gradient: 'gradient-pink-purple-blue',
  },
  2821115454: {
    name: '一周原创发现',
    gradient: 'gradient-blue-purple',
  },
  3136952023: {
    name: '私人雷达',
    gradient: 'gradient-radar',
  },
};

export default {
  name: 'Playlist',
  components: {
    ButtonTwoTone,
    ContextMenu,
    TrackList,
    Cover,
    Modal,
    SvgIcon,
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.focus();
      },
    },
  },
  data() {
    return {
      show: false,
      playlist: {
        id: 0,
        coverImgUrl: '',
        creator: {
          userId: '',
        },
        trackIds: [],
      },
      showFullDescription: false, //加载歌单描述
      tracks: [],
      loadingMore: false, //加载歌单中更多歌曲
      hasMore: false,
      lastLoadedTrackIndex: 9, //加载歌单歌曲数量
      displaySearchInPlaylist: false, // 是否显示搜索框
      searchKeyWords: '', // 搜索使用的关键字
      inputSearchKeyWords: '', // 搜索框中正在输入的关键字
      inputFocus: false,
      debounceTimeout: null,
      searchInputWidth: '0px', // 搜索框宽度
    };
  },
  computed: {
    ...mapState(['player', 'data']),
    isLikeSongsPage() {
      return this.$route.name === 'likedSongs';
    },
    specialPlaylistInfo() {
      return specialPlaylist[this.playlist.id];
    },
  },
  created() {
    if (this.$route.name === 'likedSongs') {
      this.loadData(this.data.likedSongPlaylistID);
    } else {
      this.loadData(this.$route.params.id);
    }
    setTimeout(() => {
      if (!this.show) NProgress.start();
    }, 1000);
  },
  methods: {
    ...mapMutations(['appendTrackToPlayerList']),
    ...mapActions(['playFirstTrackOnList', 'playTrackOnListByID', 'showToast']),
    playPlaylistByID(trackID = 'first') {
      let trackIDs = this.playlist.trackIds.map(t => t.id);
      this.$store.state.player.replacePlaylist(
        trackIDs,
        this.playlist.id,
        'playlist',
        trackID
      );
    },
    likePlaylist(toast = false) {
      if (!isAccountLoggedIn()) {
        this.showToast(locale.t('toast.needToLogin'));
        return;
      }
      subscribePlaylist({
        id: this.playlist.id,
        t: this.playlist.subscribed ? 2 : 1,
      }).then(data => {
        if (data.code === 200) {
          this.playlist.subscribed = !this.playlist.subscribed;
          if (toast === true) {
            this.showToast(
              this.playlist.subscribed ? '已保存到音乐库' : '已从音乐库删除'
            );
          }
        }
        getPlaylistDetail(this.id, true).then(data => {
          this.playlist = data.playlist;
        });
      });
    },
    loadData(id, next = undefined) {
      this.id = id;
      getPlaylistDetail(this.id, true)
        .then(data => {
          this.playlist = data.playlist;
          this.tracks = data.playlist.tracks;
          NProgress.done();
          if (next !== undefined) next();
          this.show = true;
          this.lastLoadedTrackIndex = data.playlist.tracks.length - 1;
          return data;
        })
        .then(() => {
          if (this.playlist.trackCount > this.tracks.length) {
            this.loadingMore = true;
            this.loadMore();
          }
        });
    },
    loadMore(loadNum = 100) {
      let trackIDs = this.playlist.trackIds.filter((t, index) => {
        if (
          index > this.lastLoadedTrackIndex &&
          index <= this.lastLoadedTrackIndex + loadNum
        ) {
          return t;
        }
      });
      trackIDs = trackIDs.map(t => t.id);
      getTrackDetail(trackIDs.join(',')).then(data => {
        this.tracks.push(...data.songs);
        this.lastLoadedTrackIndex += trackIDs.length;
        this.loadingMore = false;
        if (this.lastLoadedTrackIndex + 1 === this.playlist.trackIDs.length) {
          this.hasMore = false;
        } else {
          this.hasMore = true;
        }
      });
    },
    openMenu(e) {
      this.$refs.playlistMenu.openMenu(e);
    },
    inputDebounce() {
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        this.searchKeyWords = this.inputSearchKeyWords;
      }, 600);
    },
    toggleFullDescription() {
      this.showFullDescription = !this.showFullDescription;
      if (this.showFullDescription) {
        this.$store.commit('enableScrolling', false);
      } else {
        this.$store.commit('enableScrolling', true);
      }
    },
  },
};
</script>
