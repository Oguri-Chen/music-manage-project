<template>
    <el-dialog :model-value="dialogVisible" :title="dialogTitle" width="30%" @close="handleClose">
        <el-form :model="form" label-width="70px" ref="formRef" :rules="rules">
            <el-form-item label="用户" prop="userName">
                <el-select v-model="user" :placeholder="form.user?.userName" filterable remote reserve-keyword
                    :remote-method="initUserList" :loading="loading">
                    <el-option v-for="item in opt" :key="item._id" :value="item._id" :label="item.userName">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="内容" prop="messageContent">
                <el-input v-model="form.messageContent" />
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
import { addMessage, changeMessage } from '@/api/message';
import { getUserList } from '@/api/user';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
const i18n = useI18n();
const emits = defineEmits(['update:modelValue', 'initMessageList']);
const formRef = ref(null);
const form = ref({
    messageType: 1,
    messageContent: '',
    user: {},
});
const loading = ref(false);
const opt = ref([]);
const user = ref('');
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

const initUserList = async (keyword) => {
    loading.value = true;
    const res = await getUserList({ keyword });
    loading.value = false;
    opt.value = res.data.userList;
    form.value.user = user.value;
};

const handleClose = () => {
    emits('update:modelValue', false);
};

const handleConfirm = () => {
    formRef.value.validate(async (valid) => {
        if (valid) {
            props.dialogTitle === '添加评论'
                ? await addMessage(form.value)
                : await changeMessage(form.value);
            ElMessage({
                message: i18n.t('message.updeteSuccess'),
                type: 'success',
            });
            emits('initMessageList');
            handleClose();
        } else {
            console.log('error submit!!');
            return false;
        }
    });
};

const rules = ref({
    userName: [
        {
            required: false,
            message: 'Please select Activity zone',
            trigger: 'blur',
        },
    ],
    messageContent: [
        {
            required: true,
            message: 'Please select Activity zone',
            trigger: 'blur',
        },
    ],
});
if (props.dialogTitle === '添加评论') {
    rules.value.userName[0]['trigger', 'required'] = ['change', true]
}
</script>

<style lang="scss" scoped>

</style>
