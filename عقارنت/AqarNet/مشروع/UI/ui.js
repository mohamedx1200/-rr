import { auth } from '../../firebase.js';
import { showCustomAlert } from './showCustomAlert.js';
import { map, getPreviewMarker, setPreviewMarker, setUsingMapLocation,setSelectedLatLng } from '../map/map.js';
import { initSidebar } from './sidebar.js';
initSidebar(); // ← يشغّل كل كود القائمة الجانبية
let isFavoritesLoaded = false;

export function showPopup(popupId) {
  const overlay = document.getElementById('overlay');
  if (overlay) overlay.style.display = 'block';

  const popup = document.getElementById(popupId);
  if (popup) popup.style.display = 'block';
}

export function hideAllPopups() {
  const overlay = document.getElementById('overlay');
  if (overlay) overlay.style.display = 'none';

  toggleSidebar.style.display = 'block';

  const currentMarker = getPreviewMarker();
  if (currentMarker) {
    map.removeLayer(currentMarker);
    setPreviewMarker(null);
  }

  document.querySelectorAll('.popup, #favoritesList, #myHousesList').forEach(popup => {
    popup.style.display = 'none';
  });
}

// ✅ تفعيل الوضع الليلي والنهاري



// ✅ تقليب الصور
window.nextImage = function (id) {
  const img = document.getElementById(`${id}-img`);
  const images = JSON.parse(img.dataset.images);
  let index = (parseInt(img.dataset.index) + 1) % images.length;
  img.src = images[index];
  img.dataset.index = index;
};

// ✅ زر التفاعل مع الصور
document.addEventListener("click", function (e) {
  const btn = e.target.closest(".reaction-btn");
  if (!btn) return;
  btn.classList.add("pressed");
  setTimeout(() => {
    btn.classList.remove("pressed");
  }, 150);
});

// ✅ عند الضغط على التعتيم
document.getElementById("overlay").addEventListener("click", hideAllPopups);

// ✅ الكود الرئيسي
window.onload = () => {
  // زر "إضافة بيت"
  document.getElementById("addHouseBtn").addEventListener("click", () => {
    if (!auth.currentUser) {
      showCustomAlert("❗ يجب تسجيل الدخول لإضافة بيت");
      return;
    }

    hideAllPopups();
    locationChoice.style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
  });

  // زر "المفضلة"
document.getElementById("favBtn").addEventListener("click", async (e) => {
  e.preventDefault();

  if (!auth.currentUser) {
    showCustomAlert("❗ يجب تسجيل الدخول لعرض المفضلة");
    hideAllPopups();
    return;
  }

  hideAllPopups();
  showPopup("favoritesList");

  // ✅ تحميل البيانات مرة واحدة فقط
  if (!isFavoritesLoaded) {
    isFavoritesLoaded = true;
  }
});



  // زر "بيوتي"
document.getElementById("myHousesBtn").addEventListener("click", () => {
    if (!auth.currentUser) {
        showCustomAlert("❗ يجب تسجيل الدخول لعرض بيوتك");
        return;
    }

    hideAllPopups();
    showPopup("myHousesList"); // فقط افتح القائمة
    // لا تضع هنا دائرة التحميل
});






  // أزرار الإغلاق داخل النوافذ
  document.getElementById("closeFavoritesBtn").addEventListener("click", hideAllPopups);
  document.getElementById("closeMyHousesBtn").addEventListener("click", hideAllPopups);
};
