import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, collection, query, where, onSnapshot, addDoc, serverTimestamp, getDocFromServer } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyALRMCcl9JO-qClNOaFIwDin7lRlgUEqr0",
  authDomain: "smartbala-367da.firebaseapp.com",
  projectId: "smartbala-367da",
  storageBucket: "smartbala-367da.firebasestorage.app",
  messagingSenderId: "234784327691",
  appId: "1:234784327691:web:b333ed333482c2d3b8df0e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export { createUserWithEmailAndPassword, signInWithEmailAndPassword };

// Helper to test connection
export const testConnection = async () => {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Firebase connection error: The client is offline or configuration is incorrect.");
    }
  }
};
testConnection();
