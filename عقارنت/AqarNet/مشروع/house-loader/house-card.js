export function createHouseCard(data, id, showDelete = false, showRemoveFavorite = true) {
  const div = document.createElement('div');
  div.className = 'favorite-card';

  // الصورة
  const img = document.createElement('img');
  img.src = (Array.isArray(data.images) && data.images.length > 0) ? data.images[0] : '../صور/404.png';
  img.alt = 'صورة البيت';
  img.className = 'favorite-img';

  // تحويل التاريخ من timestamp إلى صيغة مقروءة
  let addedDate = "غير محدد";
  if (data.addedAt) {
    const date = new Date(data.addedAt);
    addedDate = date.toLocaleDateString() + " " + date.toLocaleTimeString();
  }

  // معلومات البيت
  const info = document.createElement('div');
  info.className = 'favorite-info';
  info.innerHTML = `
    <h3>${data.houseName || id}</h3>
    <p>🏠 نوع العقار: ${data.propertyType || "غير محدد"}</p>
    <p>📄 نوع العرض: ${data.status || "غير محدد"}</p>
    <p>📏 المساحة: ${data.totalArea ? data.totalArea + " م²" : "غير محدد"}</p>
    ${data.price && data.currency ? `<p>💰 السعر: ${data.price} ${data.currency}</p>` : ""}
    <p>📅 تاريخ الإضافة: ${addedDate}</p>

    <button onclick="goToHouseOnMap('${id}')">📍 عرض على الخريطة</button>
    ${showDelete ? `<button onclick="deleteHouse('${id}')" style="color:red;">🗑️ حذف</button>` : ''}
  `;

  div.appendChild(img);
  div.appendChild(info);

  return div;
}
