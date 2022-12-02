import { useAuthContext } from '../hooks/useAuthContext';
import { Link } from "react-router-dom";
import { useLogout } from '../hooks/useLogout';
import { useEffect } from 'react'

import styles from './Navbar.module.css'

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ButtonGroup from '@mui/material/ButtonGroup';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HomeIcon from '@mui/icons-material/Home';
import InventoryIcon from '@mui/icons-material/Inventory';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { createTheme } from '@mui/material/styles';
import { blue } from '@mui/material/colors';



import Notification from '../pages/notification/Notification';
import Invitation from '../pages/notification/Invitation';
import Avatar from './Avatar.js';
import Govatar from './Govatar.js';

const BAR_THEME = createTheme({
    palette: {
        primary: {
            main: blue[900],
        },
    },
});


export default function Gohbar() {
    const { logout } = useLogout()
    const { user } = useAuthContext()
    // const { notification } = useFirestore()
    useEffect(() => {

    }, [user])

    return (
        <Box>
            <AppBar position="static" theme={BAR_THEME} sx={{fontStyle: 'italic'}}>
                <Toolbar className={styles['container']}>
                    <IconButton component={Link} to="/" endicon={<HomeIcon/>} color="inherit"><HomeIcon/></IconButton>
                    <h1 className={styles['container']}>Goh</h1>
                    {
                        user ?
                        <Grid container columns={2}>
                            
                            <Grid item xs={1}></Grid>
                            <Grid item xs={1} sx={{display: "flex", justifyContent: "flex-end"}}>
                                <ButtonGroup color="inherit">
                                    <Button component={Link} to="/project/projectcreate"><InventoryIcon/></Button>
                                    <Button component={Link} to="/accountInfo"><SettingsIcon/></Button>
                                    <Button component={Link} to="/calendar"><CalendarMonthIcon/></Button>
                                </ButtonGroup>
                                <Divider variant="middle"/>
                                <ButtonGroup color="inherit">
                                    <Notification/>
                                    <Invitation/>
                                    <Button onClick={logout}><LogoutIcon/></Button>
                                </ButtonGroup>
                                <Divider variant="middle"/>
                                <Govatar src = {user.photoURL}/>
                            </Grid>
                        </Grid>
                        :
                        <Grid container columns={2}>
                            <Grid item xs={1}></Grid>
                            <Grid item xs={1} sx={{display: "flex", justifyContent: "flex-end"}}>
                                <ButtonGroup color="inherit">
                                    <Button component={Link} to="/login"><LoginIcon/></Button>
                                    <Button component={Link} to="/signup"><PersonAddIcon/></Button>
                                </ButtonGroup>
                            </Grid>
                        </Grid>
                        
                    }
                </Toolbar>
            </AppBar>
        </Box>
    )
}