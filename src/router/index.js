// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import ELPView from '../views/ELP.vue'
import loginView from '@/views/login.vue'
import UnfamiliarWordsView from '../views/UnfamiliarWordsArea.vue'
import articleReadingPage from '@/views/articleReading.vue'
// import { useAuthStore } from '@/auth.js'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  { path: '/ELP', component: ELPView},
  { path: '/login', component: loginView},
  { path: '/UnfamiliarWordsArea', component: UnfamiliarWordsView},
  { path: '/articleReading', 
    component: articleReadingPage,
    meta: { requiresAuth: false }}
  // 你可以在這裡加入更多頁面
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


// 全域路由守衛
// router.beforeEach((to, from, next) => {
//   const auth = useAuthStore()
//   const token = auth.token || localStorage.getItem('token') // 從 pinia 或 localStorage 拿 token

//   if (to.meta.requiresAuth && !token) {
//     // 沒有登入，跳回 login
//     next('/login')
//   } else {
//     next()
//   }
// })


export default router