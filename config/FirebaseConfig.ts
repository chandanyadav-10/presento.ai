// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAaHIX9Au6h6BZBkuW7-tSsrxDO41UBLpQ",
  authDomain: "chandan-project-cdf2a.firebaseapp.com",
  projectId: "chandan-project-cdf2a",
  storageBucket: "chandan-project-cdf2a.firebasestorage.app",
  messagingSenderId: "846469244407",
  appId: "1:846469244407:web:ea9bb313ad2b0f5421faf2",
  measurementId: "G-H773J8KYGC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseDb = getFirestore(app, '(default)');