<template>
  <div id="container">
    <div class="article">
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
import { ref, computed  } from 'vue'

/* global defineOptions */
defineOptions({
  name: 'articleReadingPage'
})


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


</script>
<style scoped>

#container{
  width: 600px;

  background-color: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-top: 5vw;
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
.article{
    width: 300px;
    text-align: left;
}
</style>