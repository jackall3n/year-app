import { initializeApp } from 'firebase/app';
import { getFirestore } from "@firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  //...
};

const app = initializeApp({
  projectId: 'year-app'
});

export const db = getFirestore(app);
