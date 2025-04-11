// lib/firebase/config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, serverTimestamp } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyC_Fh1fectq19Qkd4TmkP_F5YLu-t42KyY",
  authDomain: "ecobuddy-de508.firebaseapp.com",
  projectId: "ecobuddy-de508",
  storageBucket: "ecobuddy-de508.firebasestorage.app",
  messagingSenderId: "462448223189",
  appId: "1:462448223189:android:e7d6ee25c495a72f7c535c",
  measurementId: "G-VCQN3L3M80",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export const timestamp = serverTimestamp; // For auto-generated timestamps
export const storage = getStorage(app);