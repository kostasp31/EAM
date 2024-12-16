import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const config = {
  apiKey: "AIzaSyAAu4kMUGfvEjhQ1BcVzR0-bGTHljgeN4k",
  authDomain: "eam-a3-922f0.firebaseapp.com",
  projectId: "eam-a3-922f0",
  storageBucket: "eam-a3-922f0.firebasestorage.app",
  messagingSenderId: "781740909937",
  appId: "1:781740909937:web:da2b431d4a00de31ae82d0"
}

const app = initializeApp(config)
export const db = getFirestore(app)