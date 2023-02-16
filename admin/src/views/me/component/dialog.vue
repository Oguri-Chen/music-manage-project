<template>
  <el-dialog :model-value="dialogVisible" title="修改信息" width="30%" @close="handleClose">
    <el-form :model="form" label-width="80px" ref="formRef" :rules="rules">
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="form.userName" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" show-password />
      </el-form-item>
      <el-form-item label="简介" prop="desc">
        <el-input v-model="form.desc" type="textarea" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="vip" prop="vipExpiration">
        <el-date-picker v-model="form.vipExpiration" type="date" placeholder="选择日期" format="YYYY/MM/DD" value-format="x"
          :disabled-date="disabledDate" />
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-upload class="avatar-uploader" drag action="" accept=".jpg,.png,.jpeg" :show-file-list="false"
          :before-upload="beforeAvatarUpload" :http-request="codeUpload">
          <el-image v-if="form.avatar" :src="form.avatar" class="avatar" />
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
import { defineEmits, ref } from 'vue';
import { changeUserInfoAdmin, changepwd } from '@/api/user';
import { uploadFile } from '@/api/upload';
import { ElMessage } from 'element-plus';
import { userStore } from '@/store';
import { useI18n } from 'vue-i18n';
const i18n = useI18n();
const emits = defineEmits(['update:modelValue']);
const store = userStore();
const formRef = ref(null);
const form = store.user;
const disabledDate = (time) => {
  return time.getTime() < Date.now() - 8.64e7
};

const handleClose = () => {
  emits('update:modelValue', false);
};

const handleConfirm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      await changepwd({ password: form.password });
      await changeUserInfoAdmin(form);
      localStorage.setItem('user', JSON.stringify(form));
      ElMessage({
        message: i18n.t('message.updeteSuccess'),
        type: 'success',
      });
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
  form.value.avatar = 'https://musicapi.gal-souls.tk' + res.data;
};
const beforeAvatarUpload = (file) => {
  if (file.size / 1024 / 1024 > 5) {
    ElMessage.error('Avatar picture size can not exceed 5MB!');
    return false;
  }
  return true;
};

const rules = ref({
  userName: [
    {
      required: true,
      message: 'Please select Activity zone',
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: 'Please select Activity zone',
      trigger: 'blur',
    },
  ],
  email: [
    {
      required: true,
      message: 'Please select Activity zone',
      trigger: 'blur',
    },
    {
      type: 'email',
      message: '请输入正确的邮箱地址',
      trigger: ['blur', 'change'],
    },
  ],
});
</script>

<style lang="scss" scoped>
.avatar-uploader {
  width: 100%;
}
</style>
