
import { firedb } from '../firebase/config';

import { useState } from 'react' 
import { doc, deleteDoc } from 'firebase/firestore'

export const useDeleteDoc = () => { 
    const [error, setError] = useState(null)

    const deleteDocument = async(docRef, id) => {
        let ref = doc(firedb, docRef, id)

        await deleteDoc(ref)
            .catch(error => {
                setError(error.message)
            })
    }

    return {deleteDocument, error}
}