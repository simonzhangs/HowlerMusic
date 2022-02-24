<template>
  <div v-show="show" class="home">
    <!-- 首页 第一栏目 是否显示 apple music 歌单 -->
    <div
      v-if="settings.showPlaylistsByAppleMusic !== false"
      class="index-row first-row"
    >
      <div class="title">by Apple Music</div>
      <CoverRow
        :type="'playlist'"
        :items="byAppleMusic"
        subtext="appleMusic"
        :image-size="1024"
      />
    </div>
    <!-- 首页 第二栏目 推荐歌单 -->
    <div class="index-row">
        <div class="title">
            {{ $t('home.recommedPlaylist') }}
            <router-link to="/explore?category=推荐歌单">
                {{ $t('home.seeMore') }}
            </router-link>
        </div>
        <CoverRow
            :type="'playlist'"
            :items="recommendPlaylist.items"
            subtext="copywriter"
        />
    </div>
    <!-- 首页 第三个栏目 for you -->
    <div class="index-row">
        <div class="title">For You</div>
        <div class="for-you-row">
            <DailyTracksCard ref="DailyTracksCard"/>
            <FMCard />
        </div>
    </div>
  </div>
</template>

<script>
import { byAppleMusic } from "@/utils/staticData";
import { mapState } from "vuex";

import CoverRow from "@/components/CoverRow.vue";
import DailyTracksCard from "@/components/DailyTracksCard.vue";
import FMCard from "@/components/FMCard.vue";

export default {
  name: "Home",
  components: {
    CoverRow,
    DailyTracksCard,
    FMCard,
  },
  data() {
    return {
      show: false,
    };
  },
  computed: {
    ...mapState(["settings"]),
    byAppleMusic() {
      return byAppleMusic;
    },
  },
};
</script>

<style lang="scss" scoped>
.index-row {
  margin-top: 54px;
}
.index-row.first-row {
  margin-top: 32px;
}
</style>
