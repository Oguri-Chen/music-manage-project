<template>
  <el-menu
    active-text-color="#ffd04b"
    :background-color="variables.menuBg"
    class="el-menu-vertical-demo"
    :collapse="!store.getSiderType"
    :default-active="defaultActive"
    text-color="#fff"
    router
    unique-opened
  >
    <div v-for="item in menuList" :key="item._id">
      <el-sub-menu :index="item.menuPath" v-if="item.children">
        <template #title>
          <el-icon>
            <component :is="item.menuIcon" />
          </el-icon>
          <span>{{ $t(`menus.${item.menuName}`) }}</span>
        </template>
        <el-menu-item
          :index="sitem.menuPath"
          v-for="sitem in item.children"
          :key="sitem._id"
          @click="savePath(sitem.menuPath)"
        >
          {{ $t(`menus.${sitem.menuName}`) }}
        </el-menu-item>
      </el-sub-menu>
      <el-menu-item :index="item.menuPath" v-else>
        <el-icon>
          <component :is="item.menuIcon"></component>
        </el-icon>
        <template #title>
          <span>{{ $t(`menus.${item.menuName}`) }}</span>
        </template>
      </el-menu-item>
    </div>
  </el-menu>
</template>

<script setup>
import { ref } from 'vue';
import variables from '@/styles/variables.module.scss';

import { userStore } from '@/store';
const store = userStore();

const defaultActive = ref(sessionStorage.getItem('path') || '/home');
const menuList = ref(store.getMenuData);

const savePath = (path) => {
  sessionStorage.setItem('path', `/${path}`);
};
</script>

<style lang="scss" scoped></style>
