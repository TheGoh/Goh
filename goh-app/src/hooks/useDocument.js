import { useState, useEffect } from 'react' 
import { firedb } from '../firebase/config';

import { doc, onSnapshot } from 'firebase/firestore'

//fetch collection from firestore
//parameter is the reference/path of the collection
export const useDocument = (collect, id) => { 
    const [documents, setDocuments] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        let ref = doc(firedb, collect, id)

        const unsub = onSnapshot(ref, (doc) => {
            if (doc.data()) {
                setDocuments({...doc.data(), id: doc.id})
                setError(null)
            }
            else {
                setError("PROJECT HAD BEEN REMOVED!!!")
            }
        },
        
        (error) => {
            console.log("fail to fetch the document!!!")
            setError(error.message)
        })
        
        return () => unsub() 
    }, [collect, id])

    return {documents, error}
}