import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";

// إعدادات Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCuH1mg08qHIYmnTuQmm6IeljBLSofrNhY",
  authDomain: "dal-aqar-locator.firebaseapp.com",
  projectId: "dal-aqar-locator",
  storageBucket: "dal-aqar-locator.appspot.com",
  messagingSenderId: "1022056207761",
  appId: "1:1022056207761:web:93f25da098699079d73630",
  measurementId: "G-0J6E69BJ78"
};

// تهيئة التطبيق والمصادقة
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const nameElem = document.getElementById("userName");
  const imgElem = document.getElementById("userImg");

  // تسجيل الدخول
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      signInWithPopup(auth, provider)
        .then((result) => {
          const user = result.user;
          alert(`✅ مرحبًا ${user.displayName}`);
          console.log("✅ تم تسجيل الدخول:", user.displayName);
          window.location.href = "../مشروع/index.html"; // ✔️ غير المسار إذا لزم الأمر
        })
        .catch((error) => {
          if (error.code === "auth/popup-closed-by-user") {
            alert("🚫 أغلقت نافذة تسجيل الدخول قبل إكمال العملية. حاول مرة أخرى.");
          } else {
            alert("❌ حدث خطأ أثناء تسجيل الدخول: " + error.message);
          }
          console.error("❌ فشل تسجيل الدخول:", error.code, error.message);
        });
    });
  }

  // حالة المستخدم
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      await user.reload(); // ⭐ تحديث البيانات من Google
      const updatedUser = auth.currentUser;

      console.log("✅ تسجيل دخول تلقائي:", updatedUser.displayName);

      // عرض بيانات المستخدم
      if (nameElem) nameElem.textContent = updatedUser.displayName;
      if (imgElem) imgElem.src = updatedUser.photoURL;

      // إظهار زر تسجيل الخروج
      if (logoutBtn) logoutBtn.style.display = "block";
    } else {
      console.log("❌ لا يوجد مستخدم مسجل الدخول");

      // إخفاء زر تسجيل الخروج
      if (logoutBtn) logoutBtn.style.display = "none";
    }
  });

  // تسجيل الخروج
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      signOut(auth)
        .then(() => {
          alert("✅ تم تسجيل الخروج");
          window.location.reload();
        })
        .catch((error) => {
          alert("❌ فشل تسجيل الخروج: " + error.message);
          console.error("❌ فشل تسجيل الخروج:", error);
        });
    });
  }
});
