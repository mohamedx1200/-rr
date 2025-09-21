import {usingMapLocation,map,setSelectedLatLng,previewMarker,setPreviewMarker,setUsingMapLocation,} from '../map/map.js' ;
import {hideAllPopups} from '../UI/ui.js';

const chooseMapBtn = document.getElementById("chooseMap");

if (chooseMapBtn) {
  chooseMapBtn.addEventListener("click", () => {
    // 🧹 إغلاق النوافذ
    hideAllPopups();

    // 🧭 تفعيل وضع تحديد الموقع من الخريطة
    setUsingMapLocation(true);

    // 🧍‍♂️ إخفاء واجهات أخرى
    const searchBar = document.getElementById("search-bar");
    if (searchBar) searchBar.style.display = "none";

    if (locationChoice) locationChoice.style.display = 'none';

    // 📦 إغلاق الشريط الجانبي
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.classList.add('closed');
      sidebar.classList.remove('open');
    }

    const toggleSidebarBtn = document.getElementById('toggleSidebar');
    if (toggleSidebarBtn) toggleSidebarBtn.style.display = 'none';

    // ✅ إظهار زر التأكيد
    const confiBtn = document.getElementById('confi');
    if (confiBtn) confiBtn.classList.add('show');

    // 🗺️ أضف حدث النقر على الخريطة (مرة واحدة فقط)
    map.on('click', async (e) => {
      if (!usingMapLocation) return;

      setSelectedLatLng(e.latlng); 

      // إزالة المؤشر القديم إذا موجود
      if (previewMarker) {
        map.removeLayer(previewMarker);
      }

      // إنشاء المؤشر الجديد
      const grayIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      const marker = L.marker([e.latlng.lat, e.latlng.lng], { icon: grayIcon }).addTo(map);
      setPreviewMarker(marker);
    });
  });
}
