// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2lGiKHFQ3Lc5dYZwuNOHjNthIqz0FytI",
  authDomain: "homefinder-react.firebaseapp.com",
  projectId: "homefinder-react",
  storageBucket: "homefinder-react.appspot.com",
  messagingSenderId: "832278170649",
  appId: "1:832278170649:web:c7f1ed8808c23b5a6bee88"
};

// Initialize Firebase
initializeApp(firebaseConfig);

export const db = getFirestore();