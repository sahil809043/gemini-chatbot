import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyCiC0NakADAGQfq_k_2y_4ajixsrTkGfNM",
    authDomain: "closeai-bcc80.firebaseapp.com",
    projectId: "closeai-bcc80",
    storageBucket: "closeai-bcc80.firebasestorage.app",
    messagingSenderId: "614149022167",
    appId: "1:614149022167:web:da470ea1c8c4f7385aeb92",
    measurementId: "G-YF90JQPF7H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const Auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
const analytics = getAnalytics(app);