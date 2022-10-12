import { createContext, useEffect, useReducer } from 'react' 
//import {onAuthStateChanged} from 'firebase/auth'
import { auth } from '../firebase/config'

export const AuthContext = createContext() 

export const authReducer = (state, action) => {
    switch (action.type) {
        //login or logout
        case 'LOGIN':
            return{...state, user: action.payload}
        case 'LOGOUT':
                return { ...state, user: null }       
        case 'AUTH_IS_READY':
                return { user: action.payload, authIsReady: true }
        default: 
            return state
    }
}

export const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(authReducer, { 
        user: null,
        authIsReady: false
      })
    
    useEffect(() => {
        const unsub = auth.onAuthStateChanged(user => {
            dispatch({type: 'AUTH_IS_READY', playload: user})
        unsub()
        })
    },[])

    //console.log('AuthContext state:', state)

    return (
        // there will be more state to be added
        <AuthContext.Provider value = {{...state, dispatch}}> 
            {children}
        </AuthContext.Provider>
    )
}