// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import ELPView from '../views/ELP.vue'
import loginView from '../views/login.vue'
import UnfamiliarWordsView from '../views/UnfamiliarWordsArea.vue'
import articleReadingPage from '@/views/articleReading.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  { path: '/ELP', component: ELPView},
  { path: '/login', component: loginView},
  { path: '/UnfamiliarWordsArea', component: UnfamiliarWordsView},
  { path: '/articleReading', component: articleReadingPage}
  // 你可以在這裡加入更多頁面
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router