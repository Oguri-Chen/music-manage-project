import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import router from './router';
import '@/router/permission';
import '@/styles/index.scss';
import 'element-plus/dist/index.css';

import mLibs from './libs';
import 'virtual:svg-icons-register';

import i18n from '@/i18n';

const pinia = createPinia();

createApp(App).use(pinia).use(router).use(mLibs).use(i18n).mount('#app');
