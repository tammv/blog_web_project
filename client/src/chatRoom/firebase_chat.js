// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseChatConfig = {
  apiKey: "AIzaSyDrBL7x7vqmiI7nex3pK-qD3UfjmUg8uLU",
  authDomain: "chat-app-44e10.firebaseapp.com",
  projectId: "chat-app-44e10",
  storageBucket: "chat-app-44e10.appspot.com",
  messagingSenderId: "934519336840",
  appId: "1:934519336840:web:11c578579f2e48637bd43d",
  measurementId: "G-8XV5PREQLY"
};

// Initialize Firebase
const app_chat = initializeApp(firebaseChatConfig, "chatApp");

// Initialize Firebase services
const db = getFirestore(app_chat);
const auth = getAuth(app_chat);
const storage = getStorage(app_chat);
const provider = new GoogleAuthProvider();

export { app_chat, auth, storage, provider, db, collection, onSnapshot, addDoc, serverTimestamp, ref, getDownloadURL, uploadBytes};
