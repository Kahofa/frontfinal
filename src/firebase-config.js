import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Конфигурация проекта
const firebaseConfig = {
  apiKey: "AIzaSyD_da1cGdlWJVDvueQQkEMzCNKNxIeh5_0",
  authDomain: "frontfinal-de46e.firebaseapp.com",
  projectId: "frontfinal-de46e",
  storageBucket: "frontfinal-de46e.appspot.com",
  messagingSenderId: "933371055324",
  appId: "1:933371055324:web:4e5f7dd6a8d31a1fd83819",
  measurementId: "G-3KR8RL9W3X"
};

// Инициализация приложения
const app = initializeApp(firebaseConfig);

// Сервисы Firebase
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
