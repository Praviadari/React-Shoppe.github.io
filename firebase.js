// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA9ffT_diTEoiFr1UVBwN8HF3RVr3nsq6M",
  authDomain: "gift-shoppe.firebaseapp.com",
  projectId: "gift-shoppe",
  storageBucket: "gift-shoppe.appspot.com",
  messagingSenderId: "1001261047670",
  appId: "1:1001261047670:web:e750e97d74019f9ee9a457",
  measurementId: "G-73N2T52QEY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);