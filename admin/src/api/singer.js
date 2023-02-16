import axios from '@/utils/axios';

export const getSingerList = (params) => {
    return axios.get('/Singer/getall', { params });
};
export const changeSinger = (params) => {
    return axios.patch('/Singer/update', params);
};
export const addSinger = (params) => {
    return axios.post('/Singer/add', params);
};
export const deleteSinger = (params) => {
    return axios.post('/Singer/del', { params });
};