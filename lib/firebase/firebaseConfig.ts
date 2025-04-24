import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import{ getFirestore, serverTimestamp } from 'firebase/firestore';
//import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage';
import { FIREBASE_API_KEY } from '../firebase/config'; // Fixed unterminated string literal


const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: "ecobuddy-de508.firebaseapp.com",
  projectId: "ecobuddy-de508",
  storageBucket: "ecobuddy-de508.firebasestorage.app",
  messagingSenderId: "462448223189",
  appId: "1:462448223189:android:e7d6ee25c495a72f7c535c",
  measurementId: "G-VCQN3L3M80",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const timestamp = serverTimestamp; // For auto-generated timestamps
export const storage = getStorage(app);
export const auth = getAuth(app);

//export const analytics = getAnalytics(app);
//export const auth = initializeAuth(app, { persistence: getReactNativePersistence(ReactNativeAsyncStorage) });