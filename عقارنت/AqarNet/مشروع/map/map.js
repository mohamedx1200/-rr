// ---------------------- المتغيرات المصدرة ----------------------
export let selectedLatLng = null;
export let houseMarkers = [];
export let usingMapLocation = false;
export let previewMarker = null;
export let userMarker = null;
let accuracyCircle = null;
let lastStatus = null;
let watchId = null;
let retryCount = 0;
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000;

// ---------------------- متغيرات التحكم بالطبقات ----------------------
let currentBaseLayer = null;
const mapLayers = {
    street: null,
    satellite: null,
    terrain: null
};

// ---------------------- متغيرات عناصر التحكم ----------------------
let controlContainer = null;

// ---------------------- إعداد الخريطة ----------------------
export const map = L.map('map', {
  minZoom: 4,
  maxZoom: 18,
  worldCopyJump: true,
  zoomControl: false,        // إلغاء زر +/-
  attributionControl: false  // إلغاء الرابط أسفل الخريطة
}).setView([33.5138, 36.2765], 17);

// ---------------------- عند الضغط على الخريطة ----------------------
map.on('click', (e) => {
  if (!usingMapLocation) return;
  selectedLatLng = e.latlng;

  if (previewMarker) {
    map.removeLayer(previewMarker);
  }

  const purpleIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  previewMarker = L.marker([e.latlng.lat, e.latlng.lng], { icon: purpleIcon }).addTo(map);
  document.getElementById('confirmModal').style.display = 'flex';
});

// ---------------------- إنشاء/تحديث مؤشر المستخدم والدائرة ----------------------
function updateUserLocation(position) {
  const userLatLng = [position.coords.latitude, position.coords.longitude];

  if (userMarker) {
    map.removeLayer(userMarker);
    userMarker = null;
  }

  const customIcon = L.icon({
    iconUrl: '../المأشرات/مأشر موقعي.png',
    iconSize: [50, 50],
    iconAnchor: [25, 25]
  });

  userMarker = L.marker(userLatLng, {
    icon: customIcon,
    title: 'موقعي الحالي',
    riseOnHover: true
  }).addTo(map);

  userMarker.on('click', function() {
    map.flyTo(userLatLng, 17, { animate: true, duration: 1.5 });
  });

  if (!accuracyCircle) {
    accuracyCircle = L.circle(userLatLng, {
      radius: position.coords.accuracy,
      color: '#0389f7',
      fillColor: '#0389f7',
      fillOpacity: 0.2,
      interactive: false,
      bubblingMouseEvents: false
    }).addTo(map);
  } else {
    accuracyCircle.setLatLng(userLatLng).setRadius(position.coords.accuracy);
  }

  lastStatus = "ok";
  retryCount = 0;
}

// ---------------------- إزالة مؤشر المستخدم والدائرة ----------------------
function removeUserLocation() {
  if (userMarker) {
    map.removeLayer(userMarker);
    userMarker = null;
  }
  if (accuracyCircle) {
    map.removeLayer(accuracyCircle);
    accuracyCircle = null;
  }
  lastStatus = "error";
}

// ---------------------- بدء/إيقاف مراقبة الموقع ----------------------
export function startWatchingLocation() {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }

  watchId = navigator.geolocation.watchPosition(
    (position) => {
      updateUserLocation(position);
    },
    (error) => {
      handleLocationError();
    },
    { enableHighAccuracy: true, maximumAge: 0, timeout: Infinity }
  );
}

// ---------------------- التعامل مع أخطاء الموقع ----------------------
function handleLocationError() {
  removeUserLocation();
  
  if (retryCount < MAX_RETRIES) {
    retryCount++;
    setTimeout(() => {
      startWatchingLocation();
    }, RETRY_DELAY);
  }
}

export function stopWatchingLocation() {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
  removeUserLocation();
  retryCount = 0;
}

// ---------------------- دالة تغيير نوع الخريطة ----------------------
// ---------------------- دالة تغيير نوع الخريطة ----------------------
function changeMapType(mapType) {
    
    if (currentBaseLayer) {
        map.removeLayer(currentBaseLayer);
    }
    
    switch(mapType) {
        case 'street':
            mapLayers.street.addTo(map);
            currentBaseLayer = mapLayers.street;
            break;
        case 'satellite':
            mapLayers.satellite.addTo(map);
            currentBaseLayer = mapLayers.satellite;
            break;
        case 'terrain':
            mapLayers.terrain.addTo(map);
            currentBaseLayer = mapLayers.terrain;
            break;
        default:
            mapLayers.street.addTo(map);
            currentBaseLayer = mapLayers.street;
    }
    
    // ✅ حفظ آخر اختيار في التخزين المحلي
    localStorage.setItem("selectedMapType", mapType);

    // ✅ إصلاح الخطأ - التحقق من وجود controlContainer قبل استخدامه
    if (controlContainer) {
        controlContainer.classList.remove('active');
    }
}


// ---------------------- تهيئة الخريطة ----------------------
function initializeMap() {
    // طبقات الخريطة
    mapLayers.street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    });
    
    mapLayers.satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; Esri, Maxar, Earthstar Geographics'
    });
    
    mapLayers.terrain = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenTopoMap contributors'
    });

    // ✅ استرجاع الاختيار المحفوظ أو افتراضي street
    const savedType = localStorage.getItem("selectedMapType") || "street";
    changeMapType(savedType);

    // ضبط الراديو الصحيح حسب المحفوظ
    const savedRadio = document.getElementById(`map-${savedType}`);
    if (savedRadio) {
        savedRadio.checked = true;
    }

    // إزالة عنصر التحكم الافتراضي لـ Leaflet إذا كان موجوداً
    const oldControl = document.querySelector('.leaflet-control-layers');
    if (oldControl) {
        oldControl.remove();
    }

    // عناصر التحكم
    const zoom = document.querySelector('.leaflet-control-zoom');
    if (zoom) {
        const zoomWrapper = document.createElement('div');
        zoomWrapper.classList.add('map-zoom-controls');
        zoom.parentNode.insertBefore(zoomWrapper, zoom);
        zoomWrapper.appendChild(zoom);
    }

    // ✅ تعريف controlContainer هنا
    controlContainer = document.querySelector('.custom-layers-control');

    // محاولة الحصول على الموقع أول مرة
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                updateUserLocation(position);
                map.flyTo([position.coords.latitude, position.coords.longitude], 17);
                startWatchingLocation();
            },
            () => {
                map.setView([33.5138, 36.2765], 17);
                startWatchingLocation();
            },
            { enableHighAccuracy: true, maximumAge: 0, timeout: Infinity }
        );
    } else {
        console.log("Geolocation not supported.");
        map.setView([33.5138, 36.2765], 17);
    }

    // إعداد event listeners للتحكم بالخريطة
    setupMapControlListeners();
}

// ---------------------- إعداد event listeners للتحكم بالخريطة ----------------------
function setupMapControlListeners() {
    const controlIcon = document.querySelector('.control-icon');

    if (controlIcon && controlContainer) {
        controlIcon.addEventListener('click', function(event) {
            event.stopPropagation();
            controlContainer.classList.toggle('active');
        });

        document.addEventListener('click', function(event) {
            if (controlContainer && !controlContainer.contains(event.target)) {
                controlContainer.classList.remove('active');
            }
        });

        const controlContent = controlContainer.querySelector('.control-content');
        if (controlContent) {
            controlContent.addEventListener('click', function(event) {
                event.stopPropagation();
            });
        }

        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && controlContainer) {
                controlContainer.classList.remove('active');
            }
        });

        document.querySelectorAll('.map-type-item input').forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.checked) {
                    changeMapType(this.value);
                }
            });
        });

        const defaultRadio = document.getElementById('map-street');
        if (defaultRadio) {
            defaultRadio.checked = true;
        }
    } else {
        console.warn('⚠️ عناصر التحكم بالخريطة غير موجودة');
    }
}

// ---------------------- دوال التحكم ----------------------
export function setPreviewMarker(marker) {
  previewMarker = marker;
}

export function getPreviewMarker() {
  return previewMarker;
}

export function getUsingMapLocation() {
  return usingMapLocation;
}

export function setUsingMapLocation(value) {
  usingMapLocation = value;
}

export function centerMap(lat, lng, zoom = 17) {
  map.flyTo([lat, lng], zoom, { animate: true, duration: 1.5 });
}

export function addMarker(location, iconOptions = {}) {
  const marker = L.marker(location, iconOptions).addTo(map);
  return marker;
}

export function setSelectedLatLng(value) {
  selectedLatLng = value;
}

export function getSelectedLatLng() {
  return selectedLatLng;
}

// تهيئة الخريطة بعد التأكد من تحميل DOM
document.addEventListener('DOMContentLoaded', initializeMap);