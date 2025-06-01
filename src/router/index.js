// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import ELPView from '../views/ELP.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  { path: '/ELP', component: ELPView}
  // 你可以在這裡加入更多頁面
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router