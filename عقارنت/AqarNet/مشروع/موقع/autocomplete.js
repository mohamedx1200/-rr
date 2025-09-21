// تعريف الدالة في النطاق العام (window)
import { map } from '../map/map.js';
window.initAutocomplete = function() {
  const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const input = document.getElementById("placeSearchInput");
  if (!input) return;

  const autocomplete = new google.maps.places.Autocomplete(input, {
    fields: ["geometry"]
  });

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (!place.geometry?.location) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    if (window.lastMarker) map.removeLayer(window.lastMarker);
    
    map.setView([lat, lng], 17);
    window.lastMarker = L.marker([lat, lng], { icon: redIcon }).addTo(map);
  });
};
// إغلاق القائمة الجانبية عند الضغط على حقل البحث في الشاشات الصغيرة
document.getElementById('placeSearchInput').addEventListener('click', function() {
  if (window.innerWidth <= 968) { // للشاشات الصغيرة فقط
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.remove('open');
    sidebar.classList.add('closed');
    
    // إخفاء زر القائمة إذا كنت تريد ذلك
    const toggleSidebarBtn = document.getElementById('toggleSidebar');
    if (toggleSidebarBtn) toggleSidebarBtn.style.display = 'block';
  }
});