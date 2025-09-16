<!-- <template>
<div class="container">
  <h1>個人設定</h1>
  <form>
    <label for="nickname">暱稱:</label>
    <input type="text" id="nickname" name="nickname" placeholder="輸入暱稱">

    <label for="bgcolor">背景顏色:</label>
    <select id="bgcolor" name="bgcolor">
      <option value="#f0f0f0">淺灰色</option>
      <option value="#e0e0e0">灰色</option>
      <option value="#d0d0d0">深灰色</option>
      <option value="#c0c0c0">更深灰色</option>
      <option value="#a0a0a0">暗灰色</option>
    </select>

    <label for="article_title">文章主題:</label>
    <input type="text" id="article_title" name="article_title" placeholder="輸入文章主題">

    <label for="article_length">文章字數:</label>
    <input type="number" id="article_length" name="article_length" min="500" max="2500" placeholder="500-2500">
    <span style="font-size:smaller;color:#999;">(建議字數 500~2500)</span>

    <button type="submit">儲存設定</button>
  </form>
</div>
</template> -->

<template>
  <div class="container">
    <!-- 風格設定 -->
    <section class="card">
      <h2>風格設定</h2>
      <div class="form-group">
        <label>暱稱</label>
        <input type="text" placeholder="輸入暱稱" />
      </div>
      <div class="form-group">
        <label>背景顏色</label>
        <input type="color" />
      </div>
    </section>

    <!-- 文章設定 -->
    <section class="card">
      <h2>文章設定</h2>
      <div class="form-group">
        <label>文章主題</label>
        <textarea rows="5" placeholder="輸入文章主題或欲生成內容的描述..."></textarea>
      </div>
      <div class="form-group">
        <label>文章字數</label>
        <input type="number" placeholder="設定文章字數限制 (500~2500)" />
      </div>
    </section>
  </div>
</template>

<style scoped>
/* 容器 */
.container {
  /* max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
  box-sizing: border-box;
  font-family: Arial, sans-serif; */
}

/* 卡片區塊 */
.card {
  margin-top: 50px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  padding: 20px;
  margin-bottom: 20px;
}

/* 標題 */
.card h2 {
  font-size: 1.5rem;
  margin-bottom: 15px;
}

/* 表單群組 */
.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #333;
}

.form-group input[type="text"],
.form-group input[type="number"],
.form-group textarea,
.form-group input[type="color"] {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-sizing: border-box;
  font-size: 1rem;
}

textarea {
  resize: vertical;
}

/* input[type="color"] 小調整 */
input[type="color"] {
  width: 60px;
  height: 35px;
  padding: 0;
  border: none;
  cursor: pointer;
}
</style>
<script setup>
/* global defineOptions */
defineOptions({
  name: 'personalSetting'
})
</script>
<!-- 
<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 20px;
  border-radius: 5px;
  color: white;
}

label {
  display: block;
  margin-bottom: 5px;
}

input[type="text"],
select,
textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
  box-sizing: border-box;
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}
</style> -->