import { useState } from 'react' 

//firebase import
import { auth } from '../firebase/config'
import { signOut } from 'firebase/auth'
import { useAuthContext } from './useAuthContext'

export const useLogout = () => {
    const { dispatch } = useAuthContext()
    //function for user to logout only they already logged in
    const logout = () => {    
        signOut(auth)
            .then(() => {
                dispatch({type: 'LOGOUT'})
                console.log('user logged out')
            })
            .catch((error) => {
                console.log(error.message)
            })
      }

    return { logout }
}