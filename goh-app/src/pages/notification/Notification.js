import { useState } from 'react';
import { getAuth } from 'firebase/auth'

export default function Notification() {
    //const [message, setMessage] = useState('');
    const message = getAuth().message;

}