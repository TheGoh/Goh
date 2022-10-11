/* Project Creation and Selection */

//Functionality
import { useState } from 'react';
import { getAuth } from 'firebase/auth'
import { useCollection } from '../../../hooks/useCollection';
import { useProject } from '../../../hooks/useProject';
import { firedb } from '../../../firebase/config';
import { doc, getDoc } from "firebase/firestore"

//Html components
import styles from './ProjectCreate.module.css';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';

export default function Project() {
    /* React states */
    const [open, setOpen] = useState(''); // form dialog open/close
    const [projName, setProjName] = useState('');
    const [projDescr, setProjDescr] = useState('');
    const [projOwned, setProjOwned] = useState(''); // hold current user owned projects
    const { createProject, error } = useProject();
    const { documents: allProjects } = useCollection('projects',null);
    
    /* Fetch the current user project list */
    const user = getAuth().currentUser;
    let ownProjectList = null;
    const currUserDoc = doc(firedb, `users`, user.uid);
    getDoc(currUserDoc)
    .then((doc) => {
        ownProjectList = doc.data().ownedProjects;
    })
    .then(() => {
        if (allProjects !== null) {
            setProjOwned(allProjects.filter((element) => { //only get owned projects
                if (ownProjectList !== undefined) {
                    if (ownProjectList.includes(element.id)) return element;
                }
            }));
        }
    });

    /* Form control */
    const handleClickOpen = () => { //popup form
        console.log(projOwned);
        setOpen(true);
    };
    const handleClose = () => { //close form and clear inputs
        setProjName('');
        setProjDescr('');
        setOpen(false);
    }
    const handleSubmit = (event) => { //close form and save project
        event.preventDefault();
        createProject(user.uid, projName, projDescr);
        setProjName('');
        setProjDescr('');
        setOpen(false);
    };
   
    return ( 
        <Box sx={{ p: 2, border: '1px dashed grey' }}>
            <Grid container spacing={5} 
                  className={styles['project-grid']} 
                  columns={5} 
                  sx={{ border: '1px dashed grey', width: '90%', margin: 'auto' }}>
                <Grid item xs={1}>
                    <Button variant="outlined" className={styles['project-grid-button']} onClick={handleClickOpen}>
                        <AddIcon fontSize="large"/>
                    </Button>
                </Grid>              
            </Grid>

            {/* Popup form */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Create Project</DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{textIndent:'0px'}}>
                            To create a project, please enter your project details. We
                            will send updates occasionally.
                        </DialogContentText>

                        <Grid container sx={{marginTop: '20px'}} columns={1}>
                            <Grid xs={1} sx={{marginBottom: '20px'}}>
                                <FormControl sx={{width: "100%"}}>
                                    <InputLabel htmlFor="component-outlined">Project Name</InputLabel>
                                    <OutlinedInput
                                    id="component-outlined"
                                    value={projName}
                                    label="ProjectName"
                                    onChange = {(e)=>setProjName(e.target.value)}
                                    type="text"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid xs={1}>
                                <FormControl sx={{width: "100%"}}>
                                    <InputLabel htmlFor="component-outlined">Project Description</InputLabel>
                                    <OutlinedInput
                                    id="component-outlined"
                                    value={projDescr}
                                    label="ProjectDescription"
                                    onChange = {(e)=>setProjDescr(e.target.value)}
                                    type="text"
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </DialogContent>
                <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Create</Button> 
                </DialogActions>
            </Dialog>
        </Box>

   )
}