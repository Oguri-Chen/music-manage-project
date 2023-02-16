<template>
  <el-dialog :model-value="dialogVisible" :title="dialogTitle" width="30%" @close="handleClose">
    <el-form :model="form" label-width="70px" ref="formRef" :rules="rules">
      <el-form-item label="名称" prop="mvName">
        <el-input v-model="form.mvName" />
      </el-form-item>
      <el-form-item label="mv" prop="mvUrl">
        <el-upload class="avatar-uploader" action="" accept=".mp4,.wmv,.avi,.flv,.mov" drag
          :before-upload="beforeMvUpload" :http-request="mvUpload" :limit="1" :on-exceed="handleExceed">
          <el-icon size="20">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="封面" prop="mvCover">
        <el-upload class="avatar-uploader" drag action="" accept=".jpg,.png,.jpeg" :show-file-list="false"
          :before-upload="beforeAvatarUpload" :http-request="coverUpload" :limit="1" :on-exceed="handleExceed">
          <el-image v-if="form.mvCover" :src="form.mvCover" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="歌手" prop="singer">
        <el-select v-model="singer" filterable remote reserve-keyword :remote-method="initSingerList"
          :loading="loading">
          <el-option v-for="item in opt" :key="item._id" :value="item._id" :label="item.singerName">
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
import { addMV, changeMV } from '@/api/mv';
import { getSingerList } from '@/api/singer';
import { uploadFile, chunkUploadFile } from '@/api/upload';
import { createMD5 } from '@/utils/createChunk';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
const i18n = useI18n();
const emits = defineEmits(['update:modelValue', 'initMVList']);
const formRef = ref(null);
const form = ref({
  mvName: '',
  mvDesc: '',
  mvCover: '',
});
const fileName = ref('');
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

// const chunkSize = 5 * 1024 * 1024
// const createChunkList = (file, chunkSize) => {
//   const fileChunkList = []
//   let cur = 0
//   while (cur < file.size) {
//     fileChunkList.push(file.slice(cur, cur + chunkSize))
//     cur += chunkSize
//   }
//   return fileChunkList
// }

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
      props.dialogTitle === '添加mv'
        ? await addMV(form.value)
        : await changeMV(form.value);
      ElMessage({
        message: i18n.t('message.updeteSuccess'),
        type: 'success',
      });
      emits('initMVList');
      handleClose();
    } else {
      console.log('error submit!!');
      return false;
    }
  });
};
const coverUpload = async (data) => {
  const param = new FormData();
  param.append('file', data.file);
  const res = await uploadFile(param);
  form.value.mvCover = 'https://musicapi.gal-souls.tk' + res.data;
};

// const chunkFormData = ref([])
// const fileHash = ref(null)
const mvUpload = async (data) => {
  const param = new FormData();
  param.append('file', data.file);
  const res = await uploadFile(param);
  form.value.mvUrl = '/api/' + res.data;
  fileName.value = data.file.name;
  // const fileChunkList = createChunkList(data.file, chunkSize)
  // fileHash.value = await createMD5(fileChunkList, chunkSize)
  // const chunkList = fileChunkList.map((file, index) => {
  //   return {
  //     file: file,
  //     chunkHash: fileHash.value + '-' + index,
  //     fileHash: fileHash.value,
  //   }
  // })
  // chunkFormData.value = chunkList.map((chunk) => {
  //   const formData = new FormData()
  //   formData.append('chunk', chunk.file)
  //   formData.append('chunkHash', chunk.chunkHash)
  //   formData.append('fileHash', chunk.fileHash)
  //   return { formData }
  // })
  // Promise.all(
  //   chunkFormData.value.map((data) => {
  //     return new Promise((resolve, reject) => {
  //       chunkUploadFile(data.formData)
  //         .then((data) => {
  //           resolve(data)
  //         })
  //         .catch((err) => {
  //           reject(err)
  //         })
  //     })
  //   })
  // )
};
const beforeAvatarUpload = (file) => {
  if (file.size / 1024 / 1024 > 5) {
    ElMessage.error('Avatar picture size can not exceed 5MB!');
    return false;
  }
  return true;
};
const beforeMvUpload = (file) => {
  if (file.size / 1024 / 1024 > 70) {
    ElMessage.error('MV size can not exceed 70MB!');
    return false;
  }
  return true;
};

const rules = ref({
  mvName: [
    {
      required: true,
      message: 'Please select Activity zone',
      trigger: 'blur',
    },
  ],
  mvUrl: [
    {
      required: true,
      message: 'Please select Activity zone',
      trigger: 'blur',
    },
  ],
  mvCover: [
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
