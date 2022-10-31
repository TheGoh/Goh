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

        onSnapshot(ref, (doc) => {
            setDocuments({...doc.data(), id: doc.id})
        },
        
        (error) => {
            setError(error.message)
        })
        
              
    }, [collect, id])

    return {documents, error}
}