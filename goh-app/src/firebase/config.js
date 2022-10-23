import firebase from "firebase/app"
/* Firestore documentation functionality */
import { 
    getFirestore,
    doc,
    getDoc,
    setDoc
} from "firebase/firestore"
/* Sign-in with Google Functionality */

import {
    getAuth,
    signInWithRedirect,
    signInWithPopup,
    GoogleAuthProvider,
} from "firebase/auth"
/* uniqueid functionality */

/* Initialize firebase */
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

//Login with google
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
    prompt: "select_account"
});


//initialize firebase
const app = initializeApp(firebaseConfig);

//initialize firestore
const firedb = getFirestore();
const auth = getAuth();

export const signInWithGooglePopup = () => signInWithPopup(auth, provider);




//timestamp
//const timestamp = firebase.firestore.Timestamp

export {firedb, auth}
/* *** FUNCTION TO ADD NEW UID TO FIRESTORE *** */

export const createUserDocumentFromAuth = async (userAuth, userid) => {
    const userDocRef = doc(firedb, 'users', userAuth.uid);
    const userSnapshot = await getDoc(userDocRef);
    if (!userSnapshot.exists()) {
        const { email } = userAuth;
        const createdAt = new Date();
        const ownedProjects = [];
        const invitations = {}; // a list of project ids being invited to

        try {
            await setDoc(userDocRef, {
                displayName : userid,
                email,
                createdAt,
                ownedProjects,
                invitations
            });
        } catch (error) {
            console.log('error creating the user', error.message);
        }
    }

    return userDocRef;
};
