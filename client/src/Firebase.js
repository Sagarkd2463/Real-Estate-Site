import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: '',
    authDomain: "mern-real-estate-75115.firebaseapp.com",
    projectId: "mern-real-estate-75115",
    storageBucket: "mern-real-estate-75115.appspot.com",
    messagingSenderId: "838440256346",
    appId: "1:838440256346:web:4d10123f86728b10e06963"
};

// Initialize Firebase
export const FirebaseApp = initializeApp(firebaseConfig);