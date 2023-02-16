import axios from '@/utils/axios';

export const getUserList = (params) => {
  return axios.get('/user/getall', { params });
};
export const changeUserInfoAdmin = (params) => {
  return axios.patch('/user/aupdate', params);
};
export const changepwd = (params) => {
  return axios.patch('/user/changepwd', params);
};
export const addUser = (params) => {
  return axios.post('/user/register', params);
};
export const deleteUser = (params) => {
  return axios.post('/user/del', { params });
};
