<template>
    <div class="daily-recommend-card" @click="goToDailyTracks">
        <img :src="coverUrl" />
        <div class="container">
            <div class="title-box">
                <div class="title">
                    <span>每</span>
                    <span>日</span>
                    <span>推</span>
                    <span>荐</span>
                </div>
            </div>
        </div>
        <button class="play-button" @click.stop="playDailyTracks">
           <svg-icon icon-class="play" /> 
        </button>
    </div>
</template>

<script>
import locale from '@/locale'
import { mapMutations, mapState, mapActions } from 'vuex';
import { dailyRecommendTracks } from '@/api/playlist';
import { isAccountLoggedIn } from '@/utils/auth';
import sample from 'lodash/sample';

const default {
    name: 'DailyTracksCard',
    data() {
        
    }
}
</script>