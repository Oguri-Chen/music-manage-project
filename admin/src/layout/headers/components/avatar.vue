<template>
  <el-dropdown>
    <span class="el-dropdown-link">
      <el-avatar shape="square" :size="40" :src="store.user.avatar"></el-avatar>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { userStore } from '@/store';
const store = userStore();

const logout = () => {
  store.logout();
};
</script>

<style lang="scss" scoped>
:v-deep(.el-dropdown-menu__item) {
  white-space: nowrap;
}
</style>
