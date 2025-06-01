
<template>
    <div>
      <h1>Welcome to English Listening Practice Page</h1>
    </div>

    <div>
      <input v-model="text" type="text" />
      <button @click="speak">🔊 發音</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ELPView',
    data() {
    return {
      text: 'Hello, how are you?'
    }
  },
  methods: {
    speak() {
      // 將要念的語音內容建構成一個物件
      const utterance = new SpeechSynthesisUtterance(this.text);

      //指定語音的語言
      utterance.lang = 'en-US'; // 可改為 'zh-TW'、'ja-JP' 等

      //語音合成器物件呼叫speak method執行上面建立的語音內容物件
      speechSynthesis.speak(utterance);
    }
  }

  }
  </script>