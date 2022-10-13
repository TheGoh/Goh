/* Project Creation and Selection */

//Functionality
import { useState, useEffect } from 'react';
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useCollection } from '../../../hooks/useCollection';
import { useProject } from '../../../hooks/useProject';
import { firedb } from '../../../firebase/config';
import { doc, getDoc, onSnapshot } from "firebase/firestore"
import { v4 as uuid } from 'uuid';

//routing
import { Link } from "react-router-dom";

//Html components
import styles from './ProjectCreate.module.css';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
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

// let snapshots = [];

export default function ProjectCreate() {
    /* React states */
    const [open, setOpen] = useState(''); // form dialog open/close
    const [projName, setProjName] = useState('');
    const [projDescr, setProjDescr] = useState('');
    const { createProject, projid, error } = useProject();
    const { documents: allProjects , error2} = useCollection('projects', null);
    const [user_owned_ids, setUserOwnedIds] = useState('');
    const [all_projects_dict, setAllProjectsDict] = useState('');


    /* Fetch the current user project list */
    const { user } = useAuthContext()
    
    
    useEffect(() => {
        const retrieve = async() => {
        const currUserDoc = doc(firedb, `users`, user.uid);
        const userSnapShot = await getDoc(currUserDoc)
        if (userSnapShot.exists()) {
            //console.log("111")
            onSnapshot(currUserDoc, (doc) => {
            if (user_owned_ids.length !== doc.data().ownedProjects.length) {
                    setUserOwnedIds(doc.data().ownedProjects);
                }                  
        });
        }
        //console.log("11111")
        if (allProjects !== null) {
            let temp = {};
            allProjects.forEach(project => {
                temp[project.id] = project;
            });
            setAllProjectsDict(temp);
        }  
        }
        retrieve()
    }, [user_owned_ids, allProjects]);

    
    
    /* Form control */
    const handleClickOpen = () => { //popup form
        //console.log(projOwned);
        setOpen(true);
    };
    const handleClose = () => { //close form and clear inputs
        setProjName('');
        setProjDescr('');
        setOpen(false);
    }
    const handleSubmit = (event) => { //close form and save project
        event.preventDefault();
        const projid = uuid();
        createProject(user.uid, projid, projName, projDescr);
        setProjName('');
        setProjDescr('');
        setOpen(false);
    };
    
    if (allProjects === null || Object.keys(all_projects_dict).length === 0) return (<div>Loading</div>)
    else return ( 
        <Box sx={{ p: 2, border: '1px dashed grey' }}>

            {/* Projects display */}
            <Grid container spacing={5} 
                  className={styles['project-grid']} 
                  columns={5} 
                  sx={{ border: '1px dashed grey', width: '90%', margin: 'auto' }}>
                <Grid item xs={1}>
                    <Button variant="outlined" className={styles['project-grid-button']} onClick={handleClickOpen}>
                        <AddIcon fontSize="large"/>
                    </Button>
                </Grid>
                {user_owned_ids.length > 0 && user_owned_ids.map((item) => 
                    
                        <Grid item xs={1} key = {item}>
                        <Link to = {`/project/${all_projects_dict[item].id}`} key = {all_projects_dict[item].id}>
                            <Button variant="contained" className={styles['project-grid-button']}>
                                {
                                    all_projects_dict[item].projName
                                }
                            </Button>
                        </Link>
                        </Grid>
                    
                )}
            </Grid>

            {/* Popup form */}
            <Dialog open={Boolean(open)} onClose={handleClose}>
                <DialogTitle>Create Project</DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{textIndent:'0px'}}>
                            To create a project, please enter your project details. We
                            will send updates occasionally.
                        </DialogContentText>

                        <Grid container sx={{marginTop: '20px'}} columns={1}>
                            <Grid item xs={1} sx={{marginBottom: '20px'}}>
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
                            <Grid item xs={1}>
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