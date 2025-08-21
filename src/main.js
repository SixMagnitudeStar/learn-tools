import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import router from './router'  // 👈 加上這行

const app = createApp(App)

app.use(router)

const pinia = createPinia()

app.use(pinia) // 必须在挂载前使用
app.mount('#app')