<template>
  <el-dialog :model-value="dialogVisible" :title="dialogTitle" width="30%" @close="handleClose">
    <el-form :model="form" label-width="70px" ref="formRef" :rules="rules">
      <el-form-item label="歌手名" prop="singerName">
        <el-input v-model="form.singerName" />
      </el-form-item>
      <el-form-item label="简介" prop="singerDesc">
        <el-input v-model="form.singerDesc" />
      </el-form-item>
      <el-form-item label="头像" prop="singerCover">
        <el-upload class="avatar-uploader" drag action="" accept=".jpg,.png,.jpeg" :show-file-list="false"
          :before-upload="beforeAvatarUpload" :http-request="codeUpload">
          <el-image v-if="form.singerCover" :src="form.singerCover" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { defineEmits, ref, defineProps, watch } from 'vue';
import { addSinger, changeSinger } from '@/api/singer';
import { uploadFile } from '@/api/upload';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
const i18n = useI18n();
const emits = defineEmits(['update:modelValue', 'initSingerList']);
const formRef = ref(null);
const form = ref({
  singerName: '',
  singerDesc: '',
  singerCover: '',
});
const props = defineProps({
  dialogTitle: {
    type: String,
    default: '',
    required: true,
  },
  dialogTableVal: {
    type: Object,
    default: function () {
      return {};
    },
  },
});

watch(
  () => props.dialogTableVal,
  () => {
    form.value = props.dialogTableVal;
  },
  { deep: true, immediate: true }
);

const handleClose = () => {
  emits('update:modelValue', false);
};

const handleConfirm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      props.dialogTitle === '添加歌手'
        ? await addSinger(form.value)
        : await changeSinger(form.value);
      ElMessage({
        message: i18n.t('message.updeteSuccess'),
        type: 'success',
      });
      emits('initSingerList');
      handleClose();
    } else {
      console.log('error submit!!');
      return false;
    }
  });
};
const codeUpload = async (file) => {
  const param = new FormData();
  param.append('file', file.file);
  const res = await uploadFile(param);
  form.value.singerCover = 'https://musicapi.gal-souls.tk' + res.data;
};
const beforeAvatarUpload = (file) => {
  if (file.size / 1024 / 1024 > 5) {
    ElMessage.error('Avatar picture size can not exceed 5MB!');
    return false;
  }
  return true;
};

const rules = ref({
  singerName: [
    {
      required: true,
      message: 'Please select Activity zone',
      trigger: 'blur',
    },
  ],
  singerDesc: [
    {
      required: true,
      message: 'Please select Activity zone',
      trigger: 'blur',
    },
  ],
  singerCover: [
    {
      required: false,
      message: 'Please select Activity zone',
      trigger: 'blur',
    },
  ],
});
</script>

<style lang="scss" scoped>
.avatar-uploader {
  width: 100%;
}
</style>
