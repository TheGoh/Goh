/* Functionality dependencies */
import { useParams } from 'react-router-dom';
import { useDocument } from '../../../hooks/useDocument';
import { useCollection } from '../../../hooks/useCollection';
import { useFirestore } from '../../../hooks/useFirestore';
import { firedb } from '../../../firebase/config';
import { useAuthContext } from '../../../hooks/useAuthContext'
import { Link} from "react-router-dom";
import { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { collection, doc, getDoc, getDocs, updateDoc, query, where} from "firebase/firestore";

/* MUI components */
import styles from './ProjectInfo.module.css';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import TaskIcon from '@mui/icons-material/Task';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';

import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';

/* invitation form */
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { ButtonGroup } from '@mui/material';

/* Progress Bar */
function LinearProgressWithLabel(props) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 55 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(props.value,)}%`}</Typography>
        </Box>
      </Box>
    );
  }
  
  LinearProgressWithLabel.propTypes = {
    value: PropTypes.number.isRequired,
  };


export default function Project() {
    /* Project information variables */
    let { projectId } = useParams();
    const { deleteDocument, sendMsg, createTask } = useFirestore();
    const { documents: projectDtl , error} = useDocument('projects', projectId);
    const { user } = useAuthContext();
    const [invite, setInvite] = useState('');
    const [progress, setProgress] = useState(0);

    /* Task creation variables */
    const { documents: task_collections } = useCollection(`projects/${projectId}/tasks`, null);
    const [taskName, setTaskName] = useState('');
    const [taskDescr, setTaskDescr] = useState('');
    const [task_ids, setTaskIds] = useState('');
    const [task_dict, setTaskDict] = useState('');
    const [open, setOpen] = useState(''); // form dialog open/close
    const [currTaskId, setCurrTaskId] = useState('');
    const [currMemId, setCurrMemId] = useState('');
    let memList = {};
    if (projectDtl !== null) {
        memList = projectDtl.memberList.members;
    }


    /* Invitation and RoleTags */
    const [open2, setOpen2] = useState(''); // form dialog open/close
    const [roleTag, setRole] = useState('');

    /* Project operations starts */
    const handleProjectDelete = async(e) => {
        //remove from projects collection
        const ref = doc(firedb, `users`, user.uid)

        //remove from user's project id entry
        await getDoc(ref)
            .then (async(doc) => {
                let tempOwnedProjects = doc.data().ownedProjects;
                let tempList = tempOwnedProjects.filter((project) => {
                    if (projectId !== project) return project;
                })
                await updateDoc(ref, {
                     ownedProjects: tempList
                })
            })
        
        /* Delete project id from member project id list */     
        projectDtl.memberList["members"].forEach(async(member) => {
            const ref2 = doc(firedb, `users`, member.id)
            //remove from user's project id entry
            await getDoc(ref2)
                .then (async (doc) => {
                    let tempOwnedProjects = doc.data().ownedProjects;
                    let tempList = tempOwnedProjects.filter((project) => {
                        if (projectId !== project) return project;
                    })
                    await updateDoc(ref2, {
                            ownedProjects: tempList
                    })
            })
        })

        deleteDocument(`projects`, projectId)
    }
    

    const handleProjectInvitation = async(e) => {
        e.preventDefault();

        let ref = collection (firedb, 'users')
        if (invite) {
            ref = query(ref, where("email", "==", invite));
        }
        
        await getDocs(ref)
            .then((snapshot) => {
                let result = [];
                snapshot.docs.forEach(doc => {
                    result.push({...doc.data(), id: doc.id});
                });
                
                const receiver_uid = result[0].id;
                const currUserDoc = doc(firedb, `users`, receiver_uid);
                
                //update user's invitation list 
                getDoc(currUserDoc)
                    .then ((doc) => {
                        let invite_list = doc.data().invitations;

                        if (!invite_list[projectId] && !doc.data().ownedProjects.includes(projectId)) {

                            let tempRole = roleTag
                            if (!roleTag) {
                                tempRole = "member"
                            }
                
                            invite_list[projectId] = {
                                projName: projectDtl.projName,
                                roleTag: tempRole
                            }
                            
                            //notification
                            let message_list = doc.data().my_message;  
                            const time = new Date();
                            const message = user.displayName + "invite you to join " + projectDtl.projName;
                            const new_message = {
                                Sender: user.displayName,
                                Time: time,
                                message: message
                            }
                            message_list.push(new_message)

                            //update user metadata
                            updateDoc(currUserDoc, {
                                invitations: invite_list,
                                my_message: message_list
                                }
                            );
                        }
                        else {
                            console.log("already in this group")
                        }                
                    })
                setRole('')
                setInvite('')
                setOpen2(false)
            })
            .catch((err) => {
                setRole('')
                setInvite('')
                console.error("Invalid User");
            }); 
    }
    /* Project operations ends */

    /* Task creation starts */
    const handleClickOpen = () => { //popup form
        setOpen(true);
        console.log(projectDtl);
    };

    /* user invitation form */
    const handleClickOpen2 = () => { //popup invitation form
        setOpen2(true);
        console.log(projectDtl.memberList);
    }

    const handleClose2 = () => { //clear invitation form
        setInvite('');
        setRole('')
        setOpen2(false);
    }

    const handleClose = () => { //close form and clear inputs
        setTaskName('');
        setTaskDescr('');
        setOpen(false);
    }

    const handleTaskCreation = (event) => {
        //event.preventDefault();
        const taskid = uuid();
        createTask(projectId, user.uid, currMemId, taskid, taskName, taskDescr);
        if(currMemId !== ''){
            const time = new Date();
            const message = "task " + taskName + " has been assigned to you"
            const new_message = {
                Sender: user.displayName,
                Time: time,
                message: message
            }
            sendMsg(currMemId, new_message); 
        }
        setTaskName('');
        setTaskDescr('');
        setCurrMemId('');
        setOpen(false);
    }

    useEffect(() => {
        if (task_collections) {
            //update task_ids if task collection changes
            let temp_collection = task_collections;
            let sorted_collection = {};
            sorted_collection = temp_collection.sort((a,b) => {
                return a.taskName.localeCompare(b.taskName);
            })
            let temp_ids = [];
            let temp_id_dict = {};
            let count = 0;
            sorted_collection.forEach(task => {
                if (task.taskState == "COMPLETED") count++;
                temp_ids.push(task.id);
                temp_id_dict[task.id] = task;
            })
            setTaskIds(temp_ids);
            setTaskDict(temp_id_dict);

            setProgress((count / Object.keys(task_collections).length) * 100)
        }

    }, [task_collections]);

    // Task state changes
    const handleTakeTask = (task) => { //TODO to IN PROGRESS
        const currTaskDoc = doc(firedb, `projects/${projectId}/tasks`, task_dict[task].taskId);  
        updateDoc(currTaskDoc, {
            taskState: "IN PROGRESS",
            currUserId: user.uid,
        });
    }

    const handleMarkDone = (task) => { //IN PROGRESS to IN REVIEW
        const currTaskDoc = doc(firedb, `projects/${projectId}/tasks`, task_dict[task].taskId);
        updateDoc(currTaskDoc, {
            taskState: "IN REVIEW",
        });
        
        //notification -- send to project owner
        
        const time = new Date();
        const message = "task " + task_dict[task].taskName + " is ready to review"
        const new_message = {
            Sender: user.displayName,
            Time: time,
            message: message
        }

        sendMsg(projectDtl.ownerid, new_message);
    }

    const handleReview = async (task) => { //IN REVIEW TO COMPLETED
        const currTaskDoc = doc(firedb, `projects/${projectId}/tasks`, task_dict[task].taskId);
        await updateDoc(currTaskDoc, {
            taskState: "COMPLETED",
        });

        //notification
        const new_message = {
            Sender: user.displayName,
            Time: new Date(),
            message: "task " + task_dict[task].taskName + " status change from In Review to Complete"
        }
        await sendMsg(task_dict[task].ownerid, new_message);

        //100% notification
        if ((Object.keys(task_collections).length - 1) / Object.keys(task_collections).length === progress / 100) {
            const msg2 = {
                Sender: projectDtl.memberList.owner[0].displayName,
                Time: new Date(),
                message: "You all finish the entire project!!! Congrat"
            }
            sendMsg(projectDtl.ownerid, msg2);
            projectDtl.memberList.members.forEach(member =>{
                sendMsg(member.id, msg2);
            })
        }
    }

    const handleRejectResult = (task) => {
        const currTaskDoc = doc(firedb, `projects/${projectId}/tasks`, task_dict[task].taskId);
        updateDoc(currTaskDoc, {
            taskState: "IN PROGRESS",
        });

        //NOTIFICATION send back to task owner
       
        const new_message = {
            Sender: user.displayName,
            Time: new Date(),
            message: "task " + task_dict[task].taskName + " status change from In Review to In Progress"
        }
        sendMsg(task_dict[task].ownerid,new_message);

    }

    /* Task creation ends */

    if (error) {
        return <div className = "error">{error}</div>
    }

    if (!projectDtl || !task_collections) {
        return <div> Loading... </div>
    }
    return (
        <Box>
            <Grid container columns={5}>
                <Grid item xs={4}>
                    {/* Basic information display */}
                    <Grid container columns={4} sx={{width: '95%', margin: 'auto', marginTop: '20px', paddingBottom: '20px'}} className={styles['info']}>
                        <Grid item xs={2} sx={{display: 'flex', justifyContent: 'flex-start', margin: '0px'}}><h1>{projectDtl.projName} Board</h1></Grid>
                        <Grid item xs={2}></Grid>
                        <Grid item xs={2} sx={{display: 'flex', justifyContent: 'flex-start'}}><h3>{projectDtl.projDescr}</h3></Grid>
                        <Grid item xs={2}></Grid>

                        {/* Progress Bar */}
                        <Box sx={{ width: '80%' }}>
                            <LinearProgressWithLabel value={progress} />
                        </Box>

                        <Grid item xs={1} sx={{display: 'flex', alignItems:'center'}}>
                            {/* Search bar */} {
                                task_collections && 
                                <Autocomplete
                                disablePortal
                                autoComplete
                                freeSolo
                                id="Task Search"
                                options={task_collections}
                                getOptionLabel={(option)=>(option.taskName)}
                                onChange={(event, value)=>{
                                    if (value !== null) {
                                        setCurrTaskId(value.taskId)
                                    } else {
                                        setCurrTaskId('')
                                    }
                                    
                                }}
                                sx={{ width: 300 }}
                                renderInput={(params) => <TextField {...params} label="Task Search" />}        
                            />
                            }
                            
                            <Grid item xs={1}>
                            {task_ids.includes(currTaskId) ?
                                <Button variant="contained" component={Link} to={`/project/taskinfo/${projectId}/${currTaskId}`} sx={{width: '10%'}} color="success">
                                    Enter
                                </Button>
                                :
                                <Button variant="contained" disabled component={Link} to={`/project/taskinfo/${projectId}/${currTaskId}`} sx={{width: '10%'}} color="success">
                                    Enter
                                </Button>
                            }
                                  
                        </Grid>
                        </Grid>
                       
                    </Grid>
                    
                    {/* Task creation */}
                    <Paper sx={{width: '95%', margin: 'auto', marginBottom: '15px', height: '500px'}}>
                    {task_ids.length === 0 ? 

                    <Grid sx={{direction: 'column', alignItems: 'center', justifyContent: 'center'}}>
                        {
                            user.uid === projectDtl.ownerid && 
                            <Button variant="text" onClick={handleClickOpen} sx={{marginTop: "225px"}}><LibraryAddIcon fontSize="large"/></Button>
                        }
                        
                    </Grid> 
                    :
                    <Grid container columns={9} className={styles['task-board']}>
                        <Grid item xs={2}><h4>TODO</h4></Grid>
                        <Grid item xs={2}><h4>In Progress</h4></Grid>
                        <Grid item xs={2}><h4>In Review</h4></Grid>
                        <Grid item xs={2}><h4>Completed</h4></Grid>
                        <Grid item xs={1}>
                            {
                                user.uid === projectDtl.ownerid && 
                                <Button variant="text" onClick={handleClickOpen} sx={{display: 'flex', alignItems: 'center'}}><LibraryAddIcon/></Button>
                            }
                        </Grid>

                        <Grid item xs={2}>
                            <Grid container columns={1} sx={{width: '100%'}}>
                                {
                                    task_ids.length > 0 && task_ids.filter(task => {
                                            if (task_dict[task]['taskState'] === "TODO") {return task;}

                                        }).map((task) => 
                                        <Grid item xs={1} key = {task} sx={{width: '100%', marginBottom: '5px'}}>
                                            <Paper sx={{display: 'flex', width: '90%', margin: 'auto'}}>
                                                <Button variant="contained" component={Link} to={`/project/taskinfo/${projectId}/${task_dict[task].taskId}`} sx={{width: '85%'}}>
                                                        {task_dict[task].taskName}
                                                </Button>
                                                <Button onClick={() => {handleTakeTask(task)}}><PlaylistAddIcon/></Button>
                                            </Paper>
                                        </Grid>
                                    )
                                }
                            </Grid>
                        </Grid>

                        <Grid item xs={2}>
                            <Grid container columns={1}>
                                <Grid container columns={1} sx={{width: '100%'}}>
                                    {
                                        task_ids.length > 0 && task_ids.filter(task => {
                                                if (task_dict[task]['taskState'] === "IN PROGRESS") {return task;}
                                        }).map((task) => 
                                            <Grid item xs={1} key = {task} sx={{width: '100%', marginBottom: '5px'}}>
                                                <Paper sx={{display: 'flex', width: '90%', margin: 'auto'}}>
                                                    
                                                    {
                                                        user.uid === task_dict[task].ownerid ?
                                                        <ButtonGroup sx={{width: '100%'}}>
                                                            <Button variant="contained" component={Link} to={`/project/taskinfo/${projectId}/${task_dict[task].taskId}`} sx={{width: '85%'}}>
                                                                {task_dict[task].taskName}
                                                            </Button> 
                                                            <Button onClick={() => {handleMarkDone(task)}} sx={{width:'15%'}}><TaskIcon/></Button>
                                                        </ButtonGroup>
                                                        :
                                                        <Button variant="contained" component={Link} to={`/project/taskinfo/${projectId}/${task_dict[task].taskId}`} sx={{width: '100%'}}>
                                                            {task_dict[task].taskName}
                                                        </Button> 
                                                    }
                                                </Paper>
                                            </Grid>
                                        )
                                    }
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={2}>
                            <Grid container columns={1}>
                                <Grid container columns={1} sx={{width: '100%'}}>
                                    {
                                        task_ids.length > 0 && task_ids.filter(task => {
                                                if (task_dict[task]['taskState'] === "IN REVIEW") {return task;}
                                            }).map((task) => 
                                            <Grid item xs={1} key = {task} sx={{width: '100%', marginBottom: '5px'}}>
                                                <Paper sx={{display: 'flex', width: '90%', margin: 'auto'}}>
                                                    { user.uid === projectDtl.ownerid ?
                                                        <ButtonGroup sx={{width: '100%'}}>
                                                            <Button variant="contained" component={Link} to={`/project/taskinfo/${projectId}/${task_dict[task].taskId}`} sx={{width: '70%'}}>
                                                                {task_dict[task].taskName}
                                                            </Button>
                                                            <Button onClick={() => {handleReview(task)}} sx={{width: '15%'}}><VisibilityIcon/></Button> 
                                                            <Button onClick={() => {handleRejectResult(task)}} sx={{width: '15%'}}><ThumbDownOffAltIcon/></Button>   
                                                        </ButtonGroup>
                                                        :
                                                        <Button variant="contained" component={Link} to={`/project/taskinfo/${projectId}/${task_dict[task].taskId}`} sx={{width: '100%'}}>
                                                            {task_dict[task].taskName}
                                                        </Button>
                                                    }
                                                </Paper>
                                            </Grid>
                                        )
                                    }
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={2}>
                            <Grid container columns={1}>
                                <Grid container columns={1} sx={{width: '100%'}}>
                                    {
                                        task_ids.length > 0 && task_ids.filter(task => {
                                                if (task_dict[task]['taskState'] === "COMPLETED") {return task;}
                                            }).map((task) => 
                                            <Grid item xs={1} key = {task} sx={{width: '100%', marginBottom: '5px'}}>
                                                <Paper sx={{display: 'flex', width: '90%', margin: 'auto'}}>
                                                    <Button variant="contained" component={Link} to={`/project/taskinfo/${projectId}/${task_dict[task].taskId}`} sx={{width: '100%'}} color="success">
                                                            {task_dict[task].taskName}
                                                    </Button>
                                                </Paper>
                                            </Grid>
                                        )
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    }
                    </Paper>

                    {/* Project operations */}
                    <Grid container columns={5} sx={{width: '95%', margin: 'auto', paddingTop: '30px'}}>
                        {user.uid === projectDtl.ownerid ?
                            <Grid item xs={1} sx={{display: 'flex', justifyContent: "flex-start"}}>
                                <Link to={`/project/projectmodify/${projectId}`} key={projectId} style={{ textDecoration: 'none' }}>
                                    <Button variant="contained">Update information</Button>
                                </Link>
                            </Grid>
                            :
                            <Grid item xs={1}>
                            </Grid>
                        }
                        {user.uid === projectDtl.ownerid ? 
                            <Grid item xs={1} sx={{display: 'flex', alignItems:'center', }}>
                                <Link to="/project/projectcreate" onClick={handleProjectDelete} style={{ textDecoration: 'none' }}>
                                    <Button variant='contained' endIcon={<DeleteIcon />} color='error'>Delete Project</Button>
                                </Link>
                            </Grid> 
                            : 
                            <Grid item xs={1} sx={{display: 'flex', alignItems:'center'}}>
                            </Grid>
                        }
                    </Grid>
                </Grid>

                {/* Users in projects */}
                <Grid item xs={1} sx={{width:"95%"}}>
                    <Paper sx={{height: '100%', marginTop: '20px'}} className={styles['member-ls']}>
                        <Grid container columns={3}>
                            <Grid item xs={2} sx={{paddingBottom: '20px', paddingTop: '20px', fontSize:'20px', fontWeight:'bold'}}>
                                People
                            </Grid>
                            

                                {   user.uid === projectDtl.ownerid && 
                                     <Grid item xs={1} sx={{display: 'flex', justifyContent: 'center', alignItems:'center'}}><Button variant="text" onClick={handleClickOpen2} sx={{display: 'flex', alignItems: 'center'}}><GroupAddIcon/></Button></Grid>
                                }
                            
                                                       
                                {/* // <Grid item xs={1} sx={{display: 'flex', alignItems:'center'}}> */}
                              
                            <Grid item xs={3}>
                                <Grid container columns={2}>
                                    <Grid item xs={1}><Button sx={{width: '100%'}}>{projectDtl.memberList.owner[0].displayName}</Button></Grid>
                                    <Grid item xs={1} sx={{display: 'flex', justifyContent: 'center', alignItems:'center'}}>
                                        <Button variant="outlined" disabled style={{textTransform: 'none', height: '50%', width: '50%'}}>owner</Button>     
                                    </Grid>
                                </Grid>
                            </Grid>

                            {
                                projectDtl.memberList.members.length > 0 && 
                                projectDtl.memberList.members.map((member) => 
                                    <Grid item xs={3} key = {member.id} >
                                        <Grid container columns={2}>
                                            <Grid item xs={1}><Button sx={{width: '100%'}}>{member.displayName}</Button></Grid>
                                            <Grid item xs={1} sx={{display: 'flex', justifyContent: 'center', alignItems:'center'}}>
                                                <Button variant="outlined" disabled style={{textTransform: 'none', height: '50%', width: '50%'}}>{member.RoleTag}</Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                )
                            }
                        </Grid>
                    </Paper>
                </Grid>
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
                        <Grid item xs={1} sx={{marginTop: '20px'}}>
                            <Autocomplete
                                disablePortal
                                autoComplete
                                freeSolo
                                id="Assign Task"
                                options={memList}
                                getOptionLabel={(option)=>(option.displayName ?? option)}
                                onChange={(event, value)=>
                                {   
                                    if (value !== null) {
                                        setCurrMemId(value.id)
                                    } else {
                                        setCurrMemId('')
                                    }
                                    
                                }}
                                sx={{ width: 300 }}
                                renderInput={(params) => <TextField {...params} label="Assign Task" />}        
                            />
                        </Grid>
                        
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleTaskCreation}>Create</Button> 
                    </DialogActions>
            </Dialog>

            {/* invitation form */}
            <Dialog open={Boolean(open2)} onClose={handleClose2}>
                <DialogTitle>Invite collabrators</DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{textIndent:'0px'}}>
                            Invite members to your project by email. Role assigning is optional.
                        </DialogContentText>

                        <Grid container sx={{marginTop: '20px'}} columns={1}>
                        <Grid item xs={1} sx={{marginBottom: '20px'}}>
                            <FormControl sx={{width: "100%"}}>
                            <InputLabel htmlFor="component-outlined">EMAIL ADDRESS</InputLabel>
                            <OutlinedInput
                            id="component-outlined"
                            value={invite}
                            label="email"
                            onChange = {(e)=>setInvite(e.target.value)}
                            type="text"
                            />
                            </FormControl>
                        </Grid>
                        <Grid item xs={1}>
                            <FormControl sx={{width: "100%"}}>
                                <Autocomplete
                                    disablePortal
                                    autoComplete
                                    freeSolo
                                    id="Roles"
                                    options={projectDtl.roleTags}
                                    onInputChange={(event, value)=>setRole(value)}
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField {...params} label="Roles" />}        
                                />
                            </FormControl>
                        </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose2}>Cancel</Button>
                        <Button onClick={handleProjectInvitation}>Invite</Button> 
                    </DialogActions>
            </Dialog>
            
        </Box>
    )
}


