import { map, setUsingMapLocation, setSelectedLatLng, setPreviewMarker, previewMarker } from '../map/map.js';

// ✅ دالة لتشغيل كل كود القائمة الجانبية
export function initSidebar() {
  const sidebar = document.getElementById('sidebar'); 
  const toggleSidebarBtn = document.getElementById('toggleSidebar');

  // زر إظهار/إخفاء القائمة الجانبية
  toggleSidebarBtn.addEventListener('click', () => {
    sidebar.classList.toggle('closed');
  });

  // إغلاق القائمة تلقائيًا على الشاشات الصغيرة عند الضغط على الخريطة
  map.addEventListener("click", () => {
    if (window.innerWidth <= 768) {
      sidebar.classList.remove("open");
    }
  });

  // دعم السحب لليمين لإغلاق الشريط الجانبي
  let touchStartX = 0;
  let touchEndX = 0;

  document.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });
  document.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;
    if (swipeDistance > 100 && window.innerWidth <= 768) {
      sidebar.classList.remove("open");
    }
  }

  // إغلاق الشريط الجانبي مبدئيًا على الشاشات الصغيرة
  if (window.innerWidth <= 768) {
    sidebar.classList.add("closed");
  }

  // عند تحميل الصفحة
  window.addEventListener('DOMContentLoaded', () => {
    // تفعيل القائمة تلقائيًا على الشاشات الكبيرة
    const sideBarToggle = document.querySelector('.sidebar-toggle');
    if (window.innerWidth >= 1024) {
      sidebar.classList.add('active');
      if (sideBarToggle) sideBarToggle.classList.add('active');
    }

    // التعامل مع النقر على الخلفية
    const formContainer = document.getElementById('formContainer');
    const closeFormBtn = document.getElementById('closeFormBtn');
    const overlay = document.getElementById('overlay');
    
if (overlay) {
  overlay.addEventListener('click', () => {
    // 1. إخفاء العناصر الأساسية
    if (toggleSidebarBtn) toggleSidebarBtn.style.display = 'block';
    if (formContainer) formContainer.style.display = 'none';
    filterdiv.style.display = 'none';
    overlay.style.display = 'none';
    // 3. إعادة تعيين الخريطة
    if (typeof setUsingMapLocation === 'function') setUsingMapLocation(false);
    if (typeof setSelectedLatLng === 'function') setSelectedLatLng(null);

    // 4. تنظيف العلامات على الخريطة
    if (typeof previewMarker !== 'undefined' && previewMarker && map) {
      map.removeLayer(previewMarker);
      if (typeof setPreviewMarker === 'function') setPreviewMarker(null);
    }

    // 5. إعادة تعيين النموذج
    const houseForm = document.getElementById('houseForm');
    if (houseForm) houseForm.reset();

    // 6. إخفاء عنوان العقار
    const selectedTitle = document.getElementById('selectedTitle');
    if (selectedTitle) {
      selectedTitle.textContent = '';
      selectedTitle.style.display = 'none';
    }

    // 7. إخفاء حقول الفيلا
    const villaFields = document.getElementById('villaFields');
    if (villaFields) villaFields.style.display = 'none';

    // 8. إظهار قائمة أنواع العقارات
    const categoryList = document.querySelector('.main-category-list');
    if (categoryList) categoryList.style.display = 'block';

    // 9. إزالة التحديدات
    document.querySelectorAll('.category-item.selected').forEach(item => {
      item.classList.remove('selected');
    });
  });
}

    // التعامل مع زر .menu-toggle
    const toggleBtn = document.querySelector(".menu-toggle");
    const map = document.getElementById("map");

    if (!sidebar || !toggleBtn || !map) {
      console.warn("❗ عنصر مفقود: sidebar أو toggleBtn أو map");
      return;
    }

    // فتح القائمة
    toggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });

    // إغلاق عند الضغط على الخريطة
    map.addEventListener("click", () => {
      if (window.innerWidth <= 768 && sidebar.classList.contains("open")) {
        sidebar.classList.remove("open");
      }
    });

    // سحب لإغلاق القائمة
    document.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (window.innerWidth <= 768 && sidebar.classList.contains("open")) {
        if (touchStartX - touchEndX < -100) {
          sidebar.classList.remove("open");
        }
      }
    });
  });
if (window.innerWidth <= 768) {
  sidebar.classList.add("closed");
} else {
  sidebar.classList.remove("closed");
  sidebar.classList.add("active"); // لو عندك كلاس 'active' لفتح الجانبية
}

  document.getElementById('sidebar').classList.remove('show');
}
