import axios from 'axios'
// 引入进度条和样式
import nprogress from 'nprogress'
import "nprogress/nprogress.css"

const requests = axios.create({

    baseURL: '/api'
})

requests.interceptors.request.use((config) => {

    // 请求头中携带token
    if(localStorage.getItem('Authorization')){
        config.headers.Authorization = localStorage.getItem('Authorization')
    }

    // nprogress.start();
    return config
})


requests.interceptors.response.use((response) => {
    //  成功的回调函数
    // nprogress.done()
    return response.data
}, (error) => {
    //   失败的回调函数
    nprogress.done()
    return Promise.reject(error)
})


export default requests;