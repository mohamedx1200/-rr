import { auth, db, doc, getDoc, getDocs, collection } from '../../firebase.js';
import { renderHouseOnMap } from '../add-house-form/house-details/house-details.js';
import { deleteHouse } from './delete-house.js';
import { getColoredMarkerUrl } from '../map/icons.js';

window.housesMap = {};
window.userReactions = { liked: [], viewed: [], later: [] };
window.houseMarkers = {}; // تأكد أن هذا موجود لتخزين المؤشرات

export async function loadHouses() {
  const user = auth.currentUser; 

  // تحميل التفاعلات الشخصية أولاً
  if (user) {
    const userSnap = await getDoc(doc(db, "users", user.uid));
    const data = userSnap.exists() ? userSnap.data() : {};
    window.userReactions = {
      liked: data.liked || [],
      viewed: data.viewed || [],
      later: data.later || []
    };
  } else {
    window.userReactions = { liked: [], viewed: [], later: [] };
  }

  // بعد ما خلص تحميل التفاعلات، جلب العقارات
  const querySnapshot = await getDocs(collection(db, "houses"));
  const housesToRender = [];

  querySnapshot.forEach(docSnap => {
    const data = docSnap.data();
    const id = docSnap.id;
    if (!data.addedBy) data.addedBy = null;
    housesToRender.push({ data, id });
    window.housesMap[id] = data;
  });

  // الآن رسم المؤشرات بعد ما صارت userReactions جاهزة
  housesToRender.forEach(({ data, id }) => {
    renderHouseOnMap(data, id);
  });
}


// دالة لاختيار لون المأشر
export function getMarkerIcon(houseId) {
  const user = auth.currentUser;
  const { liked = [], viewed = [], later = [] } = window.userReactions || {};
  const houseData = window.housesMap?.[houseId];
  
  let color = 'blue'; // اللون الافتراضي

  if (user && houseData?.addedBy === user.uid) {
    color = 'purple'; // 💜 صاحب العقار الحالي
  } else if (liked.includes(houseId)) {
    color = 'green';
  } else if (viewed.includes(houseId)) {
    color = 'yellow';
  } else if (later.includes(houseId)) {
    color = 'blue';
  }

  return L.icon({
    iconUrl: getColoredMarkerUrl(color),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
}


window.deleteHouse = deleteHouse;
