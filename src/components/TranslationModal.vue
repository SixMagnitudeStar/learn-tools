<template>
  <div v-if="visible" class="translation-edit-modal-overlay" @click.self="$emit('close')">
    <div class="translation-edit-modal-content">
      <h3>編輯單字翻譯</h3>
      <p class="word-to-edit">單字：<strong>{{ word }}</strong></p>
      <input 
        type="text" 
        v-model="tempTranslation" 
        placeholder="請輸入翻譯..." 
        @keyup.enter="handleSubmit"
        ref="inputRef"
      />
      <div class="modal-buttons">
        <button class="save-btn" @click="handleSubmit">儲存</button>
        <button class="cancel-btn" @click="$emit('close')">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'

const props = defineProps({
  visible: Boolean,
  word: String,
  translation: String
})

const emit = defineEmits(['close', 'submit'])

const tempTranslation = ref('')
const inputRef = ref(null)

watch(() => props.visible, (newVal) => {
  if (newVal) {
    tempTranslation.value = props.translation || ''
    // 自動聚焦輸入框
    setTimeout(() => {
      if (inputRef.value) {
        inputRef.value.focus()
      }
    }, 50)
  }
})

function handleSubmit() {
  emit('submit', tempTranslation.value.trim())
}
</script>

<style scoped>
.translation-edit-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.translation-edit-modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 320px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  text-align: left;
}

.translation-edit-modal-content h3 {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 18px;
  color: #333;
}

.translation-edit-modal-content .word-to-edit {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
}

.translation-edit-modal-content input {
  width: 100%;
  padding: 8px 12px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.translation-edit-modal-content .modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.translation-edit-modal-content .modal-buttons button {
  padding: 6px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.translation-edit-modal-content .modal-buttons .save-btn {
  background-color: #2196F3;
  color: white;
}

.translation-edit-modal-content .modal-buttons .cancel-btn {
  background-color: #eee;
  color: #333;
}
</style>
