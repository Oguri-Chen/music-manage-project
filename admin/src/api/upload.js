import axios from '@/utils/axios';

export function uploadFile(params) {
    return axios.post('/upload', params, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
}
export function chunkUploadFile(params) {
    return axios.post('/chunkupload', params, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
}
