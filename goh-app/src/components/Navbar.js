
//dependencies
import { useAuthContext } from '../hooks/useAuthContext'
import { Link } from "react-router-dom"
import { useLogout } from '../hooks/useLogout'

//styles
import styles from './Navbar.module.css'

export default function Nav() {
    const { logout } = useLogout()
    const { user } = useAuthContext()

    return (
        <nav className={styles.navbar}>
            <ul>
                <li className={styles.title}><Link to ='/'>Goh App</Link></li>
                
                {!user && (
                    <>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/signup">Sign Up</Link></li>
                    </>
                )}
                
                {user && (
                    <>
                        <li><Link to="/project/projectcreate">Add Project</Link></li>
                        <li><Link to="/accountInfo">Account Info</Link></li>
                        <li><a onClick={ logout }> Logout</a></li>
                    </>
                )}

                
            </ul>
           
        </nav>
    )
}

