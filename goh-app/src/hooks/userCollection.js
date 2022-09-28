import { useState, useEffect } from "react";
import { db } from "../firebase/config";

import { collection, onSnapshot } from "firebase/firestore";

export const userCollection = (c) => {
    const [DOCUMENTS, setDocuments] = useState(null);

    useEffect(() => {
        let ref = collection(db, c);

        const unsub = onSnapshot(ref, (snapshot) =>{
            let results = [];
            snapshot.docs.forEach(doc => {
                results.push({...doc.data(), id: doc.id});
            })
            setDocuments(results);
        })

        return () => unsub();
    }, [c])

    return { DOCUMENTS }
}