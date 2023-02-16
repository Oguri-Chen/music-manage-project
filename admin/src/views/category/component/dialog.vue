<template>
  <el-dialog :model-value="dialogVisible" :title="dialogTitle" width="30%" @close="handleClose">
    <el-form :model="form" label-width="80px" ref="formRef" :rules="rules">
      <el-form-item label="分类名称" prop="categoryName">
        <el-input v-model="form.categoryName" />
      </el-form-item>
      <el-form-item label="分类简介" prop="categoryDesc">
        <el-input v-model="form.categoryDesc" />
      </el-form-item>
      <el-form-item label="分类类型" prop="categoryType">
        <el-select v-model="form.categoryType" :placeholder="form.categoryName">
          <el-option key="0" label="语种" :value=0 />
          <el-option key="1" label="风格" :value=1 />
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
import { changeCategory, addCategory } from '@/api/category';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
const i18n = useI18n();
const emits = defineEmits(['update:modelValue', 'initCategoryList']);
const formRef = ref(null);
const form = ref({
  categoryName: '',
  categoryDesc: '',
  categoryType: '',
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
      props.dialogTitle === '添加分类'
        ? await addCategory(form.value)
        : await changeCategory(form.value);
      ElMessage({
        message: i18n.t('message.updeteSuccess'),
        type: 'success',
      });
      emits('initCategoryList');
      handleClose();
    } else {
      console.log('error submit!!');
      return false;
    }
  });
};

const rules = ref({
  categoryName: [
    {
      required: true,
      message: 'Please select Activity zone',
      trigger: 'blur',
    },
  ],
  categoryDesc: [
    {
      required: true,
      message: 'Please select Activity zone',
      trigger: 'blur',
    },
  ],
});
</script>

<style lang="scss" scoped>

</style>
