<template>
    <div>
        <transition name="fade">
            <div
                v-show="show"
                id="scrollbar"
                :class="{'on-drag': isOnDrag}"
                @click="handleClick"
            >
                <div
                    id="thumbContainer"
                    :class="{active}"
                    :style="thumbStyle"
                    @mouseenter="handleMouseenter"
                    @mouseleave="handleMouseleave"
                    @mousedown="handleMouseDragStart"
                    @click.stop
                >
                <div></div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'Scrollbar',
    data() {
        return {
            active: false,
            isOnDrag: false,
            show: false,

            top: 0,
            thumbHeight: 0,
            hideTimer: null,
            onDragClientY: 0,
            positions: {
                home: {scrollTop: 0, params: {} }
            }
        }
    },
    computed: {
        thumbStyle() {
            return {
                transfrom: `translateY(${this.top}px)`,
                height: `${this.thumbHeight}px`
            };
        },
        main() {
            return this.$parent.$refs.main;
        }
    },
    created() {
        this.$router.beforeEach((to,from,next) => {
            this.show = false;
            next();
        })
    },
    methods: {
        handleScroll() {
            const clintHeight = this.main.clientHeight - 128;
            const scrollHeight = this.main.scrollHeight - 128;
            const scrollTop = this.main.scrollTop;

            let top = ~~((scrollTop/scrollHeight)*clintHeight);
            let thumbHeight = ~~((clintHeight/scrollHeight)*clintHeight);

            if (thumbHeight < 24) thumbHeight = 24;
            if (top > clintHeight - thumbHeight) {
                top = clintHeight - thumbHeight;
            }
            this.top = top;
            this.thumbHeight = thumbHeight;
        }
    }
}
</script>

<style lang="scss" scoped>

</style>