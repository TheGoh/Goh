//import firebase lib
import { useState } from "react";
import { useLogin } from '../../hooks/useLogin';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import logo from '../../imgs/GohLogo.png'

//TODO: ERROR Message Field!!!

// styles
import styles from './Login.module.css'

export default function Login() {
  
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const { login, error ,isPending } = useLogin()

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password)
  }


  return (


    <Box height="100vh" display="flex" className={styles['fulfill']}>
      <Grid container sx={{margin: '100px auto', width: '1000px'}} className={styles['container']}>
      
      <Box sx={{ width:'50%'}} className={styles['intro']}>
        <img src={logo}></img>
        <Grid container sx={{margin: 'auto', width: '100%', marginTop: '75px'}} columns={3}>
          <Grid item xs={1}></Grid> <Grid item xs={1}></Grid>
          <Grid item className={styles['links']} xs={1}>
            <Link to="/signup" className={styles['links']}>Don't have an account yet?</Link>
          </Grid>
        </Grid>
      </Box>
      
      <Grid component="form" onSubmit={handleSubmit}
        sx={{p: 2}}
        className={styles['login-form']}
      >
        <h1>Welcome back!</h1>
        <h3>Login to your account</h3>
        <Grid sx={{width: '90%', margin: '20px auto'}}>
          <FormControl sx={{width: "100%"}}>
            <InputLabel htmlFor="component-outlined">Email</InputLabel>
            <OutlinedInput
              id="component-outlined1"
              value={email}
              label="Email"
              onChange={(e)=> setEmail(e.target.value)}
              type="email"
            />
          </FormControl>
        </Grid>
        
        <Grid sx={{width: '90%', margin: '20px auto'}}>
          <FormControl sx={{width: "100%"}}>
              <InputLabel htmlFor="component-outlined">Password</InputLabel>
              <OutlinedInput
                id="component-outlined2"
                value={password}
                label="Password"
                onChange={(e => setPassword(e.target.value))}
                type="password"
                autoComplete="on"
              />
          </FormControl>
        </Grid>

        <Grid sx={{width: '90%', margin: '20px auto'}}>
          <Button sx={{width: '50%'}} variant="contained" type="submit">Login</Button>         
        </Grid>
      </Grid>
    </Grid>
    </Box>
    
  )
}