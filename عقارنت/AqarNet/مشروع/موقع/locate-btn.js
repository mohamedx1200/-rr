import { map, addMarker } from '../map/map.js';

const locateBtn = document.getElementById("locate-btn");

// تحقق من وجود الزر
if (!locateBtn) {
  console.error("لم يتم العثور على زر تحديد الموقع!");
}

// إعداد الصور
const LOCATE_IMAGE = "../المأشرات/locate.png";
const NO_LOCATION_IMAGE = "../المأشرات/no-location.png";

// تغيير صورة الزر
function setLocateButtonImage(src, alt, width = 32, height = 32) {
  locateBtn.innerHTML = `<img src="${src}" alt="${alt}" style="width:${width}px;height:${height}px;">`;
}

// متغيرات التتبع
let lastStatus = null;
let lastPosition = null;
let userMarker = null;
let watchId = null;

// إنشاء/تحديث علامة المستخدم
function updateUserMarker(lat, lng) {
  // إزالة العلامة القديمة إن وجدت
  if (userMarker) {
    map.removeLayer(userMarker);
  }

  // إنشاء علامة جديدة
  userMarker = addMarker([lat, lng], {
    icon: L.icon({
      iconUrl: '../المأشرات/مأشر موقعي.png',
      iconSize: [50, 50],
      iconAnchor: [25, 25]
    }),
    title: 'موقعي الحالي'
  });

  // إمكانية النقر للانتقال للموقع
  userMarker.on('click', () => {
    map.flyTo([lat, lng], 17, { animate: true, duration: 1.5 });
  });
}

// بدء مراقبة الموقع
function startWatchingLocation() {
  // إيقاف أي مراقبة سابقة
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
  }

  watchId = navigator.geolocation.watchPosition(
    (position) => {
      const newPosition = [position.coords.latitude, position.coords.longitude];
      lastPosition = newPosition;
      updateUserMarker(...newPosition);
      
      if (lastStatus !== "ok") {
        setLocateButtonImage(LOCATE_IMAGE, "موقعي", 50, 50);
        lastStatus = "ok";
      }
    },
    (error) => {
      // console.error("خطأ في تحديد الموقع:", error.message);
      lastPosition = null;
      
      if (userMarker) {
        map.removeLayer(userMarker);
        userMarker = null;
      }
      
      if (lastStatus !== "error") {
        setLocateButtonImage(NO_LOCATION_IMAGE, "تعذر تحديد الموقع");
        lastStatus = "error";
      }
      
      // إعادة المحاولة بعد 5 ثواني
      setTimeout(startWatchingLocation, 5000);
    },
    { 
      enableHighAccuracy: true, 
      maximumAge: 0, 
      timeout: 5000 // تغيير من Infinity إلى 5 ثواني
    }
  );
}

// عند الضغط على الزر
locateBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    setLocateButtonImage(NO_LOCATION_IMAGE, "غير مدعوم");
    return;
  }

  if (lastPosition) {
    // إذا كان لدينا موقع مخزن، انتقل إليه
    map.flyTo(lastPosition, 17, { animate: true, duration: 1.5 });
  } else {
    // إذا لم يكن لدينا موقع، حاول الحصول على موقع جديد
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newPosition = [position.coords.latitude, position.coords.longitude];
        lastPosition = newPosition;
        updateUserMarker(...newPosition);
        map.flyTo(newPosition, 17, { animate: true, duration: 1.5 });
        setLocateButtonImage(LOCATE_IMAGE, "موقعي", 50, 50);
        lastStatus = "ok";
      },
      (error) => {
        console.error("خطأ في تحديد الموقع:", error.message);
        setLocateButtonImage(NO_LOCATION_IMAGE, "تعذر تحديد الموقع");
        lastStatus = "error";
      },
      { enableHighAccuracy: true, timeout: Infinity }
    );
  }
});

// بدء التشغيل
if (navigator.geolocation) {
  startWatchingLocation();
} else {
  setLocateButtonImage(NO_LOCATION_IMAGE, "غير مدعوم");
}