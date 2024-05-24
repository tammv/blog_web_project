// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "devb-blog.firebaseapp.com",
  projectId: "devb-blog",
  storageBucket: "devb-blog.appspot.com",
  messagingSenderId: "26828132532",
  appId: "1:26828132532:web:644df8d0c5cb5aa7aac7e1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);