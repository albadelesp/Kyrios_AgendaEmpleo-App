import React, { useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import 'firebase/auth';
import { firebase } from "@react-native-firebase/messaging";



export const firebaseConfig = {
  apiKey: "AIzaSyDj0gd7M9_JC2WM3lVqKCtGDHp4ZDxOHB0",
  authDomain: "prueba1-8a732.firebaseapp.com",
  projectId: "prueba1-8a732",
  storageBucket: "prueba1-8a732.appspot.com",
  messagingSenderId: "825205087171",
  appId: "1:825205087171:web:6b7c9e22db83ce2e173b76",
  measurementId: "G-9G0JLPN7RM"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);




export {
  app,
  db
};


