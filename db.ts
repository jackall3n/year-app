import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {};

const app = initializeApp({
  projectId: "year-app",
});

export const db = getFirestore(app);
