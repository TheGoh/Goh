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
      <p>Group and collaborative environments have struggled to coordinate and 
          credit the contributions done by the individuals of the group. Our goal is to deliver 
        a web application that can bring together the functionality of a project task manager 
        where users can communicate, collaborate, and track their project. Additionally, generating an analytical report of the contributions of each group member that can be viewed after the completion of the project.</p>
    </div> */}
      <Grid container sx={{margin: '100px auto', width: '1000px'}}>
        <Paper className={styles['txt-container']} elevation={3}>
          <h1>Home</h1>
          <Box sx={{width: "75%", margin: "auto"}}>
            <p>
            Group and collaborative environments have struggled to coordinate and 
            credit the contributions done by the individuals of the group. Our goal is to deliver 
            a web application that can bring together the functionality of a project task manager 
            where users can communicate, collaborate, and track their project. Additionally, 
            generating an analytical report of the contributions of each group member that can be 
            viewed after the completion of the project.
            </p>
            <img src={logo}></img>
            
          </Box>
          
        </Paper>
      </Grid>
      
    </Box>
    
  )
}