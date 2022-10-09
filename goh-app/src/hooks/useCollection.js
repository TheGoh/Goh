import { useState, useEffect } from 'react' 
import { firedb } from '../firebase/config';

import { collection, onSnapshot,getDocs } from 'firebase/firestore'

//fetch collection from firestore
//parameter is the reference/path of the collection
export const useCollection = (collect) => { 
    const [documents, setDocuments] = useState(null)

    useEffect(() => {
        let ref = collection(firedb, collect)

        getDocs(ref)
            .then((snapshot) => {
                let result = [];
                snapshot.docs.forEach(doc => {
                    result.push({...doc.data(), id: doc.id})
                })
                setDocuments(result)
            })    
    }, [])

    return {documents}
}