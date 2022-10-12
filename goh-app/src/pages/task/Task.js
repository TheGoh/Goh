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

// styles
import styles from './Signup.module.css'
import { 
auth, 
firedb, 
createUserDocumentFromAuth,
signInWithGooglePopup
} from '../../firebase/config';