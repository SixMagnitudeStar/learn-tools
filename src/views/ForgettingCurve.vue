<template>
  <div class="memory-curve-container">
    <div class="header">
      <div class="title-with-info">
        <h1>記憶遺忘曲線複習</h1>
        <button class="info-icon" @click="showRules = true" title="複習規則說明">i</button>
      </div>
      <div class="stats" v-if="allWords.length">
        <div class="stat-item">
          <span class="label">今日待複習</span>
          <span class="value">{{ readyToReview.length }}</span>
        </div>
        <div class="stat-item">
          <span class="label">即將到來</span>
          <span class="value">{{ upcomingReviews.length }}</span>
        </div>
        <div class="stat-item">
          <span class="label">已精通</span>
          <span class="value">{{ graduatedCount }}</span>
        </div>
      </div>
    </div>

    <!-- 規則說明彈窗 -->
    <div class="modal-overlay" v-if="showRules" @click.self="showRules = false">
      <div class="modal-container rules-modal">
        <div class="modal-header">
          <h3>複習規則說明</h3>
          <button @click="showRules = false" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <p>系統會根據你的複習次數，自動安排下一次複習的時間（間隔天數遞增）：</p>
          <ul class="intervals-list">
            <li><span class="stage">第 1 階段：</span>標記後 <strong>1</strong> 天</li>
            <li><span class="stage">第 2 階段：</span>上次複習後 <strong>3</strong> 天</li>
            <li><span class="stage">第 3 階段：</span>上次複習後 <strong>7</strong> 天</li>
            <li><span class="stage">第 4 階段：</span>上次複習後 <strong>14</strong> 天</li>
            <li><span class="stage">第 5 階段：</span>上次複習後 <strong>30</strong> 天</li>
            <li><span class="stage">第 6 階段：</span>上次複習後 <strong>90</strong> 天</li>
          </ul>
          <p class="graduation-note">完成 6 次複習後，該單字將進入「已精通」狀態。</p>
        </div>
        <div class="modal-footer">
          <button @click="showRules = false" class="btn-confirm">我知道了</button>
        </div>
      </div>
    </div>

    <div class="main-content">
      <!-- 今日複習區塊 -->
      <section class="review-section">
        <h2>今日挑戰 <span class="badge" v-if="readyToReview.length">{{ readyToReview.length }}</span></h2>
        
        <div v-if="loading" class="loading">載入中...</div>
        
        <div v-else-if="readyToReview.length === 0" class="empty-state">
          <img src="../assets/check.png" alt="Done" />
          <p>太棒了！今天的所有單字都複習完了。</p>
        </div>

        <div v-else class="card-stack">
          <div 
            class="review-card" 
            :class="{ 'is-flipped': isFlipped }"
            @click="isFlipped = !isFlipped"
          >
            <div class="card-front">
              <div class="stage-info">階段 {{ currentWord.review_count + 1 }} / 6</div>
              <div class="word-display">{{ currentWord.word }}</div>
              <div class="hint">點擊查看翻譯</div>
              <div class="overdue-tag" v-if="getOverdueDays(currentWord) > 0">
                逾期 {{ getOverdueDays(currentWord) }} 天
              </div>
            </div>
            <div class="card-back">
              <div class="translation-display">{{ currentWord.translation || '尚無翻譯' }}</div>
              <div class="actions" @click.stop>
                <button class="btn-primary" @click="handleReview(currentWord.id)">我記住了</button>
                <button class="btn-secondary" @click="isFlipped = false">再看一次</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 待複習預覽區塊 -->
      <section class="upcoming-section">
        <h2>複習進度表</h2>
        <div class="upcoming-list">
          <div v-if="upcomingReviews.length === 0" class="no-upcoming">
            目前沒有排程中的單字。
          </div>
          <div 
            v-for="word in upcomingReviews.slice(0, 10)" 
            :key="word.id" 
            class="upcoming-item"
          >
            <div class="word-info">
              <span class="word-text">{{ word.word }}</span>
              <span class="stage-dot" v-for="n in 6" :key="n" :class="{ active: n <= word.review_count }"></span>
            </div>
            <div class="time-info">
              {{ formatNextReview(word) }}
            </div>
          </div>
          <div v-if="upcomingReviews.length > 10" class="more-hint">
            還有 {{ upcomingReviews.length - 10 }} 個單字在排程中...
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '@/axios';

const intervals = [1, 3, 7, 14, 30, 90];

const allWords = ref([]);
const loading = ref(true);
const isFlipped = ref(false);
const showRules = ref(false);

const fetchWords = async () => {
  loading.value = true;
  try {
    const res = await api.get('/markedwords');
    allWords.value = res.data.words || [];
  } catch (error) {
    console.error('Failed to fetch marked words:', error);
  } finally {
    loading.value = false;
  }
};

const getNextReviewDate = (word) => {
  if (word.review_count >= intervals.length) return null;
  
  const baseTime = word.review_count === 0 
    ? new Date(word.marked_time) 
    : new Date(word.last_review_time);
    
  const daysToAdd = intervals[word.review_count];
  const nextDate = new Date(baseTime);
  nextDate.setDate(nextDate.getDate() + daysToAdd);
  return nextDate;
};

const categorizedWords = computed(() => {
  const now = new Date();
  const ready = [];
  const upcoming = [];
  let graduated = 0;

  allWords.value.forEach(word => {
    if (word.review_count >= intervals.length) {
      graduated++;
      return;
    }

    const nextReview = getNextReviewDate(word);
    if (nextReview <= now) {
      ready.push({ ...word, nextReview });
    } else {
      upcoming.push({ ...word, nextReview });
    }
  });

  // 排序：今日複習越逾期的越前面
  ready.sort((a, b) => a.nextReview - b.nextReview);
  // 排序：未來複習越近的越前面
  upcoming.sort((a, b) => a.nextReview - b.nextReview);

  return { ready, upcoming, graduated };
});

const readyToReview = computed(() => categorizedWords.value.ready);
const upcomingReviews = computed(() => categorizedWords.value.upcoming);
const graduatedCount = computed(() => categorizedWords.value.graduated);

const currentWord = computed(() => readyToReview.value[0] || {});

const getOverdueDays = (word) => {
  if (!word.nextReview) return 0;
  const diffTime = new Date() - word.nextReview;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

const formatNextReview = (word) => {
  const nextReview = getNextReviewDate(word);
  if (!nextReview) return '';
  
  const now = new Date();
  const diffTime = nextReview - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '明天';
  if (diffDays <= 7) return `${diffDays} 天後`;
  return nextReview.toLocaleDateString();
};

const handleReview = async (wordId) => {
  try {
    const res = await api.post(`/markedword/${wordId}/review`);
    // 更新本地資料
    const index = allWords.value.findIndex(w => w.id === wordId);
    if (index !== -1) {
      allWords.value[index] = res.data;
    }
    isFlipped.value = false;
  } catch (error) {
    console.error('Review failed:', error);
  }
};

onMounted(fetchWords);
</script>

<style scoped>
.memory-curve-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'PingFang TC', 'Microsoft JhengHei', sans-serif;
  color: #2c3e50;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}

.header h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #34495e;
}

.stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-item .label {
  font-size: 0.8rem;
  color: #7f8c8d;
}

.stat-item .value {
  font-size: 1.2rem;
  font-weight: bold;
  color: #3498db;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 30px;
}

@media (max-width: 768px) {
  .main-content {
    grid-template-columns: 1fr;
  }
}

.review-section h2, .upcoming-section h2 {
  font-size: 1.1rem;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.badge {
  background: #e74c3c;
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.8rem;
  margin-left: 10px;
}

/* Card Styling */
.card-stack {
  perspective: 1000px;
  height: 350px;
}

.review-card {
  width: 100%;
  height: 100%;
  cursor: pointer;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  position: relative;
}

.review-card.is-flipped {
  transform: rotateY(180deg);
}

.card-front, .card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden; /* Safari */
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  padding: 40px;
  border: 1px solid #eee;
}

.card-back {
  transform: rotateY(180deg);
  background: #f9f9f9;
}

.stage-info {
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 0.9rem;
  color: #95a5a6;
}

.overdue-tag {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #fff5f5;
  color: #e74c3c;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
}

.word-display {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #2c3e50;
  text-align: center;
}

.translation-display {
  font-size: 1.8rem;
  margin-bottom: 30px;
  color: #34495e;
  text-align: center;
}

.hint {
  font-size: 0.9rem;
  color: #bdc3c7;
}

.actions {
  display: flex;
  gap: 15px;
}

button {
  padding: 10px 24px;
  border-radius: 8px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #2ecc71;
  color: white;
}

.btn-primary:hover {
  background: #27ae60;
  transform: translateY(-2px);
}

.btn-secondary {
  background: #ecf0f1;
  color: #7f8c8d;
}

.btn-secondary:hover {
  background: #bdc3c7;
}

/* Upcoming List Styling */
.upcoming-section {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  height: fit-content;
}

.upcoming-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.upcoming-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #f1f1f1;
}

.word-text {
  font-weight: 500;
  display: block;
  margin-bottom: 4px;
}

.stage-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #eee;
  margin-right: 4px;
}

.stage-dot.active {
  background: #3498db;
}

.time-info {
  font-size: 0.8rem;
  color: #95a5a6;
}

.empty-state {
  text-align: center;
  padding: 60px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}

.empty-state img {
  width: 80px;
  margin-bottom: 20px;
  opacity: 0.6;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #95a5a6;
}

.no-upcoming {
  text-align: center;
  color: #bdc3c7;
  padding: 20px;
}

.more-hint {
  text-align: center;
  font-size: 0.8rem;
  color: #bdc3c7;
  margin-top: 10px;
}

/* Info Icon & Modal Styles */
.title-with-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.info-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #3498db;
  color: white;
  border: none;
  font-size: 14px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 0;
  transition: opacity 0.2s;
}

.info-icon:hover {
  opacity: 0.8;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background: white;
  width: 90%;
  max-width: 450px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

.modal-header {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #95a5a6;
  padding: 0;
  line-height: 1;
}

.modal-body {
  padding: 20px;
  color: #34495e;
  line-height: 1.6;
}

.intervals-list {
  list-style: none;
  padding: 0;
  margin: 15px 0;
}

.intervals-list li {
  padding: 8px 12px;
  background: #f8f9fa;
  margin-bottom: 5px;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
}

.stage {
  color: #7f8c8d;
}

.graduation-note {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px dashed #eee;
  font-weight: bold;
  color: #27ae60;
  text-align: center;
}

.modal-footer {
  padding: 15px 20px;
  text-align: right;
  background: #f9f9f9;
}

.btn-confirm {
  background: #3498db;
  color: white;
  padding: 8px 20px;
  font-size: 0.9rem;
}

</style>
