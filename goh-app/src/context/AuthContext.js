import { createContext, userReducer } from 'react' 

export const AuthContext = createContext() 

export const authReducer = (state, action) => {
    switch (action.type) {
        //login or logout


        //for now we only keep default
        default: 
            return state
    }
}

export const AuthContextProvider = ({children}) => {

    const [state, dispatch] = userReducer(authReducer, {
        user: null
    })



    return (
        // there will be more state to be added
        <AuthContext.Provider value = {{...state, dispatch}}> 
            {children}
        </AuthContext.Provider>
    )
}