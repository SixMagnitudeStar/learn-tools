<template>
  <div id="container">
    <div >
      <ul class="article-list">
        <li>訊息 1</li>
        <li>訊息 2</li>
        <li>訊息 3</li>
      </ul>
    </div>
    <div class="article-content"   contenteditable="true">
      <h1 class="article-title"
          @input="articleTitleChange"
          :innerText="articleTitle"
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch  } from 'vue'

/* global defineOptions */
defineOptions({
  name: 'articleReadingPage'
})


const editableTitle = ref(null);

const articleTitle = ref('暫無標題');


// 原始文字內容（可從 API 傳入）
const text = ref(`React (also known as React.js or ReactJS) is a free and open-source
front-end JavaScript library for 。，building user interfaces (UIs).`)

// 記錄被點擊的詞索引
const activeIndexes = ref([])
//activeIndexes.value = [1, 3]

// 將文字斷詞，包進 HTML 結構
const parsedWords = computed(() => {
  const words = text.value.match(/\s+|\w+|[^\w\s]/g) || []

  return words.map((word) => {
    if ((word.trim() === '') || (!isWord(word))){
      return { html: word, clickable: false } // 空白原樣回傳
    }
    return { html: word, clickable: true }
  })
})


// 文章標題change事件，將最新的異動text值寫入綁定的標題值變數
function articleTitleChange(e){
  articleTitle.value = e.target.innerText
}



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


onMounted(()=>{
  
// 頁面載入時同步 文章標題的innerText
  if (editableTitle.value){
    editableTitle.value.innerText = articleTitle.value;
  }
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

.article-list{
  width: 150px;
  background-color: aquamarine;
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
}

.article-list li:last-child {
  border-bottom: none; /* 最後一項不要下邊框 */
}



</style>