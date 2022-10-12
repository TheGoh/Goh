
import { firedb } from '../firebase/config';

import { useState, useEffect } from 'react' 
import { doc, deleteDoc } from 'firebase/firestore'

export const useDeleteDoc = (docRef, id) => { 
    const [error, setError] = useState(null)

    useEffect(async () => {
        let ref = doc(firedb, docRef, id)

        await deleteDoc(ref)
            .catch(error => {
                setError(error.message)
            })
    }, [docRef, id])
}