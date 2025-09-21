import { auth } from '../../../firebase.js';
import { map, houseMarkers } from '../../map/map.js';
import { getMarkerIcon } from '../../download/load-houses.js';

export function renderHouseOnMap(data, id = `popup-${Date.now()}`) {
    if (!data.lat || !data.lng) {
        console.log("بيت بدون إحداثيات:", data.houseName);
        return;
    }

    // تفاعلات المستخدم
    const { liked = [], viewed = [], later = [] } = window.userReactions || {};
    let currentReaction = null;
    if (liked.includes(data.houseName)) currentReaction = 'liked';
    else if (viewed.includes(data.houseName)) currentReaction = 'viewed';
    else if (later.includes(data.houseName)) currentReaction = 'later';

    const user = auth.currentUser;
    const isMine = user && data.addedBy === user.uid;

    // إنشاء محتوى البوب أب
    const popupContent = createPopupContent(data, isMine, currentReaction);

    // إنشاء العلامة على الخريطة
    const marker = L.marker([data.lat, data.lng], {
        icon: getMarkerIcon(data.houseName, data)
    }).addTo(map);
    
    houseMarkers[data.houseName] = marker;

    // ربط المحتوى بالعلامة
    marker.bindPopup(popupContent, { 
        maxWidth: 350,
        minWidth: 280,
        className: 'custom-popup'
    });

    // إعداد معرض الصور عند فتح النافذة المنبثقة
    marker.on('popupopen', () => setupImageGallery(data));
}

// دالة منفصلة لإنشاء محتوى النافذة المنبثقة
function createPopupContent(data, isMine, currentReaction) {
    return `
        <div class="house-popup">
            ${createImageGallery(data)}
            ${createBasicInfo(data)}
            ${createPropertyDetails(data)}
            ${createRoomsInfo(data)}
            ${createDealInfo(data)}
            ${createFeatures(data)}
            ${createContactInfo(data, isMine)}
            ${createDeleteButton(data, isMine)}
            ${createReactionButtons(data, isMine, currentReaction)}
        </div>
    `;
}

// معرض الصور
function createImageGallery(data) {
    if (!data.images || data.images.length === 0) return '';
    
    return `
        <div class="image-gallery-container">
            <div class="gallery-nav">
                <button class="nav-btn prev-btn" id="prev-${data.houseName}">
                    <span class="icon">←</span>
                </button>
                <div class="gallery-image-wrapper">
                    <img src="${data.images[0]}" class="gallery-img" id="gallery-${data.houseName}" 
     style="width: 300px; height: 200px; object-fit: cover;" />

                </div>
                <button class="nav-btn next-btn" id="next-${data.houseName}">
                    <span class="icon">→</span>
                </button>
            </div>
            <div class="gallery-footer">
                <span class="image-counter" id="image-counter-${data.houseName}">1 / ${data.images.length}</span>
            </div>
        </div>
    `;
}

// المعلومات الأساسية
function createBasicInfo(data) {
    return `
        <div class="popup-section">
            <h3 class="property-title">${data.houseName}</h3>
            <div class="property-meta">
                ${data.address ? `<div class="meta-item"><span class="icon">📍</span> ${data.address}</div>` : ''}
                ${data.addedAt ? `<div class="meta-item"><span class="icon">📅</span> ${new Date(data.addedAt).toLocaleDateString()}</div>` : ''}
            </div>
            ${data.description ? `<p class="property-description">${data.description}</p>` : ''}
        </div>
    `;
}

// التفاصيل الفنية
function createPropertyDetails(data) {
    const details = [
        data.propertyType ? `<div class="detail-item"><strong>نوع العقار:</strong> ${data.propertyType}</div>` : '',
        data.totalArea ? `<div class="detail-item"><strong>المساحة:</strong> ${data.totalArea} م²</div>` : '',
        data.builtArea ? `<div class="detail-item"><strong>المساحة المبنية:</strong> ${data.builtArea} م²</div>` : '',
        data.floors ? `<div class="detail-item"><strong>الطوابق:</strong> ${data.floors}</div>` : '',
        data.finishingLevel ? `<div class="detail-item"><strong>التشطيب:</strong> ${data.finishingLevel}</div>` : ''
    ].filter(item => item !== '').join('');

    return details ? `
        <div class="popup-section">
            <h4 class="section-title">تفاصيل العقار</h4>
            <div class="details-grid">${details}</div>
        </div>
    ` : '';
}

// معلومات الغرف
function createRoomsInfo(data) {
    const roomTypes = {
        'rooms': 'غرف النوم',
        'livingRooms': 'غرف المعيشة',
        'kitchens': 'المطابخ',
        'bathrooms': 'الحمامات',
        'toilets': 'دورات المياه'
    };

    const roomsInfo = Object.keys(roomTypes)
        .filter(type => data[`${type}Sizes`] && data[`${type}Sizes`].length > 0)
        .map(type => {
            const sizes = data[`${type}Sizes`].join('م², ') + 'م²';
            return `<div class="room-item"><strong>${roomTypes[type]}:</strong> ${data[`${type}Sizes`].length} غرف (${sizes})</div>`;
        });

    return roomsInfo.length > 0 ? `
        <div class="popup-section">
            <h4 class="section-title">تفاصيل الغرف</h4>
            <div class="rooms-grid">${roomsInfo.join('')}</div>
        </div>
    ` : '';
}

// معلومات الصفقة
function createDealInfo(data) {
    const dealItems = [
        data.dealType ? `<div class="deal-item"><strong>نوع العرض:</strong> ${data.dealType}</div>` : '',
        data.price ? `<div class="deal-item"><strong>السعر:</strong> ${data.price} ${data.currency || ''}</div>` : '',
        data.paymentType ? `<div class="deal-item"><strong>طريقة الدفع:</strong> ${data.paymentType}</div>` : '',
        data.rentDuration ? `<div class="deal-item"><strong>مدة الإيجار:</strong> ${data.rentDuration}</div>` : '',
        data.mortgageDuration ? `<div class="deal-item"><strong>مدة الرهن:</strong> ${data.mortgageDuration}</div>` : ''
    ].filter(item => item !== '').join('');

    return dealItems ? `
        <div class="popup-section">
            <h4 class="section-title">معلومات الصفقة</h4>
            <div class="deal-grid">${dealItems}</div>
        </div>
    ` : '';
}

// المميزات
function createFeatures(data) {
    if (!data.features || data.features.length === 0) return '';
    
    return `
        <div class="popup-section">
            <h4 class="section-title">مميزات العقار</h4>
            <div class="features-list">
                ${data.features.map(feat => `<span class="feature-tag">${feat}</span>`).join('')}
            </div>
        </div>
    `;
}

// معلومات الاتصال
function createContactInfo(data, isMine) {
    const gpsBtn = `<a href="https://maps.google.com/?q=${data.lat},${data.lng}" target="_blank" class="action-btn gps-btn">📍 الذهاب إلى الموقع</a>`;
    
    if (isMine || !data.phone) return gpsBtn;
    
    return `
        <div class="popup-section">
            <h4 class="section-title">الاتصال</h4>
            <div class="contact-info">
                <a href="tel:${data.phone}" class="contact-link">
                    <span class="icon">📞</span> ${data.phone}
                </a>
            </div>
            ${gpsBtn}
        </div>
    `;
}

// زر الحذف
function createDeleteButton(data, isMine) {
    return isMine ? `
        <div class="popup-actions">
            <button onclick="deleteHouse('${data.houseName}')" class="action-btn delete-btn">
                🗑️ حذف العقار
            </button>
        </div>
    ` : '';
}

// أزرار التفاعل
function createReactionButtons(data, isMine, currentReaction) {
    if (isMine) return '';
    
    return `
        <div class="popup-section reaction-section">
            <div class="reaction-group" id="reaction-${data.houseName}">
                <button class="reaction-btn ${currentReaction === 'liked' ? 'active' : ''}" 
                    onclick="toggleHouseReaction('${data.houseName}', 'liked')">
                    <span class="reaction-emoji">👍</span> أعجبني
                </button>
                <button class="reaction-btn ${currentReaction === 'viewed' ? 'active' : ''}" 
                    onclick="toggleHouseReaction('${data.houseName}', 'viewed')">
                    <span class="reaction-emoji">👁️</span> شاهدته
                </button>
                <button class="reaction-btn ${currentReaction === 'later' ? 'active' : ''}" 
                    onclick="toggleHouseReaction('${data.houseName}', 'later')">
                    <span class="reaction-emoji">⏳</span> لاحقًا
                </button>
            </div>
        </div>
    `;
}

// إعداد معرض الصور
function setupImageGallery(data) {
    const houseId = data.houseName;
    const galleryImg = document.getElementById(`gallery-${houseId}`);
    const counter = document.getElementById(`image-counter-${houseId}`);
    const prevBtn = document.getElementById(`prev-${houseId}`);
    const nextBtn = document.getElementById(`next-${houseId}`);

    if (!galleryImg || !counter || !prevBtn || !nextBtn || !data.images) return;

    let currentIndex = 0;

const showImage = (index) => {
    galleryImg.src = data.images[index];
    // حجم ثابت لكل الصور
    galleryImg.style.width = '300px';
    galleryImg.style.height = '200px';
    galleryImg.style.objectFit = 'cover'; // أو contain إذا بدك يبين كامل
    counter.textContent = `${index + 1} / ${data.images.length}`;
};


    showImage(currentIndex);

    prevBtn.onclick = () => {
        currentIndex = (currentIndex - 1 + data.images.length) % data.images.length;
        showImage(currentIndex);
    };

    nextBtn.onclick = () => {
        currentIndex = (currentIndex + 1) % data.images.length;
        showImage(currentIndex);
    };
}