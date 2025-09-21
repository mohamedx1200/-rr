import { auth, db, collection, query, where, getDocs, doc, getDoc } from '../../firebase.js';
import { createHouseCard } from './house-card.js';
import { showCustomAlert } from '../UI/showCustomAlert.js';
import { hideAllPopups, showPopup } from '../UI/ui.js';

let cachedMyHouses = [];
let isFavoritesLoaded = false;
let isRefreshing = false;
let pullStartY = 0;
let currentPullY = 0;
let pullDelta = 0;

function saveFavoritesToLocal(houses) {
  localStorage.setItem('favHouses', JSON.stringify(houses));
}

function loadFavoritesFromLocal() {
  const data = localStorage.getItem('favHouses');
  return data ? JSON.parse(data) : [];
}

// =================== بيوتك ===================
function saveHousesToLocal(houses) {
  localStorage.setItem('myHouses', JSON.stringify(houses));
}

function loadHousesFromLocal() {
  const data = localStorage.getItem('myHouses');
  return data ? JSON.parse(data) : [];
}

function showRefreshComplete() {
  const refreshComplete = document.createElement('div');
  refreshComplete.className = 'refresh-complete';
  refreshComplete.innerHTML = '<i class="fas fa-check-circle"></i> تم التحديث بنجاح';
  document.body.appendChild(refreshComplete);
  
  setTimeout(() => {
    refreshComplete.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    refreshComplete.classList.remove('show');
    setTimeout(() => {
      if (refreshComplete.parentNode) {
        refreshComplete.parentNode.removeChild(refreshComplete);
      }
    }, 300);
  }, 2000);
}

export async function loadMyHouses(fromFirebase = false) {
  const user = auth.currentUser;
  const myHousesContainer = document.getElementById('myHouses');
  const loadingSpinner = document.getElementById('loadingSpinner');

  if (!user) {
    myHousesContainer.innerHTML = '<p>يرجى تسجيل الدخول لعرض بيوتك</p>';
    cachedMyHouses = [];
    saveHousesToLocal(cachedMyHouses);
    
    // التأكد من إخفاء دائرة التحميل
    if (loadingSpinner) loadingSpinner.style.display = "none";
    return;
  }

  if (!fromFirebase) {
    const localHouses = loadHousesFromLocal();
    if (localHouses.length > 0) {
      cachedMyHouses = localHouses;
      myHousesContainer.innerHTML = '';
      for (const { name, data } of cachedMyHouses) {
        const card = createHouseCard(data, name, true, false);
        myHousesContainer.appendChild(card);
      }
      
      // التأكد من إخفاء دائرة التحميل
      if (loadingSpinner) loadingSpinner.style.display = "none";
      return;
    }
  }

  try {
    const housesRef = collection(db, "houses");
    const q = query(housesRef, where("addedBy", "==", user.uid));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      myHousesContainer.innerHTML = '<p>لا توجد عقارات بعد</p>';
      cachedMyHouses = [];
      saveHousesToLocal(cachedMyHouses);
      
      // التأكد من إخفاء دائرة التحميل
      if (loadingSpinner) loadingSpinner.style.display = "none";
      return;
    }

    cachedMyHouses = snapshot.docs.map(doc => ({
      name: doc.id,
      data: doc.data()
    }));

    myHousesContainer.innerHTML = '';
    for (const { name, data } of cachedMyHouses) {
      const card = createHouseCard(data, name, true, false);
      myHousesContainer.appendChild(card);
    }

    saveHousesToLocal(cachedMyHouses);
    
    if (fromFirebase) {
      showRefreshComplete();
    }

  } catch (err) {
    console.error("Error loading my houses:", err);
    myHousesContainer.innerHTML = '<p>حدث خطأ أثناء التحميل</p>';
  } finally {
    // التأكد من إخفاء دائرة التحميل في جميع الحالات
    if (loadingSpinner) loadingSpinner.style.display = "none";
  }
}

// =================== المفضلة ===================
export async function loadFavoriteHouses(fromFirebase = false) {
  const user = auth.currentUser;
  const favHousesContainer = document.getElementById('favHouses');
  const favLoadingSpinner = document.getElementById('favLoadingSpinner');

  if (!user) {
    favHousesContainer.innerHTML = '<p>يرجى تسجيل الدخول لعرض المفضلة.</p>';
    
    // التأكد من إخفاء دائرة التحميل
    if (favLoadingSpinner) favLoadingSpinner.style.display = "none";
    return;
  }

  // إذا لم يكن من Firebase → حاول جلبها من التخزين المحلي
  if (!fromFirebase) {
    const localFavs = loadFavoritesFromLocal();
    if (localFavs.length > 0) {
      favHousesContainer.innerHTML = '';
      for (const { id, data } of localFavs) {
        const card = createHouseCard(data, id, false);
        favHousesContainer.appendChild(card);
      }
      
      // التأكد من إخفاء دائرة التحميل
      if (favLoadingSpinner) favLoadingSpinner.style.display = "none";
      return;
    }
  }

  // جلب من Firebase
  try {
    const userDocSnap = await getDoc(doc(db, "users", user.uid));
    if (!userDocSnap.exists()) {
      favHousesContainer.innerHTML = '<p>لا توجد بيانات مستخدم.</p>';
      
      // التأكد من إخفاء دائرة التحميل
      if (favLoadingSpinner) favLoadingSpinner.style.display = "none";
      return;
    }

    const likedHouses = userDocSnap.data().liked || [];
    if (likedHouses.length === 0) {
      favHousesContainer.innerHTML = '<p>لا توجد عقارات مفضلة بعد.</p>';
      saveFavoritesToLocal([]); // حفظ قائمة فارغة
      
      // التأكد من إخفاء دائرة التحميل
      if (favLoadingSpinner) favLoadingSpinner.style.display = "none";
      return;
    }

    favHousesContainer.innerHTML = '';
    let favsToCache = [];

    for (const houseId of likedHouses) {
      const houseSnap = await getDoc(doc(db, "houses", houseId));
      if (!houseSnap.exists()) continue;
      const data = houseSnap.data();
      const card = createHouseCard(data, houseId, false);
      favHousesContainer.appendChild(card);
      favsToCache.push({ id: houseId, data });
    }

    // حفظ نسخة محلية
    saveFavoritesToLocal(favsToCache);
    
    if (fromFirebase) {
      showRefreshComplete();
    }

  } catch (err) {
    console.error("حدث خطأ أثناء تحميل المفضلة:", err);
    favHousesContainer.innerHTML = '<p>حدث خطأ أثناء التحميل.</p>';
  } finally {
    // التأكد من إخفاء دائرة التحميل في جميع الحالات
    if (favLoadingSpinner) favLoadingSpinner.style.display = "none";
  }
}

function initPullToRefresh(containerId, loadingSpinnerId, loadFunction) {
  const container = document.getElementById(containerId);
  const list = container.closest('.houses-list') || container.parentElement;
  const loadingSpinner = document.getElementById(loadingSpinnerId);
  
  if (!container || !list) return;
  
  // إنشاء عنصر مؤشر السحب
  const pullIndicator = document.createElement('div');
  pullIndicator.id = `${containerId}PullIndicator`;
  pullIndicator.className = 'pull-indicator';
  pullIndicator.innerHTML = `
    <div class="pull-content">
      <div class="pull-icon">
        <i class="fas fa-sync-alt" id="${containerId}PullIcon"></i>
      </div>
      <div class="pull-text" id="${containerId}PullText">اسحب للتحديث</div>
    </div>
  `;
  list.insertBefore(pullIndicator, list.firstChild);
  
  const pullIcon = document.getElementById(`${containerId}PullIcon`);
  const pullText = document.getElementById(`${containerId}PullText`);
  
  let touchMoveHandler = null;
  let touchEndHandler = null;
  let mouseMoveHandler = null;
  let mouseUpHandler = null;
  
  function resetPull() {
    pullDelta = 0;
    pullIndicator.classList.remove('visible');
    container.style.transform = 'translateY(0)';
    if (pullIcon) {
      pullIcon.style.transform = 'rotate(0)';
      pullIcon.classList.remove('fa-spin');
    }
    if (pullText) pullText.textContent = 'اسحب للتحديث';
    
    // إزالة مستمعي الأحداث
    if (touchMoveHandler) {
      list.removeEventListener('touchmove', touchMoveHandler);
      touchMoveHandler = null;
    }
    
    if (touchEndHandler) {
      list.removeEventListener('touchend', touchEndHandler);
      list.removeEventListener('touchcancel', touchEndHandler);
      touchEndHandler = null;
    }
    
    if (mouseMoveHandler) {
      list.removeEventListener('mousemove', mouseMoveHandler);
      mouseMoveHandler = null;
    }
    
    if (mouseUpHandler) {
      list.removeEventListener('mouseup', mouseUpHandler);
      list.removeEventListener('mouseleave', mouseUpHandler);
      mouseUpHandler = null;
    }
  }
  
  function handleTouchStart(e) {
    if (isRefreshing || list.scrollTop > 10) return;
    
    pullStartY = e.touches[0].clientY;
    currentPullY = pullStartY;
    
    touchMoveHandler = handleTouchMove;
    touchEndHandler = handleTouchEnd;
    
    list.addEventListener('touchmove', touchMoveHandler);
    list.addEventListener('touchend', touchEndHandler);
    list.addEventListener('touchcancel', touchEndHandler);
  }
  
  function handleTouchMove(e) {
    if (isRefreshing) return;
    
    currentPullY = e.touches[0].clientY;
    pullDelta = currentPullY - pullStartY;
    
    if (pullDelta > 0) {
      e.preventDefault();
      
      pullIndicator.classList.add('visible');
      const maxPull = 150;
      const limitedPull = Math.min(pullDelta, maxPull);
      const opacity = Math.min(1, limitedPull / maxPull);
      pullIndicator.style.opacity = opacity;
      
      container.style.transform = `translateY(${limitedPull}px)`;
      
      if (limitedPull > 100) {
        if (pullIcon) pullIcon.style.transform = 'rotate(180deg)';
        if (pullText) pullText.textContent = 'حرر للتحديث';
      } else {
        if (pullIcon) pullIcon.style.transform = 'rotate(0)';
        if (pullText) pullText.textContent = 'اسحب للتحديث';
      }
    }
  }
  
  function handleTouchEnd() {
    if (isRefreshing) return;
    
    if (pullDelta > 100) {
      startRefresh();
    } else {
      resetPull();
    }
  }
  
  function handleMouseStart(e) {
    if (isRefreshing || list.scrollTop > 10) return;
    
    pullStartY = e.clientY;
    currentPullY = pullStartY;
    
    mouseMoveHandler = handleMouseMove;
    mouseUpHandler = handleMouseUp;
    
    list.addEventListener('mousemove', mouseMoveHandler);
    list.addEventListener('mouseup', mouseUpHandler);
    list.addEventListener('mouseleave', mouseUpHandler);
  }
  
  function handleMouseMove(e) {
    if (isRefreshing) return;
    
    currentPullY = e.clientY;
    pullDelta = currentPullY - pullStartY;
    
    if (pullDelta > 0) {
      pullIndicator.classList.add('visible');
      const maxPull = 150;
      const limitedPull = Math.min(pullDelta, maxPull);
      const opacity = Math.min(1, limitedPull / maxPull);
      pullIndicator.style.opacity = opacity;
      
      container.style.transform = `translateY(${limitedPull}px)`;
      
      if (limitedPull > 100) {
        if (pullIcon) pullIcon.style.transform = 'rotate(180deg)';
        if (pullText) pullText.textContent = 'حرر للتحديث';
      } else {
        if (pullIcon) pullIcon.style.transform = 'rotate(0)';
        if (pullText) pullText.textContent = 'اسحب للتحديث';
      }
    }
  }
  
  function handleMouseUp() {
    if (isRefreshing) return;
    
    if (pullDelta > 100) {
      startRefresh();
    } else {
      resetPull();
    }
  }
  
  function startRefresh() {
    isRefreshing = true;
    
    // إخفاء مؤشر السحب فوراً عند بدء التحديث
    pullIndicator.classList.remove('visible');
    
    if (pullIcon) {
      pullIcon.classList.add('fa-spin');
    }
    if (pullText) {
      pullText.textContent = 'جاري التحديث...';
    }
    
    container.style.transform = 'translateY(0)';
    
    if (loadingSpinner) loadingSpinner.style.display = "block";
    container.innerHTML = "";
    
    loadFunction(true)
      .then(() => {
        resetPull();
        isRefreshing = false;
      })
      .catch(err => {
        console.error("Error refreshing:", err);
        resetPull();
        isRefreshing = false;
      })
      .finally(() => {
        // التأكد من إخفاء دائرة التحميل في جميع الحالات
        if (loadingSpinner) loadingSpinner.style.display = "none";
      });
  }
  
  // إضافة مستمعي الأحداث
  list.addEventListener('touchstart', handleTouchStart);
  list.addEventListener('mousedown', handleMouseStart);
  
  // منع التحديث عند التمرير العادي
  list.addEventListener('scroll', () => {
    if (list.scrollTop > 10) {
      resetPull();
    }
  });
}

// تهيئة عندما تكون الصفحة جاهزة
document.addEventListener('DOMContentLoaded', () => {
  // تحميل البيانات الأولية
  loadMyHouses();
  loadFavoriteHouses();
  
  // تهيئة خاصية السحب للتحديث لبيوتك
  initPullToRefresh('myHouses', 'loadingSpinner', loadMyHouses);
  
  // تهيئة خاصية السحب للتحديث للمفضلة
  initPullToRefresh('favHouses', 'favLoadingSpinner', loadFavoriteHouses);
});

// إضافة أنماط CSS المطلوبة
const style = document.createElement('style');
style.textContent = `
  .pull-indicator {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transform: translateY(-100%);
    transition: transform 0.3s, opacity 0.3s;
    z-index: 10;
    pointer-events: none;
  }
  
  .pull-indicator.visible {
    opacity: 1;
    transform: translateY(0);
  }
  
  .pull-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px;
  }
  
  .pull-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f1f1f1;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    margin-bottom: 5px;
    transition: transform 0.3s;
  }
  
  .pull-icon i {
    font-size: 20px;
    color: #3498db;
    transition: transform 0.3s;
  }
  
  .pull-text {
    font-size: 14px;
    color: #7f8c8d;
  }
  
  .refresh-complete {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #4CAF50;
    color: white;
    padding: 12px 20px;
    border-radius: 30px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    opacity: 0;
    transition: opacity 0.3s;
    z-index: 1000;
  }
  
  .refresh-complete.show {
    opacity: 1;
  }
  
  #myHouses, #favHouses {
    transition: transform 0.3s ease-out;
  }
  
  /* تحسينات للتأكد من إخفاء الدائرة أثناء التحديث */
  .pull-indicator.hidden {
    display: none !important;
  }
  
  /* تحسينات للدوارة الأصلية */
  #loadingSpinner, #favLoadingSpinner {
    display: none;
    text-align: center;
    padding: 30px;
  }
  
  .spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 0 auto;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);