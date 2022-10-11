import { useState, useEffect } from 'react' 
import { firedb } from '../firebase/config';

import { collection, getDocs } from 'firebase/firestore'

//fetch collection from firestore
//parameter is the reference/path of the collection
export const useCollection = (collect, id) => { 
    const [documents, setDocuments] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        let ref = collection(firedb, collect, id)

        getDocs(ref)
            .then((snapshot) => {
                setDocuments({...snapshot.data(), id: snapshot.id})
            })    
    }, [collect, id])

    return {documents}
}