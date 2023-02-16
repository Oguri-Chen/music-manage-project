<template>
  <svg aria-hidden="true" class="svg-icon">
    <use :class="fillClass" :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  // 图标名称（剔除 icon- 之后的）
  name: {
    type: String,
    required: true,
  },
  // 图标颜色
  color: {
    type: String,
  },
  // 自定义图标类名
  fillClass: {
    type: String,
  },
});
// 真实显示的 svg 图标名（拼接 #icon-）
const symbolId = computed(() => `#icon-${props.name}`);
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  text-align: center;
}
</style>
