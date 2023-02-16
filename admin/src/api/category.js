import axios from '@/utils/axios';

export const getCategoryList = (params) => {
    return axios.get('/category/getall', { params });
};
export const changeCategory = (params) => {
    return axios.patch('/category/update', params);
};
export const addCategory = (params) => {
    return axios.post('/category/add', params);
};
export const deleteCategory = (params) => {
    return axios.post('/category/del', { params });
};