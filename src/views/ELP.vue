
<template>

  <div id="ELP-page">
    <div>
      <h1>Welcome to English Listening Practice Page</h1>
    </div>

    <div>
      <input v-model="vocab" type="text" placeholder="Enter a word & phrase" />
      &nbsp;
      <button @click="speak(vocab)">🔊 listening</button>&nbsp;
      <button @click="appendVocab(vocab)">Add to vocabList</button>
    </div>

    <div id="ListDiv">
      <div>
        <h2>詞彙列表：</h2>
        <ul>
          <li v-for="(vocab, index) in vocabList" :key="index">{{vocab}}
            <div class="tooltip">
             <img class="bin" src="@/assets/bin.png" @click="removeVocab(index)" alt="delete" >
            <span class="tooltiptext">Delete vocab</span>
          </div>
           
          </li>
        </ul>
      </div>
        <div>
        <h2>聆聽列表
          <span>🎲🔊</span>
          <img @click="refreshListeningList" class="refresh_icon" alt="Refresh" src="@/assets/rotate.png" title="refresh listeningList"> 
          ：<button @click="randomListening"> random listening</button> &nbsp;
          <button @click="reListening">🔊 listening again</button><span>{{listeningVocab }}</span> &nbsp;
        </h2>
        <ul>
          <li v-for="(vocab, index) in listeningList" :key="index">{{vocab}}</li>
        </ul>
      </div>
    </div>
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
      speak(text) {
        doSpeak(text) 
      },
      randomListening(){
        doRandomListening(this);
      },
      appendVocab(vocab){
        this.vocabList.push(vocab);
        this.vocab = '';
        this.listeningList = [...this.vocabList];
      },
      refreshListeningList(){
        doRefreshListeningList(this);
      },
      reListening(){
        doReListening(this);
      },

      // 依據索引刪除詞彙列表與聆聽列表中的單字
      removeVocab(vocabIndex){
        // 取得要移除的單字
        const word = this.vocabList[vocabIndex];

        // 找尋找該單字是否存在於聆聽列表中，若存在的話取得找到的第一個索引 (若匹配多個也僅刪除一個)
        const index = this.listeningList.indexOf(word);

        if (index !== -1) {
          // 取得陣列最後一個索引與元素
          const lastIndex = this.listeningList.length - 1;
          const lastWord = this.listeningList[lastIndex];

          // 將目標元素與最後一個元素交換位置，然後用 pop 移除最後一個 (swap-and-pop(陣列中移除元素，順序若不重要可用的技巧)
          this.listeningList[index] = lastWord;
          this.listeningList.pop();
        }

        // 將單字從詞彙列表中移除
        this.vocabList.splice(vocabIndex, 1);
      }

    }
  }

  function doSpeak(text){
        // 將要念的語音內容建構成一個物件
      const utterance = new SpeechSynthesisUtterance(text);

      //指定語音的語言
      utterance.lang = 'en-US'; // 可改為 'zh-TW'、'ja-JP' 等

      //語音合成器物件呼叫speak method執行上面建立的語音內容物件
      speechSynthesis.speak(utterance);
  }

  function doRandomListening(vm){

    //
    if (vm.listeningList.length ===0){
      alert('聆聽列表已空，請先新增詞彙');
      return;
    }

    // 從聆聽列表中隨機取得索引
    let randomIndex = Math.floor(Math.random() * vm.listeningList.length);
    
    // 取得要聆聽的詞彙
    // let randomWord = this.listeningList[randomIndex];
    vm.listeningVocab = vm.listeningList[randomIndex];

    // 將該詞彙從聆聽列表中移除
    vm.listeningList.splice(randomIndex, 1);
    
    vm.speak(vm.listeningVocab);
  }



  function doRefreshListeningList (vm) {
    vm.listeningList = vm.vocabList;
  }

  function doReListening(vm){
    vm.speak(vm.listeningVocab);
  }


  </script>


<style>

input[type="text"] {
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.refresh_icon{
  height: 25px;
  width: 25px;
  cursor: pointer;
}

li{
  height: 30px;
}

#ELP-page {
  background-color: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-top: 5vw;
}

.bin{
  height: 25px;
  width: 25px;
  cursor: pointer;
}

#ListDiv{
  display: flex;
}



.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip .tooltiptext {
  visibility: hidden;
  background-color: black;
  color: white;
  text-align: center;
  padding: 4px 8px;
  border-radius: 4px;
  position: absolute;
  z-index: 1;
  bottom: 100%; /* 顯示在上方 */
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}
</style>