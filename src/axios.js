import axios from 'axios'

const api = axios.create({
  baseURL: process.env.VUE_APP_API_BASE
})

// request 攔截器：每次請求前帶上 token
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


export default api