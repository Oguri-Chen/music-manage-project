import axios from '@/utils/axios';

export const getMessageList = (params) => {
    return axios.get('/message/getall', { params });
};
export const changeMessage = (params) => {
    return axios.patch('/message/update', params);
};
export const addMessage = (params) => {
    return axios.post('/message/add', params);
};
export const deleteMessage = (params) => {
    return axios.post('/message/del', { params });
};