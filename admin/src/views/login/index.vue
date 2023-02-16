<template>
    <div class="login">
        <el-form ref="formRef" :model="form" class="login-form" :rules="rules">
            <div class="title-container">
                <h3 class="title">{{ $t('login.title') }}</h3>
            </div>
            <el-form-item prop="userName">
                <el-input v-model="form.userName">
                    <template #prefix>
                        <el-icon>
                            <User />
                        </el-icon>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input v-model="form.password" type="password" show-password>
                    <template #prefix>
                        <el-icon>
                            <lock />
                        </el-icon>
                    </template>
                </el-input>
            </el-form-item>
            <el-button type="primary" class="login-button" @click="handleLogin">{{
                $t('login.btnTitle')
            }}</el-button>
        </el-form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { userStore } from '@/store'
const store = userStore()
const form = ref({
    userName: 'xiaochen',
    password: '123456'
})
const rules = ref({
    userName: [
        {
            required: true,
            message: 'Please input Activity name',
            trigger: 'blur'
        }
    ],
    password: [
        {
            required: true,
            message: 'Please input Activity name',
            trigger: 'blur'
        }
    ]
})

const formRef = ref(null)
const handleLogin = () => {
    formRef.value.validate(async (valid) => {
        if (valid) {
            store.loginStore(form.value)
        } else {
            console.log('error submit!!')
            return false
        }
    })
}
</script>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    background-color: $bg;

    .login-form {
        width: 520px;
        max-width: 100%;
        padding: 0 35px 160px;
        overflow: hidden;

        :deep(.el-input__prefix) {
            color: $dark_gray;
        }

        :deep(.el-input__wrapper) {
            height: 47px;
            background: rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: none;

            input {
                background: transparent;
                padding: 12px 5px 12px 5px;
                color: $light_gray;
                height: 47px;
            }
        }

        .login-button {
            width: 100%;
        }
    }

    .title-container {
        position: relative;

        .title {
            font-size: 26px;
            color: $light_gray;
            margin: 0px auto 40px auto;
            text-align: center;
            font-weight: bold;
        }
    }
}
</style>
