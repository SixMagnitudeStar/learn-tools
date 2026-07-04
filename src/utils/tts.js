// src/utils/tts.js

// 儲存正在播放的 utterance 實例，防止被 GC (垃圾回收)
let activeUtterances = [];

// 從 localStorage 載入語音設定，或提供預設值
// pitch: 1.15 (微高，使聲音更明亮清晰)
// rate: 0.95 (微慢，使發音更清楚)
const DEFAULT_SETTINGS = {
  pitch: 1.15,
  rate: 0.95,
  volume: 1.0,
  preferredGender: 'female', // 優先選擇女聲
};

export const getTtsSettings = () => {
  if (typeof window === 'undefined') return { ...DEFAULT_SETTINGS };
  const saved = localStorage.getItem('tts_settings');
  if (saved) {
    try {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch (e) {
      console.error('解析 TTS 設定失敗，使用預設值', e);
    }
  }
  return { ...DEFAULT_SETTINGS };
};

export const saveTtsSettings = (settings) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('tts_settings', JSON.stringify(settings));
};

// 取得系統所有可用的語音
export const getVoices = () => {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return [];
  }
  return window.speechSynthesis.getVoices();
};

// 選擇最合適的女聲語音
export const selectVoiceForLang = (lang, preferredGender = 'female') => {
  const allVoices = getVoices();
  if (allVoices.length === 0) return null;

  const langLower = lang.toLowerCase();
  // 先找精確語言匹配，例如 'en-us'，再找部分匹配，例如 'en'
  let matchedVoices = allVoices.filter(v => v.lang.toLowerCase() === langLower);
  if (matchedVoices.length === 0) {
    const primaryLang = langLower.split('-')[0];
    matchedVoices = allVoices.filter(v => v.lang.toLowerCase().replace('_', '-').startsWith(primaryLang));
  }

  if (matchedVoices.length === 0) {
    return null;
  }

  // 設定各語系的高品質明亮女聲關鍵字優先順序（例如 Google 翻譯、Microsoft Zira/Yating、蘋果 Samantha 等）
  let keywords = [];
  if (langLower.startsWith('en')) {
    // 優先選 Google US English, Samantha, Zira (Windows), Microsoft Zira, Natural, Female
    keywords = ['google us english', 'samantha', 'zira', 'microsoft zira', 'natural', 'female', 'en-us'];
  } else if (langLower.startsWith('zh')) {
    // 優先選 雅婷 (Yating), 涵涵 (Hanhan), 曉曉 (Xiaoxiao), 婷婷 (Tingting), Google 國語, 惠惠 (Huihui)
    keywords = ['yating', 'hanhan', 'xiaoxiao', 'tingting', 'google 國語', 'huihui', 'natural', 'female', 'zh-tw', 'zh-cn'];
  } else if (langLower.startsWith('ja')) {
    // 優先選 七海 (Nanami), 晴香 (Haruka), 步美 (Ayumi), Google 日本語
    keywords = ['nanami', 'haruka', 'google 日本語', 'ayumi', 'female', 'ja-jp'];
  } else if (langLower.startsWith('ko')) {
    // 優先選 SunHi, Google 한국어
    keywords = ['sunhi', 'google', 'female', 'ko-kr'];
  } else {
    keywords = ['female', 'google', 'natural'];
  }

  if (preferredGender === 'female') {
    // 1. 根據關鍵字順序尋找最合適的女聲
    for (const kw of keywords) {
      const found = matchedVoices.find(v => v.name.toLowerCase().includes(kw));
      if (found) return found;
    }

    // 2. 備份方案：尋找名稱含 female / girl / woman / ms 等常見女聲特徵的語音
    const fallbackFemale = matchedVoices.find(v => {
      const name = v.name.toLowerCase();
      return name.includes('female') || name.includes('woman') || name.includes('girl') || name.includes('zira') || name.includes('yating') || name.includes('xiaoxiao');
    });
    if (fallbackFemale) return fallbackFemale;
  }

  // 3. 若無特定偏好或找不到女聲，回傳該語言的第一個語音
  return matchedVoices[0];
};

// 執行語音播放
export const speakText = (text, lang = 'en-US') => {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.warn('此瀏覽器不支援 Web Speech API speechSynthesis');
    return;
  }

  try {
    // 先取消之前正在播放的所有語音，避免排隊卡住
    window.speechSynthesis.cancel();
    activeUtterances = [];

    if (!text || text.trim() === '') return;

    const utterance = new SpeechSynthesisUtterance(text);
    const settings = getTtsSettings();

    // 設定語言
    // 支援簡寫轉標準 BCP-47 碼
    const langMap = {
      'en': 'en-US',
      'ja': 'ja-JP',
      'ko': 'ko-KR',
      'zh': 'zh-TW',
    };
    const targetLang = langMap[lang] || lang;
    utterance.lang = targetLang;

    // 選擇最佳語音
    const bestVoice = selectVoiceForLang(targetLang, settings.preferredGender);
    if (bestVoice) {
      utterance.voice = bestVoice;
      console.log(`TTS 選擇語音: ${bestVoice.name} (${bestVoice.lang})`);
    } else {
      console.log(`TTS 使用系統預設語音，語系: ${targetLang}`);
    }

    // 套用音調、速度、音量設定
    utterance.pitch = settings.pitch;
    utterance.rate = settings.rate;
    utterance.volume = settings.volume;

    // 防止 GC 的參考保留
    activeUtterances.push(utterance);

    utterance.onend = () => {
      activeUtterances = activeUtterances.filter(u => u !== utterance);
    };

    utterance.onerror = (event) => {
      // 排除 'interrupted' 的常見情況（因為呼叫了 cancel）
      if (event.error !== 'interrupted') {
        console.error('TTS 播放出錯:', event);
      }
      activeUtterances = activeUtterances.filter(u => u !== utterance);
    };

    window.speechSynthesis.speak(utterance);
  } catch (error) {
    console.error('播放語音時發生異常:', error);
  }
};
