import { createContext, useReducer } from 'react' 
//import { auth } from '../firebase/config'

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

    console.log('AuthContext state:', state)


    return (
        // there will be more state to be added
        <AuthContext.Provider value = {{...state, dispatch}}> 
            {children}
        </AuthContext.Provider>
    )
}