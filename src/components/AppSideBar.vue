<template>
  <div id="container">

    <div  id="toggle-sidebar-btn-wrapper">
      <!-- <button  id="toggle-sidebar-btn" @click="showPanel = !showPanel" class="toggle-btn">
        {{ showPanel ? '隱藏' : '展開' }}
      </button> -->
      <img id="toggle-sidebar-btn" :src="toggleSideBar_icon"  @click="() => { showPanel = !showPanel; switch_toggleSideIcon(); }" />
    </div>

    <!-- 滑出的主區塊：包含輸入與列表 -->
    <transition name="slide">
      <div v-if="showPanel" class="panel">
      
        <button id = 'close_btn' @click="closeSideBar">隱藏</button>
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
    <!-- 固定的展開按鈕 -->

  </div>
</template>
<script>
export default {
  name: 'AppSideBar',
  data() {
    return {
      newItem: '',
      items: [],
      showPanel: false,
      toggleSideBar_icon : require('../assets/angle-double-left.png')
      
    };
  },
  methods: {
    addItem() {
      const text = this.newItem.trim();
      if (text) {
        this.items.push(text);
        this.newItem = '';
      }
    },
    closeSideBar(){
      // this.showPanel = false;
      // this.sideBar_displayMode = 'block';
    },
    switch_toggleSideIcon() {
      this.toggleSideBar_icon = this.toggleSideBar_icon === require('../assets/angle-double-right.png')
        ? require('../assets/angle-double-left.png')
        : require('../assets/angle-double-right.png');
    }

  }
};
</script>


<style scoped>
#container {
  position: absolute;
  display: block;
  padding: 1rem;
  top: 0;
  left: 0;
}


#toggle-side-bar-wrapper{
  position: fixed;
  height: 50px;
  margin-left: 0;
  width: 50px;

}

#toggle-sidebar-btn:hover {
  background-color:lightgray;
}

#toggle-sidebar-btn{
  width: 40px;
  height: 40px;
  display: block; /* 避免 inline img 底部空白 */
  border-radius: 10px;

  background-color: #f4f4f4;
  cursor: pointer;
}

/* 展開/收合按鈕 */
.toggle-btn {
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
  position: relative;
  top: 50px;
  left: 0;
  margin-left: 0;
  width: 250px;
  height: 100%;
  background: #f4f4f4;
  border-right: 1px solid #ccc;
  padding: 1rem;
  box-shadow: 2px 0 5px rgba(0,0,0,0.1);
  z-index: 999;

  border-radius: 10px;
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

.tt{
  display: flex;
}


/* 滑動動畫 */


.slide-enter-active,
.slide-leave-active {
  transition: transform 0.7s ease, opacity 0.7s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}



</style>