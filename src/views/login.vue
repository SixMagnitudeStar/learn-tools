<template>
    <div class="login-container">
    <h1>Login</h1>
    <!-- <form> -->
        <input type="text" placeholder="Username" v-model="username" required>
        <input type="password" placeholder="Password"  v-model="password" required>
        <!-- <button type="submit" @click="login">Login</button> -->
        <button type="button" @click="login">Login</button>
        <p v-if="error" style="color:red">{{ error }}</p>
    <!-- </form> -->
    </div>
</template>
<script setup>
// export default{
//     name : 'loginView'
// }
defineOptions({
  name: 'loginView'
})


import { ref } from 'vue'
import { useAuthStore } from '@/auth.js'
import axios from 'axios'
import { useRouter } from 'vue-router'  // <-- 匯入 router

const username = ref('')
const password = ref('')
const error = ref('')

const auth = useAuthStore()
const router = useRouter()  // <-- 取得 router 實例

async function login() {
  try {
    const response = await axios.post('http://127.0.0.1:8000/login', {
      username: username.value,
      password: password.value
    })
    // 假設 API 回傳格式 { token: "abc123" }
    auth.setToken(response.data.token)
    error.value = ''
    alert('Login successful! Token saved.')
    router.push('/articleReading')
  } catch (err) {
    console.error(err)
    error.value = 'Login failed'
  }
}


</script>

<style scoped>
.login-container {
  background-color: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.login-container input {
  width: 95%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

.login-container button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

</style>