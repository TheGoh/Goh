import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase/config";


export const userSignUp = () => {
    const [ERROR, setError] = useState(null);

    const signUp = (email, password) => {
        setError(null);
        createUserWithEmailAndPassword(auth, email, password)
            .then((res) => {
                console.log("User Signed Up:", res.user);
            })
            .catch((err) => {
                setError(err.message);
            })
    }

    return { ERROR, signUp };
}