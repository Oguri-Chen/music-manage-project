<template>
  <el-dialog :model-value="videoDialogVisible">
    <video :src="props.dialogUrl" controls></video>
  </el-dialog>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  dialogUrl: {
    type: String,
    default: '',
    required: true,
  },
});
</script>

<style lang="scss" scoped>
video {
  width: 100%;
  height: 100%;
  object-fit: fill;
}
</style>
