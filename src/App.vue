<template>

  <div id="app">
    <nav>
      <router-link to="/">首頁</router-link> |
      <router-link to="/ELP">English Listening Practice</router-link> |
      <router-link to="/login">登入</router-link> |
      <router-link to="/UnfamiliarWordsArea">不熟單字記錄區</router-link>
    </nav>
    <vocab-record-list></vocab-record-list>
    <router-view></router-view>
  </div>
  <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
  <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->

 
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'

import VocabRecordList from '@/components/VocabRecordList.vue'

export default {
  name: 'App',
  components: {
    VocabRecordList
    // HelloWorld
  },
  data(){
    return {
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

body{
  font-family: sans-serif;
  background-image: url('@/assets/photo_beach.avif');
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  margin: 0;
}
</style>
