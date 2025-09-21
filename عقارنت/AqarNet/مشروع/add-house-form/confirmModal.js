import { map, getPreviewMarker,setPreviewMarker,setUsingMapLocation } from '../map/map.js';

// زر نعم
document.getElementById('confirmYes').addEventListener('click', () => {
  document.getElementById('formContainer').style.display = 'block';
  document.getElementById('confirmModal').style.display = 'none';
  setUsingMapLocation(false); // ✅ بدلًا من usingMapLocation = false;
  document.getElementById("search-bar").style.display = "block";
  document.getElementById('overlay').style.display = 'block';
  document.getElementById('confi').classList.remove('show');
  document.getElementById('formContainer').style.display = 'block';
    setUsingMapLocation(false);
});

// زر إلغاء
document.getElementById('confirmCancel').addEventListener('click', () => {
  document.getElementById('confirmModal').style.display = 'none';
  showSidebarToggleBtn(); // ✅ إظهار الزر عند الإلغاء
  document.getElementById('confi').classList.remove('show');
  document.getElementById("search-bar").style.display = "block";

  // حذف المؤشر المؤقت إن وُجد
const currentMarker = getPreviewMarker();
if (currentMarker) {
  map.removeLayer(currentMarker);
  setPreviewMarker(null);
}


  // تعطيل إمكانية تحديد بيت من الخريطة
  setUsingMapLocation(false); // ✅ بدلًا من usingMapLocation = false;
});

function showSidebarToggleBtn() {
  const toggleBtn = document.querySelector(".menu-toggle");
  if (toggleBtn) toggleBtn.style.display = "block";
}
// 
