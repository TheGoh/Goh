import firebase from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyD_ggcS56acnFfWBjZhi414bV2DWTVHqZg",
    authDomain: "thegohapp.firebaseapp.com",
    projectId: "thegohapp",
    storageBucket: "thegohapp.appspot.com",
    messagingSenderId: "426485438039",
    appId: "1:426485438039:web:c489bb4c3f6ed6d9943512",
    measurementId: "G-57SPP298SQ"
};

//initialize firebase
const app = initializeApp(firebaseConfig);

//initialize firestore
const firedb = getFirestore();
const auth = getAuth();

//timestamp
const timestamp = firebase.firestore.Timestamp

export {firedb, auth, timestamp}