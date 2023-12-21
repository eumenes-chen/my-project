import axios from 'axios'

export default class Http {
    constructor() {
        this.$axios = axios

        axios.interceptors.request.use(
            config => {
                if (config.method === 'get') {
                    config.data = { unused: 0 }
                    config.headers['content-type'] = 'application/x-www-form-urlencoded'
                }
                return config;

            }
        )
        axios.interceptors.response.use(
            (response) => {
                console.log('返回错误',response);
                return response.data || response;
            },
            (error) => {
                return Promise.reject(error);
            }
        )
    }
    get(url,data) {
        return axios.get(url,data)
    }
    post(url, data = {}) {
        return axios.post(url, data)
    }
    put(url, data = {}) {
        return axios.put(url, data)
    }
}