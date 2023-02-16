import axios from "@/utils/axios";

export function login({ ...params }) {
    return axios.post('/user/login', params)
}
export function getMenu() {
    return axios.get('/menu/get')
}