
//dependencies
import { useAuthContext } from '../hooks/useAuthContext';
import { Link } from "react-router-dom";
import { useLogout } from '../hooks/useLogout';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Avatar from './Avatar.js';
import Notification from '../pages/notification/Notification';
import Invitation from '../pages/notification/Invitation';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

import LogoutIcon from '@mui/icons-material/Logout';
import InventoryIcon from '@mui/icons-material/Inventory';
import SettingsIcon from '@mui/icons-material/Settings';

//styles
import styles from './Navbar.module.css'
import { useEffect } from 'react'

export default function Nav() {
    const { logout } = useLogout()
    const { user } = useAuthContext()
    // const { notification } = useFirestore()
    useEffect(() => {

    }, [user])

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
                        <li>
                            <ButtonGroup>
                            <Button component={Link} to="/project/projectcreate"><InventoryIcon/></Button>
                            <Button component={Link} to="/accountInfo"><SettingsIcon/></Button>
                            </ButtonGroup>
                        </li>
                        <li><Link to="/notification">Notification</Link></li>
                        <li><Link to="/calendar">Calendar</Link></li>
                        <li><a onClick={ logout }> Logout</a></li>
                        <li><Avatar src = {user.photoURL}/></li>
                        </>
                )}


            </ul>

        </nav>
    )
}

