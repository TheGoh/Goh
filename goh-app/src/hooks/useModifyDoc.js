
import { firedb } from '../firebase/config';

import { useState } from 'react' 
import { doc, updateDoc } from 'firebase/firestore'

export const useSetDoc = () => { 
    const [error, setError] = useState(null)

    const modifyDocument = async(docRef, id, projName, projDescr) => {
        let ref = doc(firedb, docRef, id)
        const currName = ref.projName;
        const currDescr = ref.projDescr;
        if (currName !== projName) {
            await updateDoc(ref, {
                projName: projName
            })
                .catch(error => {
                    setError(error.message)
                })
        }
        if (currDescr !== projDescr) {
            await updateDoc(ref, {
                projDescr: projDescr
            })
                .catch(error => {
                    setError(error.message)
                })
        }
        
    }

    return {modifyDocument, error}
}