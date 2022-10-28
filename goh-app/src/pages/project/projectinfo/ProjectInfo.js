/* Functionality dependencies */
import { useParams } from 'react-router-dom';
import { useFetchProject } from '../../../hooks/useFetchProject';
import { useCollection } from '../../../hooks/useCollection';
import { useDeleteDoc } from '../../../hooks/useDeleteDoc';
import { useTask } from '../../../hooks/useTask';
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
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';



export default function Project() {
    /* Project information variables */
    let { projectId } = useParams();
    const { deleteDocument } = useDeleteDoc();
    const { documents: projectDtl } = useFetchProject('projects', projectId);
    const { user } = useAuthContext();
    const [invite, setInvite] = useState('');

    /* Task creation variables */
    const { documents: task_collections } = useCollection(`projects/${projectId}/tasks`, null);
    const [taskName, setTaskName] = useState('');
    const [taskDescr, setTaskDescr] = useState('');
    const [task_ids, setTaskIds] = useState('');
    const [task_dict, setTaskDict] = useState('');
    const [open, setOpen] = useState(''); // form dialog open/close
    const { createTask } = useTask();
    const currUserId = user.uid;
    const [searchField, setSearchField] = useState('');
    const [filteredTasks, setFilteredTasks] = useState('');
    
    /* Project operations starts */
    const handleProjectDelete = async(e) => {
        //remove from projects collection
        const ref = doc(firedb, `users`, user.uid)

        //remove from user's project id entry
        getDoc(ref)
            .then ((doc) => {
                let tempOwnedProjects = doc.data().ownedProjects;
                let tempList = tempOwnedProjects.filter((project) => {
                    if (projectId !== project) return project;
                })
                updateDoc(ref, {
                     ownedProjects: tempList
                })
            })
        
        /* Delete project id from member project id list */     
        projectDtl.memberList["members"].forEach((member) => {
            const ref2 = doc(firedb, `users`, member.id)
            //remove from user's project id entry
            getDoc(ref2)
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
                            invite_list[projectId] = projectDtl.projName
                            let message_list = doc.data().my_message;
                            const time = new Date();

                            const message = "Notification message " + projectDtl.projName;
                            const new_message = {
                                Sender: user.displayName,
                                Time: time,
                                message: message
                            }
                            message_list.push(new_message)
                            updateDoc(currUserDoc, {
                                invitations: invite_list,
                                my_message: message_list
                                }
                            );
                        }
                        else {
                            console.log("error")
                        }                
                    })
            })
            .catch((err) => {
                console.error("Invalid User");
            }); 
    }
    /* Project operations ends */
    
    /* Task Search starts */
    const handleSearchField = (event) => {
        const field = event.target.value.toLocaleLowerCase();
        console.log(field);
        setSearchField(field);
    }
    useEffect(() => {
        if (searchField) {
            //update task_ids if task collection changes
            const updateSearch = () => {
                const temp_tasks = task_collections;
                //console.log(temp_tasks)
                const filtered = [];
                if (temp_tasks !== null) {
                    temp_tasks.forEach(task => {  
                        const tmp_task = task.taskName.toLocaleLowerCase().includes(searchField);
                        if (tmp_task === true) {
                            filtered.push(task);            
                        }
                       
                    });
                }
                setFilteredTasks(filtered);
                //console.log(filteredTasks);
            }
            updateSearch();
        }
    }, [searchField]);

    /* Task Search ends */

    /* Task creation starts */
    const handleClickOpen = () => { //popup form
        setOpen(true);
        console.log(projectDtl);
    };
    const handleClose = () => { //close form and clear inputs
        setTaskName('');
        setTaskDescr('');
        setOpen(false);
    }
    const handleTaskCreation = (event) => {
        //event.preventDefault();
        const taskid = uuid();
        
        createTask(projectId, user.uid, taskid, taskName, taskDescr);
        setTaskName('');
        setTaskDescr('');
        setOpen(false);
    }
    useEffect(() => {
        if (task_collections) {
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

    // Task state changes
    const handleTakeTask = (task) => { //TODO to IN PROGRESS
        const curProjDoc = doc(firedb, `projects/${projectId}/tasks`, task_dict[task].taskId);
        getDoc(curProjDoc).then((doc) => {
            let owner = doc.data().ownerid;
            updateDoc(curProjDoc, {
                taskState: "IN PROGRESS",
                currUserId: currUserId,
            });
        });
    }

    const handleMarkDone = (task) => { //IN PROGRESS to IN REVIEW
        const curProjDoc = doc(firedb, `projects/${projectId}/tasks`, task_dict[task].taskId);
        getDoc(curProjDoc).then((doc) => {
            let owner = doc.data().ownerid;
            updateDoc(curProjDoc, {
                taskState: "IN REVIEW",
                currUserId: currUserId,
            });
        });
    }

    const handleReview = (task) => {
        const curProjDoc = doc(firedb, `projects/${projectId}/tasks`, task_dict[task].taskId);
        getDoc(curProjDoc).then((doc) => {
            let owner = doc.data().ownerid;
            updateDoc(curProjDoc, {
                taskState: "COMPLETED",
                currUserId: currUserId,
            });
        });
    }

    /* Task creation ends */

    if (!projectDtl && task_ids == []) {
        return <div> Loading... </div>
    }
    return (
        <Box>
            <Grid container columns={5}>
                <Grid item xs={4}>
                    {/* Basic information display */}
                    <Grid container columns={4} sx={{width: '95%', margin: 'auto', marginTop: '20px',}} className={styles['info']}>
                        <Grid item xs={2} sx={{display: 'flex', justifyContent: 'flex-start', margin: '0px'}}><h1>{projectDtl.projName} Board</h1></Grid>
                        <Grid item xs={2}></Grid>
                        <Grid item xs={2} sx={{display: 'flex', justifyContent: 'flex-start'}}><h3>{projectDtl.projDescr}</h3></Grid>
                    </Grid>
                    <Paper
                        component="form"
                        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
                    >
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Search for Tasks"
                            inputProps={{ 'aria-label': 'Search for Tasks' }}
                            onChange={handleSearchField}
                        />
                        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                    </Paper>
                    {/* Task creation */}
                    <Paper sx={{width: '95%', margin: 'auto', marginBottom: '25px'}}>
                    <Grid container columns={9} className={styles['task-board']}>
                        <Grid item xs={1}>

                        </Grid>
                        <Grid item xs={2}><h4>TODO</h4></Grid>
                        <Grid item xs={2}><h4>In Progress</h4></Grid>
                        <Grid item xs={2}><h4>In Review</h4></Grid>
                        <Grid item xs={2}><h4>Completed</h4></Grid>
                        <Grid item xs={1}>
                            <Button variant="text" onClick={handleClickOpen} sx={{display: 'flex', alignItems: 'center'}}><LibraryAddIcon/></Button>
                        </Grid>

                        <Grid item xs={2}>
                            <Grid container columns={1} sx={{width: '100%'}}>
                                {
                                    task_ids.length > 0 && task_ids.filter(task => {
                                            if (task_dict[task]['taskState'] === "TODO") {return task;}
                                        }).map((task) => 
                                        <Grid item xs={1} sx={{width: '100%', marginBottom: '5px'}}>
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
                                            <Grid item xs={1} sx={{width: '100%', marginBottom: '5px'}}>
                                                <Paper sx={{display: 'flex', width: '90%', margin: 'auto'}}>
                                                    <Button variant="contained" component={Link} to={`/project/taskinfo/${projectId}/${task_dict[task].taskId}`} sx={{width: '85%'}}>
                                                            {task_dict[task].taskName}
                                                    </Button>
                                                    <Button onClick={() => {handleMarkDone(task)}}><TaskIcon/></Button>
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
                                            <Grid item xs={1} sx={{width: '100%', marginBottom: '5px'}}>
                                                <Paper sx={{display: 'flex', width: '90%', margin: 'auto'}}>
                                                    <Button variant="contained" component={Link} to={`/project/taskinfo/${projectId}/${task_dict[task].taskId}`} sx={{width: '85%'}}>
                                                            {task_dict[task].taskName}
                                                    </Button>
                                                    <Button onClick={() => {handleReview(task)}}><VisibilityIcon/></Button>
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
                                            <Grid item xs={1} sx={{width: '100%', marginBottom: '5px'}}>
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
                    </Paper>


                    {/* Invitation */}
                    <Grid container columns={5} sx={{display: 'flex', justifyContent: "flex-start", width: '95%', margin: 'auto'}}>
                        <Grid item xs={2} sx={{display: 'flex', justifyContent: "flex-start"}}>
                            <FormControl sx={{width: "90%"}}>
                                <InputLabel htmlFor="component-outlined">Email</InputLabel>
                                <OutlinedInput
                                id="component-outlined"
                                value={invite}
                                label="target"
                                onChange = {(e)=>setInvite(e.target.value)}
                                type="email"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={1} sx={{display: 'flex', alignItems:'center'}}>
                            <Button variant='outlined' onClick={handleProjectInvitation} endIcon={<SendIcon/>}>Send invitation</Button>
                        </Grid>
                    </Grid>

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
                        <Grid container columns={1}>
                            <Grid item xs={1} sx={{paddingBottom: '20px', paddingTop: '20px', fontSize:'20px', fontWeight:'bold'}}>People</Grid>
                            <Grid item xs={1}>
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
                                    <Grid item xs={1}>
                                        <Grid container columns={2}>
                                            <Grid item xs={1}><Button sx={{width: '100%'}}>{member.displayName}</Button></Grid>
                                            <Grid item xs={1} sx={{display: 'flex', justifyContent: 'center', alignItems:'center'}}>
                                                <Button variant="outlined" disabled style={{textTransform: 'none', height: '50%', width: '50%'}}>member</Button>
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
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleTaskCreation}>Create</Button> 
                    </DialogActions>
                </Dialog>
            
        </Box>
    )
}


