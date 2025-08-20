
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: ''  // 這裡放 token
  }),
  actions: {
    setToken(newToken) {
      this.token = newToken
    },
    clearToken() {
      this.token = ''
    }
  }
})