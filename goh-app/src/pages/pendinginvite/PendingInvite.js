
import { useEffect, useState } from 'react'
import Select from 'react-select'
import { useAuthContext } from '../../hooks/useAuthContext'
import { firedb } from '../../firebase/config';
import { doc, getDoc, onSnapshot } from "firebase/firestore"


export default function PendingInvite() {
    const { user } = useAuthContext()
    const [ inviteList, setinviteList ] = useState([])
    //const { documents: userDetail } = useFetchProject('users', user.uid )

    useEffect(() => {
        const retrieve = async() => {
            const currUserDoc = doc(firedb, `users`, user.uid);
            const userSnapShot = await getDoc(currUserDoc)
            if (userSnapShot.exists()) {
                onSnapshot(currUserDoc, (doc) => {
                //console.log(doc.data().invitations)
                setinviteList(doc.data().invitations);
                console.log(inviteList)
            });
            }
        }
        retrieve()
    }, [])

    return (
        <div> 
            <h1>Here's your invitation from project manager</h1>
            <Select 
                options = {inviteList}
            />
        </div>
    )
}