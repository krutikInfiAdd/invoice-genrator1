
// @ts-ignore
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace the following with your app's Firebase project configuration
// You can find this in the Firebase Console -> Project Settings -> General -> Your apps
const firebaseConfig = {
  apiKey: "AIzaSyAWo6R94Nk8aI3RWqbvqty7vyO1wFobNmc",
  authDomain: "infiadd-27bd5.firebaseapp.com",
  databaseURL: "https://infiadd-27bd5-default-rtdb.firebaseio.com",
  projectId: "infiadd-27bd5",
  storageBucket: "infiadd-27bd5.firebasestorage.app",
  messagingSenderId: "291851820666",
  appId: "1:291851820666:web:0b9d2779c4d5e95529e5c3"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
