import { auth, db, doc, getDoc, setDoc, updateDoc, increment, storage, ref, uploadBytes, getDownloadURL } from '../../firebase.js';
import { hideAllPopups } from '../UI/ui.js';
import { map, getPreviewMarker, setPreviewMarker, selectedLatLng, setSelectedLatLng, setUsingMapLocation, houseMarkers } from '../map/map.js';
import { showCustomAlert } from '../UI/showCustomAlert.js';
import { loadHouses, getMarkerIcon } from '../download/load-houses.js';
import { renderHouseOnMap } from './house-details/house-details.js';

let selectedImages = [];

propertyImages.addEventListener('change', () => {
  const files = Array.from(propertyImages.files).slice(0, 10);

  files.forEach(file => {
    if (!selectedImages.some(f => f.name === file.name)) {
      selectedImages.push(file);
    }
  });

  selectedCount.textContent = selectedImages.length;

  previewContainer.innerHTML = '';
  selectedImages.forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.style.width = '100px';
      img.style.height = '100px';
      img.style.objectFit = 'cover';
      img.style.margin = '5px';
      previewContainer.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
});

const toggleSidebarBtn = document.getElementById('toggleSidebar');
const houseForm = document.getElementById('houseForm');
const saveDraftBtn = document.getElementById('saveDraftBtn');

// دالة لإزالة الإيموجي من النص
const removeEmojis = (text) => {
  if (!text) return text;
  return text.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim();
};

const sanitizeInput = (input) => {
  if (!input) return input;
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

const showUploadProgress = (message, duration = 2000) => {
  let progressContainer = document.getElementById('upload-progress-container');
  
  if (!progressContainer) {
    progressContainer = document.createElement('div');
    progressContainer.id = 'upload-progress-container';
    progressContainer.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: white;
      padding: 10px 20px;
      border-radius: 8px;
      box-shadow: 0 0 15px rgba(0,0,0,0.2);
      z-index: 1000;
      font-family: Arial, sans-serif;
      max-width: 300px;
    `;
    document.body.appendChild(progressContainer);
  }

  progressContainer.innerHTML = message;
  
  if (duration > 0) {
    setTimeout(() => {
      progressContainer.remove();
    }, duration);
  } 

  return progressContainer;
};

async function savePropertyData(isDraft = false) {
  const progressContainer = showUploadProgress('جاري حفظ البيانات...', 0);

  try {
    const formData = new FormData(houseForm);
    const user = auth.currentUser;
    
    if (!user) {
      showCustomAlert("يجب تسجيل الدخول أولاً");
      progressContainer.remove();
      return false;
    }
    
    const propertyTypeWithEmoji = document.getElementById('selectedTitle')?.textContent?.trim();
    if (!propertyTypeWithEmoji) {
      showCustomAlert("الرجاء تحديد نوع العقار");
      progressContainer.remove();
      return false;
    }

    // نزع الإيموجي من نوع العقار قبل الحفظ
    const propertyType = removeEmojis(propertyTypeWithEmoji);

    const requiredFields = document.querySelectorAll('[data-required="true"]');
    for (let field of requiredFields) {
      const isVisible = field.offsetParent !== null;
      const value = field.value?.trim();

      if (isVisible && (!value || value === '')) {
        showCustomAlert(`الرجاء ملء الحقل: ${field.getAttribute('name') || field.id}`);
        progressContainer.remove();
        field.scrollIntoView({ behavior: 'smooth', block: 'center' });
        field.style.border = '2px solid red';
        return false;
      }
    }

    const data = {
      addedBy: user.uid,
      addedAt: Date.now(),
      propertyType, // هنا يتم حفظ نوع العقار بدون إيموجي
      status: isDraft ? 'draft' : 'active'
    };

    const allFields = [
      'dealType', 'totalArea', 'builtArea', 'floors', 'finishingLevel',
      'phone', 'countryCode', 'price', 'currency', 'paymentMethod',
      'rentDuration', 'mortgageDuration', 'description', 'rooms', 
      'livingRooms', 'kitchens', 'bathrooms', 'toilets'
    ];

    allFields.forEach(field => {
      const value = formData.get(field);
      if (value) {
        if (['totalArea', 'builtArea', 'floors', 'price'].includes(field)) {
          data[field] = Number(value);
        } else {
          data[field] = sanitizeInput(value);
        }
      }
    });

    if (selectedLatLng?.lat && selectedLatLng?.lng) {
      data.lat = selectedLatLng.lat;
      data.lng = selectedLatLng.lng;
    }

    const features = [];
    document.querySelectorAll('#featureDropdown input[type="checkbox"]:checked').forEach(checkbox => {
      features.push(checkbox.value);
    });
    if (features.length > 0) {
      data.features = features;
    }

    const dynamicRoomFields = ['rooms', 'livingRooms', 'kitchens', 'bathrooms', 'toilets'];
    dynamicRoomFields.forEach((type) => {
      const count = parseInt(formData.get(type)) || 0;
      const sizes = [];
      for (let i = 1; i <= count; i++) {
        const sizeValue = formData.get(`${type}_size_${i}`);
        if (sizeValue) {
          sizes.push(Number(sizeValue));
        }
      }
      if (sizes.length > 0) {
        data[`${type}Sizes`] = sizes;
      }
    });

    const counterRef = doc(db, "meta", "counters");
    const counterSnap = await getDoc(counterRef);
    let houseNumber = 1;
    if (counterSnap.exists()) {
      houseNumber = (counterSnap.data().houseCount || 0) + 1;
    }
    const houseName = `A${houseNumber}`;
    data.houseName = houseName;

    const imageUrls = [];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxFileSize = 5 * 1024 * 1024;

    if (selectedImages.length > 0) {
      showUploadProgress('جاري رفع الصور...', 0);
      for (let i = 0; i < selectedImages.length; i++) {
        const file = selectedImages[i];

        if (!allowedTypes.includes(file.type)) {
          console.warn(`تم تجاهل الملف ${file.name}: النوع غير مسموح`);
          continue;
        }
        if (file.size > maxFileSize) {
          console.warn(`تم تجاهل الملف ${file.name}: الحجم أكبر من الحد المسموح`);
          continue;
        }

        try {
          const storageRef = ref(storage, `houses/${houseName}/${Date.now()}_${file.name}`);
          const snapshot = await uploadBytes(storageRef, file);
          const url = await getDownloadURL(snapshot.ref);
          imageUrls.push(url);
        } catch (uploadError) {
          console.error(`Error uploading ${file.name}:`, uploadError);
        }
      }

      if (imageUrls.length > 0) {
        data.images = imageUrls;
      }
    }

    await Promise.all([
      setDoc(doc(db, "houses", houseName), data),
      updateDoc(counterRef, {
        houseCount: increment(1),
        [isDraft ? 'draftCount' : 'activeCount']: increment(1)
      }),
    ]);

    document.getElementById('formContainer').style.display = 'none';
    if (toggleSidebarBtn) toggleSidebarBtn.style.display = 'block';
    
    setUsingMapLocation(false);
    setSelectedLatLng(null);
    const marker = getPreviewMarker();
    if (marker) {
      map.removeLayer(marker);
      setPreviewMarker(null);
    }
    
    houseForm.reset();
    hideAllPopups();
    
    const selectedTitle = document.getElementById('selectedTitle');
    if (selectedTitle) {
      selectedTitle.textContent = '';
      selectedTitle.style.display = 'none';
    }
    
    document.getElementById('villaFields').style.display = 'none';
    document.querySelector('.main-category-list').style.display = 'block';
    
    document.querySelectorAll('.category-item.selected').forEach(item => {
      item.classList.remove('selected');
    });

    showCustomAlert(`تم ${isDraft ? 'حفظ المسودة' : 'نشر العقار'} بنجاح باسم: ${houseName}`, '#4CAF50');
    showUploadProgress(`تم ${isDraft ? 'حفظ المسودة' : 'النشر'} بنجاح`, 2000);

    const newHouseData = { ...data, houseName };
    renderHouseOnMap(newHouseData);

    if (auth.currentUser) {
      window.userReactions.liked = window.userReactions.liked || [];
      window.userReactions.viewed = window.userReactions.viewed || [];
      window.userReactions.later = window.userReactions.later || [];
      window.housesMap[newHouseData.houseName] = newHouseData;
    }

    const targetMarker = houseMarkers[newHouseData.houseName];
    if (targetMarker) {
      const icon = getMarkerIcon(newHouseData.houseName);
      targetMarker.setIcon(icon);
    } 

    map.setView([data.lat, data.lng], 17);
    houseMarkers[houseName].openPopup();

    return true;
  } catch (err) {
    console.error("خطأ أثناء الحفظ:", err);
    let errorMessage = "حدث خطأ أثناء الحفظ، يرجى المحاولة لاحقًا";
    
    if (err.code === 'storage/unauthorized') {
      errorMessage = "ليس لديك صلاحية رفع الملفات";
    } else if (err.code === 'storage/retry-limit-exceeded') {
      errorMessage = "فشل رفع الملفات بسبب مشكلة في الشبكة";
    } else if (err.code === 'permission-denied') {
      errorMessage = "ليس لديك صلاحية إضافة عقارات";
    }
    
    showCustomAlert(errorMessage);
    showUploadProgress('فشل عملية الحفظ', 2000);
    return false;
  }
}

houseForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  await savePropertyData(false);
});

saveDraftBtn?.addEventListener('click', async (e) => {
  e.preventDefault();
  await savePropertyData(true);
});

document.querySelectorAll('.category-item').forEach(item => {
  item.addEventListener('click', function() {
    document.querySelectorAll('.category-item').forEach(el => {
      el.classList.remove('selected');
    });
    this.classList.add('selected');
    
    // عرض النص مع الإيموجي في الواجهة فقط
    document.getElementById('selectedTitle').textContent = this.textContent;
    document.getElementById('selectedTitle').style.display = 'block';
    document.getElementById('villaFields').style.display = 'block';
  });
});