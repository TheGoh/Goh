import { useState } from 'react'
import { useSignup } from '../../hooks/useSignup';
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import logo from '../../imgs/GohLogo.png'
import { Alert } from '@mui/material';

// styles
import styles from './Signup.module.css'

//TODO: ERROR Message Field!!!

// components
export default function Signup() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [userid, setUserid] = useState('')
    const {signup,  error ,isPending} = useSignup()
    const handleSubmit = (e) => {
      e.preventDefault();

      signup(email,password,userid);
    }
    return (
      <Box height="100vh" display="flex" className={styles['fulfill']}>
        <Grid container sx={{margin: '100px auto', width: '1000px'}} className={styles['container']}>
          
          <Box sx={{ width:'50%'}} className={styles['intro']}>
            <img src={logo}></img>
            <Grid container sx={{margin: 'auto', width: '100%', marginTop: '155px'}} columns={3}>
              <Grid item xs={1}></Grid> <Grid item xs={1}></Grid>
              <Grid item className={styles['links']} xs={1}>
                <Link to="/login" className={styles['links']}>Already have an account?</Link>
              </Grid>
            </Grid>
          </Box>
          
          <Grid component="form" onSubmit={handleSubmit}
            sx={{p: 2}}
            className={styles['login-form']}
          >
          
            <h1>Welcome!</h1>
            <h3>Signup to your account</h3>
            {error ? <Alert severity="warning" sx={{height: '6%'}}>{error}</Alert> : <Box sx={{height: '7%'}}></Box> }
            {/* email button */}
            <Grid sx={{width: '90%', margin: '20px auto'}}>
              <FormControl sx={{width: "100%"}}>
                <InputLabel htmlFor="component-outlined">Email</InputLabel>
                <OutlinedInput
                  id="component-outlined1"
                  value={email}
                  label="Email"
                  onChange={(e)=> setEmail(e.target.value)}
                />
              </FormControl>
            </Grid>

            {/* Username button */}
            <Grid sx={{width: '90%', margin: '20px auto'}}>
              <FormControl sx={{width: "100%"}}>
                <InputLabel htmlFor="component-outlined">Username</InputLabel>
                <OutlinedInput
                  id="component-outlined2"
                  value={userid}
                  label="Username"
                  onChange={(e)=> setUserid(e.target.value)}
                />
              </FormControl>
            </Grid>
            
            {/* password button */}
            <Grid sx={{width: '90%', margin: '20px auto'}}>
              <FormControl sx={{width: "100%"}}>
                  <InputLabel htmlFor="component-outlined">Password</InputLabel>
                  <OutlinedInput
                    id="component-outlined3"
                    value={password}
                    label="Password"
                    onChange={(e => setPassword(e.target.value))}
                    type="password"
                    autoComplete="on"
                  />
              </FormControl>
            </Grid>
    
            <Grid sx={{width: '90%', margin: '20px auto'}}>
              {isPending ? <Button sx={{width: '50%'}} variant="contained" disabled>Pending</Button> : <Button sx={{width: '50%'}} variant="contained" type="submit">Sign Up</Button>}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    )
  }