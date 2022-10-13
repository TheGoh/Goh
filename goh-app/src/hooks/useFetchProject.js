import { useState, useEffect } from 'react' 
import { firedb } from '../firebase/config';

import { doc, getDoc, onSnapshot } from 'firebase/firestore'

//fetch collection from firestore
//parameter is the reference/path of the collection
export const useFetchProject = (collect, id) => { 
    const [documents, setDocuments] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        let ref = doc(firedb, collect, id)

        onSnapshot(ref, () => {
            getDoc(ref)
            .then((snapshot) => {
                setDocuments({...snapshot.data(), id: snapshot.id})
            })  
        })
              
    }, [collect, id])

    return {documents}
}