// --------------- 🔐 استيراد مصادقة وبيانات Firebase ---------------
import { initAuth } from './auth.js';
initAuth(); // تهيئة متابعة حالة تسجيل الدخول
// --------------- 🧩 الواجهة والتنبيهات ---------------
import { showCustomAlert } from './UI/showCustomAlert.js';
import { hideAllPopups } from './UI/ui.js';
import { toggleHouseReaction } from './download/reactions.js';
// ==========================================================
// --------------- 💡 عناصر واجهة المستخدم (DOM Elements) ---------------
const addHouseBtn = document.getElementById('addHouseBtn');
const locationChoice = document.getElementById('locationChoice');
const chooseMap = document.getElementById('chooseMap');
const formContainer = document.getElementById('formContainer');
const typeSelect = document.getElementById('type');
const durationSelect = document.getElementById('duration');
const buildingType = document.getElementById('buildingType');
const floorNumber = document.getElementById('floorNumber');
const houseForm = document.getElementById('houseForm');
const roomImagesInput = document.getElementById('roomImages');
const closeFormBtn = document.getElementById('closeFormBtn');

// --------------- 🧮 دالة تحويل الإحداثيات ---------------
function dmsToDecimal(dms) {
  const regex = /(\d+)[°:\s]+(\d+)[']?[\s](\d+(?:\.\d+)?)[\"]?\s([NSEW])/gi;
  let lat = null, lng = null;
  for (const match of dms.matchAll(regex)) {
    const degrees = parseFloat(match[1]);
    const minutes = parseFloat(match[2]);
    const seconds = parseFloat(match[3]);
    const direction = match[4].toUpperCase();
    const decimal = degrees + minutes / 60 + seconds / 3600;
    if (direction === 'N' || direction === 'S') lat = direction === 'S' ? -decimal : decimal;
    else lng = direction === 'W' ? -decimal : decimal;
  }
  return lat !== null && lng !== null ? [lat, lng] : null;
}

// --------------- 🌐 إعلان دوال عالمية إن احتجتها ---------------
window.toggleHouseReaction = toggleHouseReaction;

// --------------- 💖 إدارة المفضلة ---------------
document.addEventListener("DOMContentLoaded", () => {
  const favBtn = document.getElementById("favBtn");
  const favoritesList = document.getElementById("favoritesList");
  const closeBtn = document.getElementById("closeFavoritesBtn");
  const myHousesList = document.getElementById("myHousesList");

  if (!favBtn || !favoritesList || !closeBtn || !myHousesList) {
    console.error("❗ أحد العناصر المطلوبة غير موجود في DOM");
    return;
  }

  closeBtn.addEventListener("click", () => {
    favoritesList.style.display = "none";
    document.getElementById("overlay").style.display = "none";
  });

  if (window.innerWidth <= 768) {
    favoritesList.classList.add("mobile-style");
  }
});

// --------------- 🏡 إدارة "منازلي" ---------------
document.addEventListener("DOMContentLoaded", () => {
  const myHousesBtn = document.getElementById("myHousesBtn");
  const myHousesList = document.getElementById("myHousesList");
  const favList = document.getElementById("favoritesList");
  const closeMyHousesBtn = document.getElementById("closeMyHousesBtn");

  if (myHousesBtn) {
    myHousesBtn.addEventListener("click", () => {
      hideAllPopups();
    });
  }

  if (closeMyHousesBtn) {
    closeMyHousesBtn.addEventListener("click", () => {
      myHousesList.style.display = "none";
    });
  }
});

// --------------- 📴 تنبيه في حالة انقطاع الإنترنت ---------------
window.addEventListener("offline", () => {
  showCustomAlert("📴 لا يوجد اتصال بالإنترنت. سيتم الحفظ محلياً.");
});
// 
document.querySelectorAll('input[type=number]').forEach(input => {
  input.addEventListener('wheel', event => {
    event.preventDefault(); // منع التغيير
  });
});
// 
document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") {
    e.preventDefault();    // يمنع أي سلوك افتراضي
    e.stopPropagation();   // يمنع وصول الحدث للأكواد الأخرى
    console.log("Esc تم تعطيله");
  }
});
