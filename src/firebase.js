import { initializeApp } from "firebase/app";
import {getStorage}from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyD_dEgVXjrRwrihIVCbLwaClVqzk_10_Iw",
  authDomain: "uploadingfile-90303.firebaseapp.com",
  projectId: "uploadingfile-90303",
  storageBucket: "uploadingfile-90303.appspot.com",
  messagingSenderId: "5184238390",
  appId: "1:5184238390:web:ab603521f1c1b6c793f997"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage =getStorage(app)