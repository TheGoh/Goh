import { useState } from 'react'

import { 
    doc,
    getDoc,
    setDoc,
    updateDoc
    } from "firebase/firestore"
   
import { firedb } from '../firebase/config';
import { v4 as uuid } from 'uuid';

export const useTask = () =>{

}