import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "librairie-al-tawhid.firebaseapp.com",
  projectId: "librairie-al-tawhid",
  storageBucket: "librairie-al-tawhid.appspot.com",
  messagingSenderId: "123456789",
  appId: "demo-app-id"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);