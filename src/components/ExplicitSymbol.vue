<template>
  <!-- 图标E 子组件 -->
  <!-- 用于 CoverRow、TrackListItem 组件中 -->
  <svg-icon icon-class="explicit" :style="svgStyle"></svg-icon>
</template>

<script>
import SvgIcon from "@/components/SvgIcon.vue";

export default {
  name: "ExplicitSymbol",
  components: {
    SvgIcon,
  },
  props: {
    size: { type: Number, default: 16 },
  },
  data() {
    return {
      svgStyle: {},
    };
  },
  created() {
    this.svgStyle = {
      height: this.size + "px",
      width: this.size + "px",
    };
  },
};
</script>

<style lang="scss" scoped></style>
