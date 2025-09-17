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
        <div class="tooltip">
          <img @click="saveArticleAPI()" class="icon" src="../assets/check.png" alt="儲存文章" title="儲存文章">
          <div class="tooltip-text">儲存文章</div>
        </div>
        <div class="tooltip">
          <img  class="icon" src="../assets/edit.png" alt="編輯文章" title="編輯文章">
          <div class="tooltip-text">編輯文章</div>
        </div>
        <div class="tooltip">
          <img @click="deleteArticle()" class="icon" src="../assets/bin.png" alt="刪除文章" title="刪除文章">
          <div class="tooltip-text">刪除文章</div>
        </div>
      </span>
      <ul class="article-list">
        <li v-for="(article,index) in articles" 
        v-bind:key="index"
        :class="{selected: selectedIndex === index}"
        @click="selectArticle(index)"
        >{{ article.title  || '未命名文章' }}</li>
      </ul>
    </div>

    <div class="article-content" >
      <h1 class="article-title"
          contenteditable="true"
          placeholder="5sss"
          @input="articleTitleChange"
          @keydown="handleTitleKeydown"
          ref="editableTitle"
          spellcheck="false"
          
      ></h1>
      <div v-if="isEditing" 
        class="article-editor" 
        contenteditable="true"
        @input="updateContent"
         ref="editorRef"
        ></div>
        
      <div v-else>
      <span
        v-for="(word, index) in parsedWords"
        :key="index"
        :class="{ 
          word: true, 
          active: selectedArticle.tags_css.some(item => item.index === String(index)) 
        }"
        @click="toggleWord(index)"
        v-html="word.html"
      ></span>
      </div>
    </div>

    <div class="note-div">

      <details open>
        <summary>不熟悉單字清單</summary>
        <div class="record-words-area">
          <div class="input-bar">
            <input type="text" placeholder="Enter a word & phrase" />
            <button>Add</button>
          </div>
      
          <ul>
            <li v-for="(word, index) in markedwords " :key="index">{{word}}</li>
          </ul>
        </div>
      </details>

      <details>
        <summary>筆記</summary>
        <div class="note-area" contenteditable="true" ref="noteArea"></div>
      </details>


    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, reactive, nextTick  } from 'vue'
import { useAuthStore } from '@/auth.js'

import api from '@/axios.js'
import axios from 'axios'
/* global defineOptions */
defineOptions({
  name: 'articleReadingPage'
})


const auth = useAuthStore()


const selectedArticle = reactive({
  'id': 0,
  'title': '',
  'content': '',
  'tags_css': [],
  'note': ''
})




const editableTitle = ref(null);

// const articleTitle = ref('');

const articles = reactive([])  // reactive 陣列
const selectedIndex = ref(0); // 記錄被選中的文章 li

const newArticle_id = reactive([]) // 紀錄新增文章的id

const markedwords = reactive(['apple','banana','x','sawe','asss','banana','x','sawe','asss','banana','x','sawe','asss']) // 紀錄標記不熟悉的單字


const noteArea = ref(null);


const editorRef = ref(null)

const isEditing = ref(false)


// articles.value.push("訊息 1","訊息 2AFASFSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSA", "訊息 3");


// 原始文字內容（可從 API 傳入）
// const text = ref(`React (also known as React.js or ReactJS) is a free and open-source
// front-end JavaScript library for 。，building user interfaces (UIs).`)

//const text = ref('')  // 初始為空字串

// 記錄被點擊的詞索引
// const activeIndexes = ref([])
//activeIndexes.value = [1, 3]


// const text = ref('');


// 編輯器內容更新
function updateContent(e) {
  selectedArticle.content = e.target.innerText // 或 innerHTML，看你要不要保留格式
}



// 將文字斷詞，包進 HTML 結構
const parsedWords = computed(() => {
  // const words = text.value.match(/\s+|\w+|[^\w\s]/g) || []
  // const words = (text.value || '').match(/\s+|\w+|[^\w\s]/g) || []
  const words = (selectedArticle.content || '').match(/\s+|\w+|[^\w\s]/g) || []
  return words.map((word) => {
    if ((word.trim() === '') || (!isWord(word))){
      return { html: word, clickable: false } // 空白原樣回傳
    }
    return { html: word, clickable: true }
  })
})



// 文章標題change事件，將最新的異動text值寫入綁定的標題值變數
function articleTitleChange(e){
  selectedArticle.title = e.target.innerText;
}




function handleTitleKeydown(e) {
  if (!isEditing.value) return

  if (e.key === 'Enter' || e.key === 'ArrowDown') {
    e.preventDefault() // 避免換行
    editorRef.value?.focus()
  }
}

function createNewArticle(){
  //

  newArticle_id.push(articles.length);

  articles.unshift({
    id: articles.length,
    title: '',
    content: '',
    tags_css: []
  });

  selectArticle(0);
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

  if (!selectedArticle) return

  const i = String(index);

  // const i = activeIndexes.value.indexOf(index)
  // if (i === -1) {
  //   activeIndexes.value.push(index)
  // } else {
  //   activeIndexes.value.splice(i, 1)
  // }

  const found = selectedArticle.tags_css.find(item => item.index === i)
  if (!found){
    selectedArticle.tags_css.push({'index':i})
    saveMarkedword(parsedWords.value[index].html)
  }else{
    selectedArticle.tags_css = selectedArticle.tags_css.filter(item => item.index !== i)
    deleteMarkedWord(parsedWords.value[index].html)
  }
}



// // 判斷是不是字元(單一字元)
function isTextChar(char) {
  return /^[a-zA-Z0-9]$/.test(char);
}

// // 判斷是不是文字(逐一檢查每個word的單一字元)
function isWord(str) {
  // 全部字元都是文字或數字
  return [...str].every(char => isTextChar(char))
}

function selectArticle(index){
  selectedIndex.value=index;
  Object.assign(selectedArticle,articles[index]);
  nextTick(() => {
    if (editorRef.value) {
      editorRef.value.innerText = selectedArticle.content
      editorRef.value.focus()
    }
  })

  alert('選擇的文章id:'+selectedArticle.id+', 列表index:'+selectedIndex.value);

  if (newArticle_id.includes(selectedArticle.id)){
    alert('新文章')
    isEditing.value = true
  }else{
    alert('舊文章')
    isEditing.value = false
  }

//  alert(JSON.stringify(selectedArticle))
  //text.value = articles[index].content;
// articleTitle.value = articles[index].title;
}


// 封裝 API 請求
async function fetchTextFromAPI() {
  try {
    const topic = encodeURIComponent('AI in education')
    const wordLimit = 200
    const url = `http://127.0.0.1:8000/essay?topic=${topic}&word_limit=${wordLimit}`

    const res = await fetch(url)
    const data = await res.json() // 假設 API 回傳 JSON { text: '...' }

    const id = articles.length ;

    newArticle_id.push(id);

    articles.unshift({
      'id': id,
      'title': data.topic || "無標題",
      'content': data.essay || data.text || "",
      'tags_css': [],
      'note': data.note || ""
    });

   // Object.assign(selectedArticle, articles[0]);
     // 資料更新完成後再選第一個

    nextTick(() => {
      selectArticle(0)
      editableTitle.value.focus();
    })

//    selectedArticle.tags_css[1,3]
    //articleTitle.value = data.topic;
    // text.value = data.essay;     // 將 API 回傳文字設定給 ref
  } catch (err) {
    console.error(err)
  }
}




// import { indexOf } from 'core-js/core/array'

async function getArticles() {
  try {
    const response = await axios.get('http://127.0.0.1:8000/articles', {
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    })
    console.log('文章資料:', response.data)
    return Array.isArray(response.data.articles) ? response.data.articles : [];
    // return response.data.articles
  } catch (error) {
    console.error('取得文章失敗:', error)
    return []

  }
}


// async function saveArticleAPI() {
//   alert('進入');
//   try {
//     const response = await api.post('/article', {
//       title: articles[selectedIndex].title,
//       content: articles[selectedIndex].content
//     },{
//       headers: {
//         Authorization: `Bearer ${auth.token}`
//       }
//     })
//     alert('try');
//     console.log('chk'+JSON.stringify(response.data))
//     // router.push({ name: 'articleReading' })
//   } catch (err) {
//     alert('error')
//     console.error(err)
//   }
// }
async function saveArticleAPI() {
  const body = {
    id: selectedArticle.id,
    title: selectedArticle.title,
    content: selectedArticle.content,

    note: selectedArticle.note || '', // 添加預設值
    tags_css: selectedArticle.tags_css.map(item => ({
    index: String(item.index)
    }))
  }


  const headers = {
    Authorization: `Bearer ${auth.token}`
  }

  try{
    let response
    const i = newArticle_id.indexOf(body.id);


    // post
    if (i!=-1 ){
      response = await api.post('/article', body, { headers: headers })
      
      // 建立文章儲存後，從存放新文章id的列表中移除
      const index = newArticle_id.indexOf(selectedArticle.id)
      if (index !== -1) {
        newArticle_id.splice(index, 1) // 移除第一個匹配元素
      }
    }else{
      // put
      response = await api.put(`/article/${body.id}`, body, { headers })
   
    }

    console.log('新增成功', response.data)
  } catch(err){
    console.error('422 details:', err.response?.data?.detail)
    console.error(err)
  }
}


function deleteArticle(){

  // 紀錄刪除文章的id
  const id = selectedArticle.id
  alert('刪除文章id:'+id+', 移除文章index:'+selectedIndex.value);
  // 將當前選取文章從文章列表中移除

  articles.splice(selectedIndex.value, 1);

  // 選取第一篇文章
  selectArticle(0);

  // 檢查是否為尚未儲存的文章，如果是的話直接離開不用執行後面api
  if (newArticle_id.includes(selectedArticle.id)) return

  // 呼叫API從資料庫刪除該篇文章
  deleteArticleAPI(id);

}

async function deleteArticleAPI(id){
  //
  try{
    let response
    response = await api.delete(`/article/${id}`)
    console.log('刪除成功', response?.data)
  
  }catch(err){
    console.error('422 details:', err.response?.data?.detail)
    console.error(err)
  }
}

async function saveMarkedword(word){

    // 檢查文章是否已經儲存
    if (newArticle_id.includes(selectedArticle.id)){
      alert('文章尚未儲存，請先儲存!')
      return
    }

    
    let response

    const body = {
      article_id: selectedArticle.id,
      word: word
    }

  try{
    response = await api.post('/markedword', body)
    console.log('新增成功', response.data)

  }catch(err){
    console.error('422 details:', err.response?.data?.detail)
    console.error(err)
  }
}

// 檢查是否是新文章，是新文章直接離開不用呼叫API刪除標記文字
// 呼叫API，刪除對應的字，返回訊息

async function deleteMarkedWord(word) {
  alert('刪除')
  if (newArticle_id.includes(selectedArticle.id)) return
  
  let response

  const params = {
    article_id: selectedArticle.id,
    word: word
  }

  
  response = await api.delete('/markedword/',{
    params: params
  })
  console.log(response.data)
  alert('maredword刪除成功')
}

onMounted(async ()=>{


  // 抓取文章
  const fetched = await getArticles()
  articles.push(...fetched)  // 展開陣列

  await nextTick()
  selectArticle(0) // 讀取第一篇文章
  noteArea.value.innerText = selectedArticle.note;
  
  // selectedArticle.tags_css = [{'index':'1'},{'index':'2'}]




})



watch(selectedArticle, (newItem) => {
  if (editableTitle.value && editableTitle.value.innerText !== newItem.title){
    editableTitle.value.innerText = newItem.title;
  }

  if (noteArea.value.innerText != newItem.note){
    noteArea.value.innerText = newItem.note;
  }

  // if (text.value != newItem.content){
  //   text.value = newItem.content;
  // }
})



</script>
<style scoped>

#container{
  width: 70vw;
  min-height: 60vh;
  height: auto;

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

.word:hover{
  background-color: #ddd;
  border-radius: 5px;
}

.article-content{
    width: 50vw;
    text-align: left;
    font-size: 24px;
    margin-left: 30px;
    border: none;
    outline: none;
}

.article-editor{
    width: 50vw;
    text-align: left;
    font-size: 24px;
    margin-left: 30px;
    border: none;
    outline: none;
    font-size: blue;
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
  cursor: pointer;

  list-style: none;        /* 移除前面的圓點 */
  padding: 0;
  margin: 0;
  border: 1px solid #ccc;  /* 外框 */
  border-radius: 6px;
  overflow: auto;        /* 讓邊框收齊 */

      caret-color: transparent;   /* 隱藏輸入游標 */
    user-select: none;          /* 禁止選取文字 (可選) */
/*    outline: none;              移除點擊時外框 */
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
  width: 400px;
  height: 100%;
  border-radius: 6px;
}




.note-div .record-words-area{
  height: 25vh;
  display: block;
  width: auto; 
  padding: 10px;

  overflow-x: hidden;
  overflow-y: scroll;

}


.note-div .record-words-area input{
  /* margin-bottom: 10px; */
  border: 2px solid #ccc;
  border-radius: 5px; 
  /* margin-left: 0; */

}

.note-div .record-words-area input:focus{
  outline: none;
  border: 2px solid #555;
}



.note-div .record-words-area button{
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}


.note-div .note-area{
  height: 25vh;
  /* border: none; */
  display: block;
  text-align: left;
}

.note-div div{
  background-color: rgba(240, 240, 240, 5); /* 背景半透明 */
  border: 1px solid #ccc;   /*外框 */
  overflow: auto;        /* 讓邊框收齊 */
}

.note-div summary{
  text-align: left;
}

.input-bar{
  position: fixed;
  display: flex;

}


[contenteditable='true']{
  outline: none;
}


</style>