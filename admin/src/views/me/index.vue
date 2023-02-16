<template>
  <el-card>
    <el-row :gutter="20">
      <el-col :sm="8">
        <el-image :src="store.user.avatar"></el-image>
      </el-col>
      <el-col :sm="16" class="info">
        <div>
          <span>用户名称</span>
          <span>{{ store.user.userName }}</span>
        </div>
        <div>
          <span>性别</span>
          <span>{{ store.user.sex ? '男' : '女' }}</span>
        </div>
        <div>
          <span>简介</span>
          <span>{{ store.user.desc }}</span>
        </div>
        <div>
          <span>邮箱</span>
          <span>{{ store.user.email }}</span>
        </div>
        <div>
          <span>级别</span>
          <span>{{ store.user.isVip ? 'vip用户' : '普通用户' }}</span>
        </div>
        <div>
          <span>管理级别</span>
          <span>{{ store.user.level == 1 ? '管理员' : '超级管理员' }}</span>
        </div>
        <div>
          <span>注册时间</span>
          <span>{{ moment(store.user.createdAt).format('YYYY-MM-DD') }}</span>
        </div>
        <div>
          <el-button type="primary" @click="handleDialogValue()">
            编辑
          </el-button>
        </div>
      </el-col>
    </el-row>
  </el-card>
  <Dialog v-model="dialogVisible" v-if="dialogVisible" />
</template>

<script setup>
import { ref } from 'vue';
import { userStore } from '@/store';
import moment from 'moment';
import Dialog from './component/dialog.vue';
const store = userStore();
const dialogVisible = ref(false);

const handleDialogValue = () => {
  dialogVisible.value = true;
};
</script>

<style lang="scss" scoped>
.info {
  div {
    margin-bottom: 1rem;

    span:nth-child(1) {
      display: inline-block;
      width: 5rem;
    }
  }
}
</style>
