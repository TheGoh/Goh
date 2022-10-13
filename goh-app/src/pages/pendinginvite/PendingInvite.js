
import { useEffect, useState } from 'react'
import Select from 'react-select'
import { useAuthContext } from '../../hooks/useAuthContext'
import { firedb } from '../../firebase/config';
import { doc, getDoc, onSnapshot } from "firebase/firestore"


export default function PendingInvite() {
    const { user } = useAuthContext()
    const [ inviteList, setinviteList ] = useState([])
    const [ map, setMap ] = useState()
    //const { documents: userDetail } = useFetchProject('users', user.uid )

    useEffect(() => {
        const retrieve = async() => {
            const currUserDoc = doc(firedb, `users`, user.uid);

                onSnapshot(currUserDoc, (doc) => {
                    if (inviteList.length !== Object.keys(doc.data().invitations).length) {
                        let result = []
                        Object.keys(doc.data().invitations).forEach(item => {
                            result.push({value:item, label: doc.data().invitations[item] })
                        })
                        const options = result.map(item => {
                            return {value: item.value, label: item.label}
                        })
                        setinviteList(options)
                        console.log(inviteList)

                    }                   
                });
            //}
        }
        retrieve()
    }, [inviteList])

    return (
        <div> 
            <h1>Here's your invitation from project manager</h1>
            {/* <Select
                onChange = {(option) => setinviteList(option)}
                options = {inviteList}
            /> */}
        </div>
    )
}