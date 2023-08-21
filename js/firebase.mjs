import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyChmLfDahFscVT2OP6HnGIUisBvZghU2c0",
  authDomain: "hackathon-e24b8.firebaseapp.com",
  projectId: "hackathon-e24b8",
  storageBucket: "hackathon-e24b8.appspot.com",
  messagingSenderId: "373231898786",
  appId: "1:373231898786:web:4a3dfb059680b9428907fb",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
