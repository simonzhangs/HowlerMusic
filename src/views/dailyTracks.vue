<template>
  <div v-show="show">
    <div class="special-playlist">
      <div class="title gradient">每日歌曲推荐</div>
      <div class="subtitle">根据你的音乐口味生成 · 每天6:00更新</div>
    </div>
    <TrackList
      :tracks="dailyTracks"
      type="playlist"
      dbclickTrackFunc="dailyTracks"
    />
  </div>
</template>

<script>
import TrackList from '@/components/TrackList.vue';
import { dailyRecommendTracks } from '@/api/playlist';
import { mapState, mapMutations } from 'vuex';

import Nprogress from 'nprogress';

export default {
  name: 'DailyTracks',
  components: {
    TrackList,
  },
  data() {
    return {
      show: false,
    };
  },
  computed: {
    ...mapState(['player', 'data', 'dailyTracks']),
  },
  created() {
    if (this.dailyTracks.length === 0) {
      setTimeout(() => {
        if (!this.show) Nprogress.start();
      }, 1000);
      this.loadDailyTracks();
    } else {
      this.show = true;
    }
    this.$parent.$refs.main.scrollTo(0, 0);
  },
  methods: {
    ...mapMutations(['updateDailyTracks']),
    loadDailyTracks() {
      dailyRecommendTracks().then(res => {
        this.updateDailyTracks(res.data.dailySongs);
        this.show = true;
        Nprogress.done();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.special-playlist {
  margin-top: 50px;
  margin-bottom: 35px;
  border-radius: 1.25em;
  text-align: center;

  @keyframes letterSpacing4 {
    from {
      letter-spacing: 0px;
    }
    to {
      letter-spacing: 4px;
    }
  }
  @keyframes letterSpacing1 {
    from {
      letter-spacing: 0px;
    }
    to {
      letter-spacing: 1px;
    }
  }
  .title {
    font-size: 84px;
    line-height: 1.05;
    font-weight: 700;
    text-transform: uppercase;

    letter-spacing: 4px;
    animation-duration: 0.8s;
    animation-name: letterSpacing4;
    -webkit-text-fill-color: transparent;
    background-clip: text;

    img {
      height: 78px;
      border-radius: 0.125em;
      margin-right: 24px;
    }
    .subtitle {
      font-size: 18px;
      letter-spacing: 1px;
      margin: 28px 0 54px 0;
      animation-duration: 0.8s;
      animation-name: letterSpacing1;
      text-transform: uppercase;
      color: var(--color-text);
    }
    .buttons {
      margin-top: 32px;
      display: flex;
      justify-content: center;
      button {
        margin-right: 16px;
      }
    }
  }
}

.gradient {
  background: linear-gradient(to left, #dd2476, #ff512f);
}
</style>
