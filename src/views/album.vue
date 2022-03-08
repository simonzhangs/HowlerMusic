<template>
  <div v-show="show" class="album-page">
    <div class="playlist-info">
      <Cover
        :id="album.id"
        :image-url="album.picUrl | resizeImage(1024)"
        :show-play-button="true"
        :always-show-shadow="true"
        :click-cover-to-play="true"
        :fixed-size="288"
        type="album"
        :cover-hover="false"
        :play-button-size="18"
        @click.right.native="openMenu"
      />

      <div class="info">
        <div class="title" @click.right="openMenu">{{ title }}</div>
        <div v-if="subtitle !== ''" class="subtitle" @click.right="openMenu">
          {{ subtitle }}
        </div>
        <div class="artist">
          <span v-if="album.artist.id !== 104700">
            <span>{{ album.type | formatAlbumType(album) }} by </span>
            <router-link :to="`/artist/${album.artist.id}`">{{
              album.artist.name
            }}</router-link>
          </span>
          <span v-else>Compilation by Various Artists</span>
        </div>
        <div class="date-and-count">
          <span v-if="album.mark === 1056768" class="explicit-symbol"
            ><ExplicitSymbol
          /></span>
          <span :title="album.publishTime | formatDate">{{
            new Date(album.publishTime).getFullYear()
          }}</span>
          <span> · {{ album.size }} {{ $t('common.songs') }}</span>
          , {{ albumTime | formatTime('Human') }}
        </div>
        <div class="description" @click="toggleFullDescription">
          {{ album.description }}
        </div>
        <div class="buttons" style="margin-top: 32px">
          <ButtonTwoTone
            icon-class="play"
            @click.native="playAlbumByID(album.id)"
          >
            {{ $t('common.play') }}
          </ButtonTwoTone>
          <ButtonTwoTone
            :icon-class="dynamicDetail.isSub ? 'heart-solid' : 'heart'"
            :icon-button="true"
            :horizontal-padding="0"
            :color="dynamicDetail.isSub ? 'blue' : 'grey'"
            :text-color="dynamicDetail.isSub ? '#335eea' : ''"
            :background-color="
              dynamicDetail.isSub ? 'var(--color-secondary-bg)' : ''
            "
            @click.native="likeAlbum"
          >
          </ButtonTwoTone>
          <ButtonTwoTone
            icon-class="more"
            :icon-button="true"
            :horizontal-padding="0"
            color="grey"
            @click.native="openMenu"
          >
          </ButtonTwoTone>
        </div>
      </div>
    </div>

    <!-- 专辑播放列表 -->
    <div v-if="Object.keys(tracksByDisc).length !== 1">
      <div v-for="(disc, cd) in tracksByDisc" :key="cd">
        <h2 class="disc">Disc {{ cd }}</h2>
        <TrackList
          :id="album.id"
          :tracks="disc"
          :type="'album'"
          :album-object="album"
        />
      </div>
    </div>
    <div v-else>
      <TrackList
        :id="album.id"
        :tracks="tracks"
        :type="'album'"
        :album-object="album"
      />
    </div>

    <div class="extra-info">
      <div class="album-time"></div>
      <div class="release-date">
        {{ $t('album.released') }}
        {{ album.publishTime | formatDate('MMMM D, YYYY') }}
      </div>
      <div v-if="album.company !== null" class="copyright">
        © {{ album.company }}
      </div>
    </div>
    
  </div>
</template>

<script>
import { albumDynamicDetail, getAlbum, likeAAlbum } from '@/api/album';
import { splitSoundtrackAlbumTitle, splitAlbumTitle } from '@/utils/common';
import { getArtistAlbum } from '@/api/artist';
import { getTrackDetail } from '@/api/track';
import Cover from '@/components/Cover.vue';

import NProgress from 'nprogress';
import locale from '@/locale';
import ExplicitSymbol from '@/components/ExplicitSymbol.vue';
import { mapState } from 'vuex';
import ButtonTwoTone from '@/components/ButtonTwoTone.vue';
import { isAccountLoggedIn } from '@/utils/auth';
import { groupBy } from 'lodash';
import TrackList from '@/components/TrackList.vue';

export default {
  name: 'Album',
  components: { Cover, ExplicitSymbol, ButtonTwoTone, TrackList },
  beforeRouteUpdate(to, from, next) {
    this.show = false;
    this.loadData(to.params.id);
    next();
  },
  data() {
    return {
      show: false,
      album: {
        id: 0,
        picUrl: '',
        artist: {
          id: 0,
        },
      },
      tracks: [],
      showFullDescription: false,
      moreAlbums: [],
      dynamicDetail: {},
      subtitle: '',
      title: '',
    };
  },
  computed: {
    ...mapState(['player', 'data']),
    albumTime() {
      let time = 0;
      this.tracks.map(t => (time = time + t.dt));
      return time;
    },
    tracksByDisc() {
      return groupBy(this.tracks, 'cd');
    },
  },
  created() {
    this.loadData(this.$route.params.id);
  },
  methods: {
    formatTitle() {
      let splitTitle = splitSoundtrackAlbumTitle(this.album.name);
      let splitTitle2 = splitAlbumTitle(splitTitle.title);
      this.title = splitTitle2.title;
      if (splitTitle.subtitle !== '' && splitTitle2.subtitle !== '') {
        this.subtitle = splitTitle.subtitle + ' · ' + splitTitle2.subtitle;
      } else {
        this.subtitle =
          splitTitle.subtitle === ''
            ? splitTitle2.subtitle
            : splitTitle.subtitle;
      }
    },
    loadData(id) {
      setTimeout(() => {
        if (!this.show) NProgress.start();
      }, 1000);
      getAlbum(id).then(data => {
        this.album = data.album;
        this.tracks = data.songs;
        this.formatTitle();
        NProgress.done();
        this.show = true;

        let trackIDs = this.tracks.map(t => t.id);
        getTrackDetail(trackIDs.join(',')).then(data => {
          this.tracks = data.songs;
        });

        getArtistAlbum({ id: this.album.artist.id, limit: 100 }).then(data => {
          this.moreAlbums = data.hotAlbums;
        });
      });
      albumDynamicDetail(id).then(data => {
        this.dynamicDetail = data;
      });
    },
    toggleFullDescription() {
      this.showFullDescription = !this.showFullDescription;
      if (this.showFullDescription) {
        this.$store.commit('enableScrolling', false);
      } else {
        this.$store.commit('enableScrolling', true);
      }
    },
    oepnMenu(e) {
      this.$refs.albumMenu.openMenu(e);
    },
    likeAlbum(toast = false) {
      if (!isAccountLoggedIn()) {
        this.showToast(locale.t('toast.needToLogin'));
        return;
      }
      likeAAlbum({
        id: this.album.id,
        t: this.dynamicDetail.isSub ? 0 : 1,
      })
        .then(data => {
          if (data.code === 200) {
            this.dynamicDetail.isSub = !this.dynamicDetail.isSub;
            if (toast === true) {
              this.showToast(
                this.dynamicDetail.isSub ? '已保存到音乐库' : '已从音乐库删除'
              );
            }
          }
        })
        .catch(error => {
          this.showToast(`${error.response.data.message || error}`);
        });
    },
  },
};
</script>
