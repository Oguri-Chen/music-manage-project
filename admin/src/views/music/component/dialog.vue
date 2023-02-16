<template>
  <el-dialog :model-value="dialogVisible" :title="dialogTitle" width="30%" @close="handleClose">
    <el-form :model="form" label-width="70px" ref="formRef" :rules="rules">
      <el-form-item label="歌曲名" prop="musicName">
        <el-input v-model="form.musicName" />
      </el-form-item>
      <el-form-item label="音频" prop="musicUrl">
        <el-upload class="avatar-uploader" drag action="" accept=".mp3,.flac,.ape,.wma,.wav"
          :before-upload="beforeMusicUpload" :http-request="musicUpload">
          <el-icon size="30">
            <UploadFilled />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="封面" prop="musicCover">
        <el-upload class="avatar-uploader" drag action="" accept=".jpg,.png,.jpeg" :show-file-list="false"
          :before-upload="beforeAvatarUpload" :http-request="codeUpload">
          <el-image v-if="form.musicCover" :src="form.musicCover" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="歌手" prop="singers">
        <el-select v-model="singer" filterable remote reserve-keyword multiple :remote-method="initSingerList"
          :loading="loading">
          <el-option v-for="item in singerList" :key="item._id" :value="item._id" :label="item.singerName">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="专辑" prop="albums">
        <el-select v-model="album" filterable remote reserve-keyword :remote-method="initAlbumList" :loading="loading">
          <el-option v-for="item in albumList" :key="item._id" :value="item._id" :label="item.albumName">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分类" prop="categories">
        <el-select v-model="category" filterable remote reserve-keyword multiple :remote-method="initCategoryList"
          :loading="loading">
          <el-option v-for="item in categoryList" :key="item._id" :value="item._id" :label="item.categoryName">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="mv" prop="mvs">
        <el-select v-model="mv" filterable remote reserve-keyword :remote-method="initMVList" :loading="loading">
          <el-option v-for="item in mvList" :key="item._id" :value="item._id" :label="item.mvName">
          </el-option>
        </el-select>
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
import { addMusic, changeMusic } from '@/api/music';
import { getSingerList } from '@/api/singer';
import { getAlbumList } from '@/api/album';
import { getCategoryList } from '@/api/category';
import { getMVList } from '@/api/mv';
import { uploadFile } from '@/api/upload';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
const i18n = useI18n();
const emits = defineEmits(['update:modelValue', 'initMusicList']);
const formRef = ref(null);
const form = ref({
  musicName: '',
  musicUrl: '',
  musicCover: '',
});
const fileName = ref('');
const loading = ref(false);
const singerList = ref([]);
const singer = ref('');
const albumList = ref([]);
const album = ref('');
const categoryList = ref([]);
const category = ref('');
const mvList = ref([]);
const mv = ref([]);

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
  singerList.value = res.data.singerList;
  form.value.singers = singer.value;
};
const initAlbumList = async (keyword) => {
  loading.value = true;
  const res = await getAlbumList({ keyword });
  loading.value = false;
  albumList.value = res.data.albumList;
  form.value.albums = album.value;
};
const initCategoryList = async (keyword) => {
  loading.value = true;
  const res = await getCategoryList({ keyword });
  loading.value = false;
  categoryList.value = res.data.categoryList;
  form.value.categories = category.value;
};
const initMVList = async (keyword) => {
  loading.value = true;
  const res = await getMVList({ keyword });
  loading.value = false;
  mvList.value = res.data.mvList;
  form.value.mvs = mv.value;
};

const handleClose = () => {
  emits('update:modelValue', false);
};

const handleConfirm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      props.dialogTitle === '添加音乐'
        ? await addMusic(form.value)
        : await changeMusic(form.value);
      ElMessage({
        message: i18n.t('message.updeteSuccess'),
        type: 'success',
      });
      emits('initMusicList');
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
  form.value.musicCover = 'https://musicapi.gal-souls.tk' + res.data;
};
const musicUpload = async (file) => {
  const param = new FormData();
  param.append('file', file.file);
  const res = await uploadFile(param);
  form.value.musicUrl = 'https://musicapi.gal-souls.tk' + res.data;
  fileName.value = file.file.name;
};
const beforeAvatarUpload = (file) => {
  if (file.size / 1024 / 1024 > 5) {
    ElMessage.error('size can not exceed 5MB!');
    return false;
  }
  return true;
};
const beforeMusicUpload = (file) => {
  if (file.size / 1024 / 1024 > 100) {
    ElMessage.error('size can not exceed 100MB!');
    return false;
  }
  return true;
};

const rules = ref({
  musicName: [
    {
      required: true,
      message: 'Please select Activity zone',
      trigger: 'blur',
    },
  ],
  musicUrl: [
    {
      required: true,
      message: 'Please select Activity zone',
      trigger: 'blur',
    },
  ],
});
</script>

<style lang="scss" scoped>
:deep(.el-upload-dragger) {
  padding: 10px;
}

.avatar-uploader {
  width: 100%;
}
</style>
