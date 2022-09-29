import { AuthContext } from "../context/AuthContext"
import { useContext } from 'react'

export const useAuthContext = () => {
    const context = useContext(AuthContext)

    //checking if there isn't a context
    if (!context) {
        throw Error('authcontext error')
    }

    return context
}