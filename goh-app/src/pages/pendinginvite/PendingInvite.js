
import { useEffect, useState } from 'react'
import Select from 'react-select'
import { useAuthContext } from '../../hooks/useAuthContext'
import { firedb } from '../../firebase/config';
import { doc, getDoc, onSnapshot } from "firebase/firestore"
import { useFetchProject } from '../../hooks/useFetchProject'


export default function PendingInvite() {
    const { user } = useAuthContext()
    const [ inviteList, setinviteList ] = useState([])
    const { documents: userDetail } = useFetchProject('users', user.uid )
    
    useEffect(() => {
        if (userDetail) {
            if (inviteList.length !== Object.keys(userDetail.invitations).length) {
                let result = inviteList
                Object.keys(userDetail.invitations).forEach(item => {
                    if (!result.includes(item)) {
                        result.push({value:item, label: userDetail.invitations[item]});
                    }
                })
                //console.log(result)
                setinviteList(result)
                console.log("myList: ", inviteList)

                //console.log("inviteList.length: " + inviteList.length + " map length: " + Object.keys(userDetail.invitations).length)
            } 
        }
    }, [userDetail, inviteList])
    
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