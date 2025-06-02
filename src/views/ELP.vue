
<template>
    <div>
      <h1>Welcome to English Listening Practice Page</h1>
    </div>

    <div>
      <input v-model="vocab" type="text" />
      <button @click="appendVocab(vocab)">新增到聽力複習列表</button>
      <button @click="speak">🔊 發音</button><span>{{listeningVocab }}</span>
    </div>
    <div>
      <h2>聽力列表：</h2>
      <ul>
        <li v-for="(vocab, index) in vocabList" :key="index">{{vocab}}</li>
      </ul>
    </div>
      <div>
      <h2>聆聽列表：</h2>
      <ul>
        <li v-for="(vocab, index) in listeningList" :key="index">{{vocab}}</li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ELPView',
    data() {
    return {
      vocab: '',
      vocabList: [],
      listeningList: [],
      listeningVocab: ''
    }
  },
  methods: {
    speak() {
      
      if (this.listeningList.length ===0){
        alert('聆聽列表已空，請先新增詞彙');
        return;
      }


      // 從聆聽列表中隨機取得索引
      let randomIndex = Math.floor(Math.random() * this.listeningList.length);
      
      // 取得要聆聽的詞彙
      // let randomWord = this.listeningList[randomIndex];
      this.listeningVocab = this.listeningList[randomIndex];

      // 將該詞彙從聆聽列表中移除
      this.listeningList.splice(randomIndex, 1);
      

      // 將要念的語音內容建構成一個物件
      const utterance = new SpeechSynthesisUtterance(this.listeningVocab);

      //指定語音的語言
      utterance.lang = 'en-US'; // 可改為 'zh-TW'、'ja-JP' 等

      //語音合成器物件呼叫speak method執行上面建立的語音內容物件
      speechSynthesis.speak(utterance);
    },
    appendVocab(vocab){
      this.vocabList.push(vocab);
      this.vocab = '';
      this.listeningList = [...this.vocabList];
    }
  }

  }
  </script>