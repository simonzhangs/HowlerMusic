<template>
    <Modal
        class="add-track-to-playlist-modal"
        :show="show"
        :close="close"
        :show-footer="false"
        title="添加到歌单"
        width="25vw"
    >
        <template slot="default">
            <div class="new-playlst-button" @click="newPlaylist">
                <svg-icon icon-class="plus" />新建歌单
            </div>
            
        </template>

    </Modal>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import Modal from '@/components/Modal.vue';
import locale from '@/locale';
import SvgIcon from './SvgIcon.vue';

export default {
    name: 'ModalAddTrackToPlaylist',
    components: {
        Modal,
        SvgIcon,
    },
}
</script>