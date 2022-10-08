
//dependencies
import { useAuthContext } from '../hooks/useAuthContext';
import { Link } from "react-router-dom";
import { useLogout } from '../hooks/useLogout';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

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
                    <li><Link to="/login"><LoginIcon/></Link></li>
                    <li><Link to="/signup"><PersonAddIcon/></Link></li>
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

