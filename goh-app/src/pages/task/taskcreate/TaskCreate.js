/* Project Creation and Selection */

//Functionality
import React, { useState } from 'react';
import { getAuth } from 'firebase/auth'
import { useCollection } from '../../../hooks/useCollection';
import { useProject } from '../../../hooks/useProject';
import { firedb } from '../../../firebase/config';
import { doc, getDoc } from "firebase/firestore"

//Html components
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import styles from './ProjectCreate.module.css';
import  './task.css';

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
import { useTask } from '../../../hooks/useTask';

export default function Project() {
    /* React states */
    const [open, setOpen] = useState(''); // form dialog open/close
    const [projName, setProjName] = useState('');
    const [projDescr, setProjDescr] = useState('');
    const [projOwned, setProjOwned] = useState(''); // hold current user owned projects
    const [projOwnedIds, setProjOwnedIds] = useState(''); // hold all owned project ids for searching in projOwned
    // const { createProject, error } = useProject();  
      const { createTask, f} = useTask();

    const { documents: allProjects } = useCollection('projects',null);
    const { documents: ffff } = useCollection('tasks',null);


    const [curProjectId, setCurProjectId] = useState(''); // form dialog open/close

    const [taskList, setTaskList] = useState(''); // form dialog open/close

    /* Fetch the current user project list */
    let ownProjectList = null;
    const user = getAuth().currentUser;
    const currUserDoc = doc(firedb, `users`, user.uid);
    const PROJECT_NAMES = [];
    const PROJECT_DESCRIPTIONS = [];

    getDoc(currUserDoc)
    .then((doc) => {
        ownProjectList = doc.data().ownedProjects;
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
                items_dict[item.id] = item;
                items_ids.push(item.id);
            });
            setProjOwned(items_dict);
            setProjOwnedIds(items_ids);
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
        createTask(curProjectId,user.uid, projName, projDescr);
        setProjName('');
        setProjDescr('');
        setOpen(false);
        // window.location.reload();
    };

    /* Dynamic add/delete */
    const addToList = () => {
        console.log(projOwnedIds);
    };

    const test1 = [1,2,3,4,5,6,7,8,9,10];

    //打开一个project
    const openTaskList = (id)=>{
        setCurProjectId(id) ;

        
        console.log(ffff)
        if (ffff !== null){
            setTaskList(ffff)
        }
    }
       
    return ( 
        <div class='addtask'>
        <List sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {
            !allProjects ? '': allProjects.map((item,index)=>{
                return     ( <React.Fragment> 
                  <ListItem alignItems="flex-start"   selected={curProjectId === item.id} onClick={(e)=>{openTaskList(item.id)}}>
                <ListItemText
                  primary={item.projName}
                />
              </ListItem>
              <Divider component="li" /></React.Fragment>) 
              }
               
            )
        }


    </List>
        <Box sx={{ p: 2, border: '1px dashed grey' ,width: '65vw' }}>

        {
            !taskList ? '': taskList.map((item,index)=>{
                return     ( <React.Fragment> 
                  <ListItem alignItems="flex-start"  >
                <ListItemText
                  primary={item.taskName}
                />
              </ListItem>
              <Divider component="li" /></React.Fragment>) 
              }
               
            )
        }

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
            </Grid>

            {/* Popup form */}
            <Dialog open={Boolean(open)} onClose={handleClose}>
                <DialogTitle>Create Task</DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{textIndent:'0px'}}>
                            To create a Task, please enter your task details. We
                            will send updates occasionally.
                        </DialogContentText>

                        <Grid container sx={{marginTop: '20px'}} columns={1}>
                            <Grid item xs={1} sx={{marginBottom: '20px'}}>
                                <FormControl sx={{width: "100%"}}>
                                    <InputLabel htmlFor="component-outlined">Task Name</InputLabel>
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
                                    <InputLabel htmlFor="component-outlined">Task Description</InputLabel>
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
        </div>
   )
}