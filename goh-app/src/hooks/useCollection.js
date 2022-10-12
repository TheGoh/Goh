import { useState, useEffect } from 'react' 
import { firedb } from '../firebase/config';

import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore'
//fetch collection from firestore
//parameter is the reference/path of the collection
export const useCollection = (collect, _query) => { 
    const [documents, setDocuments] = useState(null)

    useEffect(() => {
        let ref = collection(firedb, collect)
        if (_query) {
            ref = query(ref, where(..._query))
        }
        const unsub = onSnapshot(ref, () => {
            getDocs(ref)
            .then((snapshot) => {
                let result = [];
                snapshot.docs.forEach(doc => {
                    result.push({...doc.data(), id: doc.id})
                })
                setDocuments(result)
            }) 
        })
        
        return () => unsub()   
    }, [collect, _query])

    return {documents}
}