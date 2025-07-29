<template>
  <div class="container">
    <!-- 固定的展開按鈕 -->

    <button @click="showPanel = !showPanel" class="toggle-btn">
      {{ showPanel ? '隱藏' : '展開' }}
    </button>
    <!-- 滑出的主區塊：包含輸入與列表 -->
    <transition name="slide">
      <div v-if="showPanel" class="panel">
        <!-- 輸入 + Add 按鈕 -->
        <div class="input-group">
          <input v-model="newItem" placeholder="輸入文字..." />
          <button @click="addItem">Add</button>
        </div>

        <!-- 顯示列表 -->
        <ul class="item-list">
          <li v-for="(item, index) in items" :key="index">{{ item }}</li>
        </ul>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  name: 'VocabRecordList',
  data() {
    return {
      newItem: '',
      items: [],
      showPanel: false
    };
  },
  methods: {
    addItem() {
      const text = this.newItem.trim();
      if (text) {
        this.items.push(text);
        this.newItem = '';
      }
    }
  }
};
</script>


<style scoped>
.container {
  display: flex;
  position: absolute;
  padding: 1rem;
}

/* 展開/收合按鈕 */
.toggle-btn {
  position: relative;
  top: 0;
  left: 0;
  z-index: 1000;
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  cursor: pointer;
}

/* 左側滑出的區塊 */
.panel {
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100%;
  background: #f4f4f4;
  border-right: 1px solid #ccc;
  padding: 1rem;
  box-shadow: 2px 0 5px rgba(0,0,0,0.1);
  z-index: 999;
}

.input-group {
  margin-bottom: 1rem;
}

.input-group input {
  width: 70%;
  padding: 0.5rem;
  margin-right: 0.5rem;
}

.input-group button {
  padding: 0.5rem;
}

.item-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.item-list li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #ddd;
}

/* 滑動動畫 */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>