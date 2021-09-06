import config from "./config.json";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage"

firebase.initializeApp(config);
let googleProvider = new firebase.auth.GoogleAuthProvider();

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();

export const signUpWithGoogle = () => {
  auth.signInWithPopup(googleProvider);
};

export default firebase;
