import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  connectAuthEmulator
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";   
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  doc, 
  getDoc,
  setDoc,
  query,
  where,
  orderBy,
  updateDoc,
  deleteDoc,
  increment,
  connectFirestoreEmulator,
  enableMultiTabIndexedDbPersistence,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  startAfter,
  limit
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  uploadBytesResumable,
  connectStorageEmulator
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

// تهيئة Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCuH1mg08qHIYmnTuQmm6IeljBLSofrNhY",
  authDomain: "dal-aqar-locator.firebaseapp.com",
  projectId: "dal-aqar-locator",
  storageBucket: "dal-aqar-locator.firebasestorage.app",
  messagingSenderId: "1022056207761",
  appId: "1:1022056207761:web:93f25da098699079d73630",
  measurementId: "G-0J6E69BJ78"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// تهيئة Firestore مع التخزين المؤقت المتعدد للنوافذ
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

// تهيئة خدمات Firebase
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);

// توصيل بمحاكي Firebase للتطوير المحلي
if (window.location.hostname === "localhost") {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectStorageEmulator(storage, "localhost", 9199);
  console.log("Connected to Firebase Emulators");
}

// دالة للتحقق من اتصال Firestore
async function checkFirestoreConnection() {
  try {
    await getDoc(doc(db, "meta", "connection-test"));
    return true;
  } catch (error) {
    console.error("فشل الاتصال بـ Firestore:", error);
    return false;
  }
}

// تصدير جميع الدوال والخدمات المطلوبة
export {
  // Authentication
  auth, 
  provider, 
  onAuthStateChanged, 
  signOut,
  
  // Firestore
  db,
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  increment,
  query,
  where,
  orderBy,
  startAfter,
  limit,
  checkFirestoreConnection,
  // Storage
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  uploadBytesResumable
};