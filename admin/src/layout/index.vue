<template>
  <el-container class="app-wrapper">
    <el-aside
      :width="asideWidth"
      class="sidebar-container"
      :class="{ hiddenSider: store.getSiderType }"
    >
      <Menu />
    </el-aside>
    <el-container
      class="container"
      :class="{ hidderContainer: !store.getSiderType }"
    >
      <el-header>
        <Headers />
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import Menu from './Menu/index.vue';
import Headers from './headers/index.vue';
import { computed } from 'vue';
import variables from '@/styles/variables.module.scss';
import { userStore } from '@/store';
const store = userStore();
const asideWidth = computed(() => {
  return store.getSiderType
    ? variables.sideBarWidth
    : variables.hideSideBarWidth;
});
</script>

<style lang="scss" scoped>
.app-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.container {
  width: calc(100% - $sideBarWidth);
  height: 100%;

  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  transition: all 0.28s;

  &.hidderContainer {
    width: calc(100% - $hideSideBarWidth);
  }
}

:v-deep(.el-header) {
  padding: 0;
}
</style>
