import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { auth } from '../firebase.js'; // أو حسب مكان ملف firebase عندك
import { loadFavoriteHouses } from './house-loader/load-favorites.js';
import { loadMyHouses } from './house-loader/load-my-houses.js';
import { loadHouses } from './download/load-houses.js';
import {showCustomAlert} from './UI/showCustomAlert.js';
import { toggleHouseReaction } from './download/reactions.js'

let loginBtn, logoutBtn;


document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }
});



export function initAuth() {
onAuthStateChanged(auth, async (user) => {
  const userName = document.getElementById('userName');
  const userPic = document.getElementById('userPic');
  
  // تهيئة العناصر بعد تحميل DOM
loginBtn = document.getElementById('loginBtn');
logoutBtn = document.getElementById('logoutBtn');
await loadMyHouses();
await loadFavoriteHouses();

  if (!user) {    
    if (userName) userName.textContent = "زائر";
    if (userPic) userPic.src = "../صور/default-guest.png";
    
    // إظهار زر تسجيل الدخول وإخفاء زر تسجيل الخروج
    if (loginBtn) loginBtn.style.display = 'block';
    if (logoutBtn) logoutBtn.style.display = 'none';
    await loadHouses();
    
    document.getElementById("loaderScreen").style.display = "none";
    return;
  }

  // ✅ المستخدم موجود – عرض بياناته
  if (userName) userName.textContent = user.displayName || "بدون اسم";
  if (userPic) userPic.src = user.photoURL || "صور/default-guest.png";

  // إظهار زر تسجيل الخروج وإخفاء زر تسجيل الدخول
  if (loginBtn) loginBtn.style.display = 'none';
  if (logoutBtn) logoutBtn.style.display = 'block';


  // ✅ تحميل البيانات
  await loadHouses();

  // ✅ إخفاء شاشة التحميل
  document.getElementById("loaderScreen").style.display = "none";

  // ✅ تطبيق التفاعلات المعلقة
  const pending = JSON.parse(localStorage.getItem('dalPendingReactions') || '[]');
  for (const { houseId, type } of pending) {
    await toggleHouseReaction(houseId, type);
  }
});
}

window.logout = async function () {
  try {
    await auth.signOut();
    localStorage.removeItem('dalPendingReactions');
    
    // التعديل هنا
    if (myHousesUnsubscribe && typeof myHousesUnsubscribe === 'function') {
      myHousesUnsubscribe();
    }
    
    window.location.reload();
  } catch (err) {
    console.error("❌ خطأ أثناء تسجيل الخروج:", err);
    showCustomAlert("حدث خطأ أثناء تسجيل الخروج.");
  }
};


document.getElementById("loginBtn").addEventListener("click", () => {
  window.location.href = "../public/login.html"; // ✏️ غيّر اسم الصفحة حسب ما تريد
});