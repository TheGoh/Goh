import { async } from '@firebase/util'
import { useState } from 'react'

import { v4 as uuid } from 'uuid';
export const useNotification =()=>{
    const[error, setError] = useState('')
    const createNoti = async(senderId, ReceiverId, message)=>{
        setError(null)
        
        //may delete the id of message
        const messid = uuid();

        if(!ReceiverId.exists()){
            console.log('Wrong ID to receive message')
        }
        if (!message.exists()) {
            console.log('No message detected')
        }
        try{
            postMessage(message,senderId, ReceiverId)
        } catch(error){
            console.log('error when sending message')
        }
    }
    return null
}