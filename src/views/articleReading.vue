<template>
  <div id="container">
    <div >
      <span class="iconBox">
        <div class="tooltip">
          <img @click="createNewArticle" class="icon" src="../assets/plus.png" alt="建立文章" title="建立文章"/>
          <div class="tooltip-text">建立文章</div>
        </div>
        
        <div class="tooltip">
          <img @click="fetchTextFromAPI()" class="icon" src="../assets/random.png" alt="隨機生成文章" title="隨機生成文章">
          <div class="tooltip-text">隨機一篇生成文章</div>
        </div>
        
      </span>
      <ul class="article-list">
        <li v-for="(title,index) in articles" 
        v-bind:key="index"
        :class="{selected: selectedIndex === index}"
        @click="selectedIndex=index"
        >{{title}}</li>
      </ul>
    </div>

    <div class="article-content" >
      <h1 class="article-title"
          contenteditable="true"
          placeholder="5sss"
          @input="articleTitleChange"
          ref="editableTitle"
          spellcheck="false"
      >文章標題</h1>
      <span
        v-for="(word, index) in parsedWords"
        :key="index"
        :class="{ word: true, active: activeIndexes.includes(index) }"
        @click="toggleWord(index)"
        v-html="word.html"
      ></span>
    </div>

    <div class="note-div">
      <div class="record-words-area">

      </div>
      <div class="note-area" contenteditable="true">

      </div>
    </div>


  </div>


</template>

<script setup>
import { ref, computed, onMounted, watch, reactive  } from 'vue'

/* global defineOptions */
defineOptions({
  name: 'articleReadingPage'
})


const editableTitle = ref(null);

const articleTitle = ref('');

const articles = reactive([]);
const selectedIndex = ref(null); // 記錄被選中的 li

articles.push("訊息 1","訊息 2AFASFSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSA", "訊息 3");


// 原始文字內容（可從 API 傳入）
// const text = ref(`React (also known as React.js or ReactJS) is a free and open-source
// front-end JavaScript library for 。，building user interfaces (UIs).`)

const text = ref('')  // 初始為空字串

// 記錄被點擊的詞索引
const activeIndexes = ref([])
//activeIndexes.value = [1, 3]

// 將文字斷詞，包進 HTML 結構
const parsedWords = computed(() => {
  // const words = text.value.match(/\s+|\w+|[^\w\s]/g) || []
  const words = (text.value || '').match(/\s+|\w+|[^\w\s]/g) || []

  return words.map((word) => {
    if ((word.trim() === '') || (!isWord(word))){
      return { html: word, clickable: false } // 空白原樣回傳
    }
    return { html: word, clickable: true }
  })
})


// 文章標題change事件，將最新的異動text值寫入綁定的標題值變數
function articleTitleChange(e){
  articleTitle.value = e.target.innerText;

}



function createNewArticle(){
  //
  articles.unshift('new message');
  editableTitle.value.focus();
}

// function onBlur(event) {
//   if (articleTitle.value.trim() === '') {
//     articleTitle.value = '暫無標題'
//     event.target.innerText = articleTitle.value
//   }
//   console.log('blur 觸發', articleTitle.value)
// }


// 切換某個單字的高亮狀態
function toggleWord(index) {
  if (!parsedWords.value[index].clickable) return

  const i = activeIndexes.value.indexOf(index)
  if (i === -1) {
    activeIndexes.value.push(index)
  } else {
    activeIndexes.value.splice(i, 1)
  }
}

// 判斷是不是字元(單一字元)
function isTextChar(char) {
  return /^[a-zA-Z0-9]$/.test(char);
}

// 判斷是不是文字(逐一檢查每個word的單一字元)
function isWord(str) {
  // 全部字元都是文字或數字
  return [...str].every(char => isTextChar(char))
}


// 封裝 API 請求
async function fetchTextFromAPI() {
  try {
    const topic = encodeURIComponent('AI in education')
    const wordLimit = 200
    const url = `http://127.0.0.1:8000/essay?topic=${topic}&word_limit=${wordLimit}`

    const res = await fetch(url)
    const data = await res.json() // 假設 API 回傳 JSON { text: '...' }

    articleTitle.value = data.topic;
    text.value = data.essay;     // 將 API 回傳文字設定給 ref
  } catch (err) {
    console.error(err)
  }
}


onMounted(()=>{
  
// 頁面載入時同步 文章標題的innerText
  if (editableTitle.value){
    editableTitle.value.innerText = articleTitle.value;
  }

  // fetchTextFromAPI();
})


// 同步外部改變時也更新 editable div 內容（避免虛擬DOM覆蓋）
watch(articleTitle, (newVal) => {
  if (editableTitle.value && editableTitle.value.innerText !== newVal) {
    editableTitle.value.innerText = newVal
  }
})






</script>
<style scoped>

#container{
  width: 60vw;
  height: 60vh;

  background-color: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-top: 5vw;

  display: flex;
}

.word {
  cursor: pointer;
  padding: 2px;
  transition: 0.2s;
}
.word.active {
  color: red;
  font-weight: bold;
}
.article-content{
    width: 50vw;
    text-align: left;

    margin-left: 30px;
    border: none;
    outline: none;
}

.article-title{
    border: none;
}

.article-title:empty::before {
  content: "輸入文章標題…";
  color: #aaa;
  pointer-events: none; /* 避免遮住點擊 */
}

.article-list{
  width: 150px;
  /* background-color: #F0F0F0; */
  background-color: rgba(240, 240, 240, 5); /* 背景半透明 */
  height: auto;

  list-style: none;        /* 移除前面的圓點 */
  padding: 0;
  margin: 0;
  border: 1px solid #ccc;  /* 外框 */
  border-radius: 6px;
  overflow: auto;        /* 讓邊框收齊 */
} 

.article-list li {
  padding: 10px;
  border-bottom: 1px solid #ccc;

  overflow: hidden;           /* 超出隱藏 */
  text-overflow: ellipsis;    /* 顯示省略號 */
}

.article-list li.selected {
  background-color: #ddd; /* 反灰 */
}

.article-list li:last-child {
  border-bottom: none; /* 最後一項不要下邊框 */
}


.note-div{
  width: 300px;
  height: 100%;
  border-radius: 6px;
}


.note-div .record-words-area{
  height: 50%;
  /* width: auto; */
}

.note-div .note-area{
  height: 50%;
  /* border: none; */
  text-align: left;
}

.note-div div{
  background-color: rgba(240, 240, 240, 5); /* 背景半透明 */
  border: 1px solid #ccc;   /*外框 */
  overflow: auto;        /* 讓邊框收齊 */
}


[contenteditable='true']{
  outline: none;
}

.icon{
  width: 25px;
  height: 25px;
  display: block;
  cursor: pointer;
  
}

.iconBox{
  display: flex;
  margin: 5px;
}



</style>