import axios from 'axios'


let http = axios.create({
    baseURL:'http://127.0.0.1:9090/api',
    headers:{
        "Access-Control-Allow-Origin": "*"
    }
})
http.interceptors.request.use(
    (res) => {
        return res;
    },
    (err) => {
        return Promise.reject(err)
    }
)
http.interceptors.response.use(
    (res) => {
        return res.data
    },
    (err) => {
        return Promise.reject(err.data)
    }
)

export default http;