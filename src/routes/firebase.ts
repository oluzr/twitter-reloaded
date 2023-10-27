import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyADUZoJK45RS5VjmqrulCcIC_6f2buEazg",
  authDomain: "twitter-reloaded-d6dfe.firebaseapp.com",
  projectId: "twitter-reloaded-d6dfe",
  storageBucket: "twitter-reloaded-d6dfe.appspot.com",
  messagingSenderId: "982484687321",
  appId: "1:982484687321:web:f74d8be13bba2f4d0e21c8",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)