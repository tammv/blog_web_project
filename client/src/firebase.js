import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

// Cấu hình Firebase của ứng dụng web
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "devb-blog.firebaseapp.com",
  projectId: "devb-blog",
  storageBucket: "devb-blog.appspot.com",
  messagingSenderId: "26828132532",
  appId: "1:26828132532:web:644df8d0c5cb5aa7aac7e1"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

export { app, db, storage };
