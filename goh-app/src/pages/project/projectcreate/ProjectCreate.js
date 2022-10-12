/* Project Creation and Selection */

//Functionality
import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth'
import { useCollection } from '../../../hooks/useCollection';
import { useProject } from '../../../hooks/useProject';
import { firedb } from '../../../firebase/config';
import { doc, getDoc, onSnapshot } from "firebase/firestore"
import { v4 as uuid } from 'uuid';

//routing
import { Link } from "react-router-dom";

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

let project_owned = {}; // hold current user owned projects
let project_owned_ids = []; // hold all owned project ids for searching in projOwned
let ownProjectList = [];

export default function Project() {
    /* React states */
    const [open, setOpen] = useState(''); // form dialog open/close
    const [projName, setProjName] = useState('');
    const [projDescr, setProjDescr] = useState('');
    const [projOwned, setProjOwned] = useState(''); // hold current user owned projects
    const [projOwnedIds, setProjOwnedIds] = useState(''); // hold all owned project ids for searching in projOwned
    const { createProject, projid, error } = useProject();
    const { documents: allProjects } = useCollection('projects',null);
    

    /* Fetch the current user project list */
    const user = getAuth().currentUser;
    const currUserDoc = doc(firedb, `users`, user.uid);

    useEffect(() => {
        updateUserProjectList();
        //console.log(project_owned_ids);
    });

    function updateUserProjectList() {
        getDoc(currUserDoc)
        .then((doc) => {
            ownProjectList = doc.data().ownedProjects;
            // console.log(ownProjectList);
            // console.log(allProjects);
            
        })
        .then(() => {
            if (allProjects !== null) {
                let items_arr = allProjects.filter((element) => { //only get owned projects
                    if (ownProjectList !== undefined) {
                        if (ownProjectList.includes(element.id)) return element;
                    }
                })
                let items_dict = {};
                let items_ids = [];
                items_arr.forEach((item) => {
                    // [project_id, project_name, project_description]
                    items_dict[item.id] = [item.id, item.projName, item.projDescr];
                    items_ids.push(item.id);
                });
                project_owned = items_dict;
                project_owned_ids = items_ids;
                // console.log(project_owned)
            }
        });
        // console.log(allProjects);
        // console.log(project_owned_ids);
    }
    
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
        console.log(projid);

        //update global storage
        project_owned_ids.push(projid);
        project_owned[projid] = [projid, projName, projDescr];

        setProjName('');
        setProjDescr('');
        setOpen(false);
    };

    const test1 = [1,2,3,4,5,6,7,8,9,10];
       
    return ( 
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
                {project_owned_ids.length > 0 && project_owned_ids.map((item) => 
                    <Grid item xs={1}>
                        <Link to = {`/project/${project_owned[item][0]}`} key = {project_owned[item][0]}>
                            <Button variant="contained" className={styles['project-grid-button']}>
                                {
                                    project_owned[item][1]
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