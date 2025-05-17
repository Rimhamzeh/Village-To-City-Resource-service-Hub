
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDOVjOBDb240zOwTErNXnPnbSpSpPxjGLg",
  authDomain: "village-to-city-91f61.firebaseapp.com",
  projectId: "village-to-city-91f61",
  storageBucket: "village-to-city-91f61.firebasestorage.app",
  messagingSenderId: "333846643437",
  appId: "1:333846643437:web:698f9a3650e19dcd9ac2e4",
  measurementId: "G-BZ9FCBVGJP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth= getAuth(app);
export const database=getFirestore(app);