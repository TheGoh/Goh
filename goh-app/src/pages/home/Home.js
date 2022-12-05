//import { useAuthContext } from '../../hooks/useAuthContext'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

// styles
import styles from './Home.module.css';
import logo from '../../imgs/GohLogo.png'
// components




export default function Home() {
  //const { user } = useAuthContext()

  return (
    <Box className={styles['bg-box']}>
      {/* <div>
      <h2>HOME</h2>
      <p></p>
    </div> */}
      <Grid container sx={{margin: '100px auto', width: '1000px'}}>
        <Paper className={styles['txt-container']} elevation={3}>
          <h1>Home</h1>
          <Box sx={{width: "75%", margin: "auto"}}>
            <p>
            At Goh we would like to provide a utility that can aid students in completing projects. 
            Thus, Goh strives to optimize and assist groups in coordinating, planning, and executing projects. 
            </p>
            <img src={logo}></img>
            
          </Box>
          
        </Paper>
      </Grid>
      
    </Box>
    
  )
}