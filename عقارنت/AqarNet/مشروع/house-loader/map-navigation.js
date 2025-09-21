import { houseMarkers,map } from '../map/map.js';
import { showCustomAlert } from '../UI/showCustomAlert.js';
import { hideAllPopups } from '../UI/ui.js'; // تأكد من المسار

window.goToHouseOnMap = function(houseId) {
  const marker = houseMarkers[houseId];
  if (marker) {
    map.setView(marker.getLatLng(), 17);
    marker.openPopup();
    // ✅ إغلاق النوافذ والتعتيم
    hideAllPopups();
  } else {
    showCustomAlert("لا يمكن عرض هذا البيت الآن على الخريطة.");
  }
};