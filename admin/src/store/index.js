import { defineStore } from 'pinia';
import router from '@/router';
import { login } from '@/api/manager';

export const userStore = defineStore('user', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    menuData: [],
    siderType: true,
    lang: localStorage.getItem('lang') || 'zh',
  }),
  getters: {
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    getMenuData: (state) => state.menuData,
    getSiderType: (state) => state.siderType,
    getLang: (state) => state.lang,
  },
  actions: {
    async loginStore(user) {
      try {
        const res = await login(user);
        res.data.user.password = user.password;
        this.token = res.data.token;
        this.user = res.data.user;
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        router.push('/');
      } catch (error) {
        throw error;
      }
    },
    logout() {
      this.token = '';
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
    },
    setMenu(data) {
      this.menuData = data;
    },
    changeSiderType() {
      this.siderType = !this.siderType;
    },
    changeLang(lang) {
      this.lang = lang;
    },
  },
});
