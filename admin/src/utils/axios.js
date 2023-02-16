import axios from 'axios';
import { ElMessage } from 'element-plus';
import { userStore } from '@/store'

const service = axios.create({
  baseURL: 'https://musicapi.gal-souls.tk',
  timeout: 5000,
});

service.interceptors.request.use(
  (config) => {
    config.headers['Authorization'] = localStorage.getItem('token');
    return config;
  },
  (error) => {
    const store = userStore()
    store.logout()
    return Promise.reject(new Error(error));
  }
);

service.interceptors.response.use(
  (response) => {
    const { data, status } = response;
    if (status === 200 || status === 201) {
      return data;
    } else {
      ElMessage.error(data.msg);
      return Promise.reject(new Error(data.msg));
    }
  },
  (error) => {
    error.response && ElMessage.error(error.response.data);
    return Promise.reject(new Error(error.response.data));
  }
);
export default service;
