import axios from '@/utils/axios';

export const getAlbumList = (params) => {
    return axios.get('/album/getall', { params });
};
export const changeAlbum = (params) => {
    return axios.patch('/album/update', params);
};
export const addAlbum = (params) => {
    return axios.post('/album/add', params);
};
export const deleteAlbum = (params) => {
    return axios.post('/album/del', { params });
};