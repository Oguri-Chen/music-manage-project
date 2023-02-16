<template>
  <el-dialog :model-value="dialogVisible" :title="dialogTitle" width="30%" @close="handleClose">
    <el-form :model="form" label-width="80px" ref="formRef" :rules="rules">
      <el-form-item label="专辑名" prop="albumName">
        <el-input v-model="form.albumName" />
      </el-form-item>
      <el-form-item label="简介" prop="albumDesc">
        <el-input v-model="form.albumDesc" />
      </el-form-item>
      <el-form-item label="歌手" prop="singer">
        <el-select v-model="singer" :placeholder="form.singer.singerName" filterable remote reserve-keyword
          :remote-method="initSingerList" :loading="loading">
          <el-option v-for="item in opt" :key="item._id" :value="item._id" :label="item.singerName">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="头像" prop="albumCover">
        <el-upload class="avatar-uploader" drag action="" accept=".jpg,.png,.jpeg" :show-file-list="false"
          :before-upload="beforeAvatarUpload" :http-request="codeUpload">
          <el-image v-if="form.albumCover" :src="form.albumCover" class="avatar" />
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
import { addAlbum, changeAlbum } from '@/api/album';
import { getSingerList } from '@/api/singer';
import { uploadFile } from '@/api/upload';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
const i18n = useI18n();
const emits = defineEmits(['update:modelValue', 'initAlbumList']);
const formRef = ref(null);
const form = ref({
  albumName: '',
  albumDesc: '',
  albumCover: '',
  singer: {},
});
const loading = ref(false);
const opt = ref([]);
const singer = ref('');
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

const initSingerList = async (keyword) => {
  loading.value = true;
  const res = await getSingerList({ keyword });
  loading.value = false;
  opt.value = res.data.singerList;
  form.value.singer = singer.value;
};

const handleClose = () => {
  emits('update:modelValue', false);
};

const handleConfirm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      props.dialogTitle === '添加专辑'
        ? await addAlbum(form.value)
        : await changeAlbum(form.value);
      ElMessage({
        message: i18n.t('message.updeteSuccess'),
        type: 'success',
      });
      emits('initAlbumList');
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
  form.value.albumCover = 'https://musicapi.gal-souls.tk' + res.data;
};
const beforeAvatarUpload = (file) => {
  if (file.size / 1024 / 1024 > 5) {
    ElMessage.error('Avatar picture size can not exceed 5MB!');
    return false;
  }
  return true;
};

const rules = ref({
  albumName: [
    {
      required: true,
      message: 'Please select Activity zone',
      trigger: 'blur',
    },
  ],
  albumDesc: [
    {
      required: true,
      message: 'Please select Activity zone',
      trigger: 'blur',
    },
  ],
  albumCover: [
    {
      required: false,
      message: 'Please select Activity zone',
      trigger: 'blur',
    },
  ],
});
</script>

<style lang="scss" scoped>
:deep(.el-upload-dragger) {
  padding: 20px 10px;
}

.avatar-uploader {
  width: 100%;
}
</style>
