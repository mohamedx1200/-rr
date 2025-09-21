const loadingText = document.getElementById('loadingText');
const loadingPhrases = [
  "🔄 جاري تحميل البيانات...",
  "🗺️ تجهيز الخريطة...",
  "🌟 تحميل البيوت المفضلة...",
  "🏠 تحميل البيوت الخاصة بك...",
  "💡 تجهيز الواجهة..."
];
let phraseIndex = 0;
setInterval(() => {
  if (loadingText) {
    loadingText.textContent = loadingPhrases[phraseIndex];
    phraseIndex = (phraseIndex + 1) % loadingPhrases.length;
  }
}, 2000);