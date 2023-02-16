import axios from '@/utils/axios';

export const getMVList = (params) => {
    return axios.get('/mv/getall', { params });
};
export const changeMV = (params) => {
    return axios.patch('/mv/update', params);
};
export const addMV = (params) => {
    return axios.post('/mv/add', params);
};
export const deleteMV = (params) => {
    return axios.post('/mv/del', { params });
};