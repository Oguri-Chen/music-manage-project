import axios from '@/utils/axios';

export const getMusicList = (params) => {
    return axios.get('/music/getall', { params });
};
export const changeMusic = (params) => {
    return axios.patch('/music/update', params);
};
export const addMusic = (params) => {
    return axios.post('/music/add', params);
};
export const deleteMusic = (params) => {
    return axios.post('/music/del', { params });
};