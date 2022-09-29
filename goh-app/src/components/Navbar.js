//dependencies
import { Link } from "react-router-dom"
//import { useAuthContext } from "../hooks/useAuthContext"
//import { useLogout } from '../hooks/useLogout'

//styles
import styles from './Navbar.module.css'

export default function Nav() {
    //const { logout } = useLogout()
    //const { user } = useAuthContext()

    return (
        <nav className={styles.navbar}>
            <ul>
                <li className={styles.title}>Goh App</li>
                
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/signup">Signup</Link></li>

            </ul>
    </nav>
    )
}

