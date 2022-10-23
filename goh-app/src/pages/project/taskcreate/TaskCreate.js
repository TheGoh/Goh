import { v4 as uuid } from 'uuid';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useFetchProject } from '../../../hooks/useFetchProject'
import { useTask } from '../../../hooks/useTask';
import { useCollection } from '../../../hooks/useCollection';
import { Link } from "react-router-dom";
import { firedb } from '../../../firebase/config';
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore"
import  Select  from 'react-select';

import styles from './TaskCreate.module.css';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import { useAuthContext } from '../../../hooks/useAuthContext';

export default function Task() {
    const [open, setOpen] = useState(''); // form dialog open/close
    let { projectId, userUid } = useParams();
    const { documents: projectDtl } = useFetchProject('projects', projectId);
    const { documents: task_collections } = useCollection(`projects/${projectId}/tasks`, null);
    const [taskName, setTaskName] = useState('');
    const [taskDescr, setTaskDescr] = useState('');
    const [task_ids, setTaskIds] = useState('');
    const [task_dict, setTaskDict] = useState('');
    const { user } = useAuthContext();
    const currUserId = user.uid;
    const taskStatesOwner  = [
      { value: 'TODO', label: 'TODO' },
      { value: 'IN PROGRESS', label: 'IN PROGRESS' },
      { value: 'IN REVIEW', label: 'IN REVIEW'},
      { value: 'COMPLETED', label: 'COMPLETED'}]
    const taskStatesMember = [
      { value: 'TODO', label: 'TODO' },
      { value: 'IN PROGRESS', label: 'IN PROGRESS' },
      { value: 'IN REVIEW', label: 'IN REVIEW'}]

    const { createTask } = useTask();
    /* Form control */
    const handleClickOpen = () => { //popup form
      setOpen(true);
    };
    const handleClose = () => { //close form and clear inputs
      setTaskName('');
      setTaskDescr('');
      setOpen(false);
    }
    const handleSubmit = (event) => {
      //event.preventDefault();
      const taskid = uuid();
      createTask(projectId, userUid, taskid, taskName, taskDescr);
      setTaskName('');
      setTaskDescr('');
      setOpen(false);
    }

    /* Fetch new tasks list */ 
    useEffect(() => {
      if (task_collections) {
        console.log(task_collections);
      //update task_ids if task collection changes
      const updateList = async() => {
        const temp_collection = await task_collections;
        let temp_ids = [];
        let temp_id_dict = {};
        if (temp_collection !== null) {
          temp_collection.forEach(task => {
            temp_ids.push(task.id);
            temp_id_dict[task.id] = task;
          });
        }
        setTaskIds(temp_ids);
        setTaskDict(temp_id_dict);
      }
      updateList();
      }
    }, [task_collections]);
    const handleStateUpdate = (state, task) => {
      const curProjDoc = doc(firedb, `projects/${projectId}/tasks`, task_dict[task].taskId);
      getDoc(curProjDoc).then((doc) => {
        let owner = doc.data().ownerid;
        if ((state.value === "IN PROGRESS" || state.value === "IN REVIEW") && (currUserId !== owner)) {
          updateDoc(curProjDoc, {
            taskState: state.value,
            currUserId: currUserId
          })
        } else {
          updateDoc(curProjDoc, {
            taskState: state.value,
            currUserId: ""
          })
        }
      })
    }

    if (!projectDtl && task_ids == []) {
      return <div> Loading... </div>
    }
    return(
        // <Link to= {`/project/${projectId}`} key = {projectId} onClick={handleSubmit}> Save </Link>
        <Box>
          <Grid container spacing={5} columns={6} sx={{width: '90%', margin: 'auto'}}>
              <Grid item xs={1}>
                  <Button variant="outlined" className={styles['task-grid-button']} onClick={handleClickOpen}><LibraryAddIcon/></Button>
              </Grid>
              {
                task_ids.length > 0 && task_ids.map((task) => 
                <Grid item xs={1} key={task}>
                  <Select
                      onChange={(state) => {
                        //setCurrTaskState(state);
                        handleStateUpdate(state, task);
                      }}
                      options = {taskStatesMember}
                    />
                  <Link to={`/project/taskinfo/${projectId}/${task_dict[task].taskId}`} style={{ textDecoration: 'none' }}>
                    <Button variant="contained" className={styles['task-grid-button']}>
                      {task_dict[task].taskName}
                    </Button>
                  </Link>
                </Grid>
              )}
          </Grid>

          {/* Popup form */}
          <Dialog open={Boolean(open)} onClose={handleClose}>
            <DialogTitle>Create Task</DialogTitle>
              <DialogContent>
                <DialogContentText sx={{textIndent:'0px'}}>
                  To create a task, please enter your task details. We
                  will send updates occasionally.
                </DialogContentText>

                <Grid container sx={{marginTop: '20px'}} columns={1}>
                  <Grid item xs={1} sx={{marginBottom: '20px'}}>
                    <FormControl sx={{width: "100%"}}>
                      <InputLabel htmlFor="component-outlined">Task Name</InputLabel>
                      <OutlinedInput
                      id="component-outlined"
                      value={taskName}
                      label="TaskName"
                      onChange = {(e)=>setTaskName(e.target.value)}
                      type="text"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={1}>
                    <FormControl sx={{width: "100%"}}>
                      <InputLabel htmlFor="component-outlined">Task Description</InputLabel>
                      <OutlinedInput
                      id="component-outlined"
                      value={taskDescr}
                      label="TaskDescription"
                      onChange = {(e)=>setTaskDescr(e.target.value)}
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