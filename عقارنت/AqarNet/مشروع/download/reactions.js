import { auth, db, doc, setDoc } from '../../firebase.js';
import { houseMarkers } from '../map/map.js';
import { getMarkerIcon } from './load-houses.js'; // لو كان عندك ملف أيقونات
import { showCustomAlert } from '../UI/showCustomAlert.js';

export async function toggleHouseReaction(houseId, type) {
  const user = auth.currentUser;
  if (!user) return showCustomAlert("❗ يجب تسجيل الدخول.");
  let reactions = window.userReactions || { liked: [], viewed: [], later: [] };
  let { liked = [], viewed = [], later = [] } = reactions;
  // تحديث التفاعل في الذاكرة
  liked = liked.filter(id => id !== houseId);
  viewed = viewed.filter(id => id !== houseId);
  later = later.filter(id => id !== houseId);
  if (type === 'liked') liked.push(houseId);
  else if (type === 'viewed') viewed.push(houseId); 
  else if (type === 'later') later.push(houseId);
  window.userReactions = { liked, viewed, later };
  // تحديث لون المؤشر مباشرة
houseMarkers[houseId].setIcon(getMarkerIcon(houseId));
  // محاولة حفظ التفاعل في Firebase
  try {
    await setDoc(doc(db, "users", user.uid), { liked, viewed }, { merge: true });
    // إزالة أي تفاعل محلي مخزن مؤقتًا بعد النجاح
    const pending = JSON.parse(localStorage.getItem('dalPendingReactions') || '[]');
    const updated = pending.filter(p => p.houseId !== houseId);
    localStorage.setItem('dalPendingReactions', JSON.stringify(updated));
  } catch (err) {
    // في حال عدم توفر الإنترنت: حفظ التفاعل محليًا
    const pending = JSON.parse(localStorage.getItem('dalPendingReactions') || '[]');
    pending.push({ houseId, type, timestamp: Date.now() });
    localStorage.setItem('dalPendingReactions', JSON.stringify(pending));
    showCustomAlert("⚠️ لا يوجد اتصال بالإنترنت، تم حفظ التفاعل مؤقتًا.");
  }
}