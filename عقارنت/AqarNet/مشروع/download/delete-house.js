import { auth, db, doc, getDoc, deleteDoc, updateDoc, increment } from '../../firebase.js';
import { showCustomAlert } from '../UI/showCustomAlert.js';
import { houseMarkers } from '../map/map.js';

export async function deleteHouse(houseId) {
  const houseRef = doc(db, "houses", houseId);
  const houseSnap = await getDoc(houseRef); 
  if (!houseSnap.exists()) {
    showCustomAlert("❌ لم يتم العثور على هذا البيت.");
    return;
  }

  const houseData = houseSnap.data();
  const currentUser = auth.currentUser;
  if (!currentUser || houseData.addedBy !== currentUser.uid) {
    showCustomAlert("🚫 لا يمكنك حذف بيت لم تقم بإضافته.");
    return;
  }

  const confirmed = confirm("هل أنت متأكد أنك تريد حذف هذا البيت؟");
  if (!confirmed) return;
  await deleteDoc(houseRef);
  await deleteDoc(doc(db, "users", currentUser.uid, "myHouses", houseId)); // أضف هذا السطر هنا
  const counterRef = doc(db, "meta", "counters");
  await updateDoc(counterRef, {
    deletedCount: increment(1),
    activeCount: increment(-1)
  });
  showCustomAlert(`🗑️ تم حذف البيت`);
  houseMarkers[houseId].remove();
  delete houseMarkers[houseId];
}