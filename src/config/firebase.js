import {initializeApp} from "firebase/app";
import {browserLocalPersistence} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import { initializeAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAAu4kMUGfvEjhQ1BcVzR0-bGTHljgeN4k",
  authDomain: "eam-a3-922f0.firebaseapp.com",
  projectId: "eam-a3-922f0",
  storageBucket: "eam-a3-922f0.firebasestorage.app",
  messagingSenderId: "781740909937",
  appId: "1:781740909937:web:da2b431d4a00de31ae82d0"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: browserLocalPersistence,
});
export const FIREBASE_DB = getFirestore(FIREBASE_APP);