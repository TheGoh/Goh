import { firedb } from '../firebase/config';
import { useState } from 'react' 
import { doc, updateDoc } from 'firebase/firestore'

export const useSetTask = () => { 
    const [error, setError] = useState(null)

    const modifyTask = (docRef, id, taskName, taskDescr) => {
        let ref = doc(firedb, docRef, id)
        updateDoc(ref, {projName: projName }).catch(error => {
                setError(error.message)
            })
        updateDoc(ref, {projDescr: projDescr}).catch(error => {
                setError(error.message)
            })
        
    }

    return {modifyTask, error}
}