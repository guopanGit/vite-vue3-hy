import axios from 'axios'
import store from '@/store'
import {ElMessage} from 'element-plus'
import Qs from 'qs'
// const baseURL = import.meta.env.VITE_BASE_URL

// const baseURL = 'http://192.168.0.51:8080/v1'
// const baseURL = 'http://192.168.0.187:8080/v1'

let baseURL = window.localStorage.getItem('baseURL')
console.log(baseURL);
if (!baseURL) {
  baseURL = 'http://101.71.248.206:8080/v1'
}

const service = axios.create({
  baseURL,
  timeout: 15000, // 请求超时时间
})

// 请求前的统一处理
service.interceptors.request.use(
  (config) => {
    // JWT鉴权处理
    let Authorization = sessionStorage.getItem('token')
    if (Authorization) {
      config.headers.Authorization = Authorization
    }
    config.headers['Access-Control-Allow-Origin'] = '*'
    if (config.data && config.method === 'get') {
      config.url = `${config.url}?${Qs.stringify(config.data)}`
    }
    return config
  },
  (error) => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code === 200) {
      return res
    } else {
      return Promise.reject(res)
    }
  },
  (error) => {
    // console.log(error) // for debug
    const badMessage = error.message || error
    const code = parseInt(badMessage.toString().replace('Error: Request failed with status code ', ''))
    return Promise.reject(error)
  }
)

function showError(error) {
  if (error.code === 403) {
    // to re-login
    store.dispatch('user/loginOut')
  } else {
    ElMessage({
      message: error.msg || error.message || '服务异常',
      type: 'error',
      duration: 3 * 1000
    })
  }

}

export default service