import axios from 'axios'
import { useAuthStore } from '@/auth'
import router from './router'

const api = axios.create({
  baseURL: process.env.VUE_APP_API_BASE
})

//request 攔截器：每次請求前帶上 token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')  // 或從 store 取
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

//Axios 攔截器 (處理 401 Unauthorized)
api.interceptors.response.use(
  res => res,
  err => {
    if (err.reponse?.status === 401){
      const auth = useAuthStore()
      auth.clearToken()
      localStorage.removeItem('token')
      router.push('/login')
    }
    return Promise.reject(err)
  }
)


export default api