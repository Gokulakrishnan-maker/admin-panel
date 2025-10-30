import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBrS5i5QRQzMcdq2HOSz0AH_lSaL9HD1F8",
  authDomain: "fastride-admin.firebaseapp.com",
  projectId: "fastride-admin",
  storageBucket: "fastride-admin.firebasestorage.app",
  messagingSenderId: "86971989113",
  appId: "1:86971989113:web:d391380887de9a474da8a8"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
