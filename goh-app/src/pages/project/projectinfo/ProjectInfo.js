/* Functionality dependencies */
import { useParams } from 'react-router-dom';
import { useDocument } from '../../../hooks/useDocument';
import { useCollection } from '../../../hooks/useCollection';
import { useFirestore } from '../../../hooks/useFirestore';
import { useProjectActions } from '../../../hooks/useProjectActions';
import { firedb } from '../../../firebase/config';
import { useAuthContext } from '../../../hooks/useAuthContext'
import { Link} from "react-router-dom";
import { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { collection, doc, getDoc, getDocs, updateDoc, query, where} from "firebase/firestore";
import Chat from '../chat/Chat';



/* MUI components */
import styles from './ProjectInfo.module.css';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from '@mui/icons-material/Delete';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import TaskIcon from '@mui/icons-material/Task';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ChatIcon from '@mui/icons-material/Chat';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';


import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { CardActionArea } from '@mui/material';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

/* invitation form */
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { ButtonGroup, Menu } from '@mui/material';

/* Priority and relative theming */
import { createTheme, ThemeProvider} from '@mui/material/styles';
import { blue, orange, red } from '@mui/material/colors';

const CAS_THEME = createTheme({
    palette: {
        primary: {
            main: blue[700],
        },
    },
});

const IMP_THEME = createTheme({
    palette: {
        primary: {
            main: orange[500],
        },
    },
});

const URG_THEME = createTheme({
    palette: {
        primary: {
            main: red[500],
        },
    },
});

const drawerWidth = 300;


/* Progress Bar */
function LinearProgressWithLabel(props) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 55 }}>
          <Typography variant="body2" color="text.secondary">{(`${Math.round(props.value)}` === "NaN" ? "0" : `${Math.round(props.value)}`)}%</Typography>
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
    const { projectDelete, inviteUser , getUserInfo, error: errorAction} = useProjectActions();
    const { documents: projectDtl , error} = useDocument('projects', projectId);
    const { user } = useAuthContext();
    const [invite, setInvite] = useState('');
    const [progress, setProgress] = useState(0);
    const [alertOpen, setAlertOpen] = useState(false);

    const handleAlertClose = () => {
        setAlertOpen(false);
    };

    /* Task creation variables */
    const { documents: task_collections } = useCollection(`projects/${projectId}/tasks`, null);
    const [taskName, setTaskName] = useState('');
    const [taskDescr, setTaskDescr] = useState('');
    const [dueDate, setDueDate] = useState(null);
    const [dueDateTime, setDueTateTime] = useState(null);
    const [taskPrio, setTaskPrio] = useState('');
    const [task_ids, setTaskIds] = useState('');
    const [task_dict, setTaskDict] = useState('');
    const [open, setOpen] = useState(''); // form dialog open/close
    const [currTaskId, setCurrTaskId] = useState('');
    const [currMemId, setCurrMemId] = useState('');

    /* member List */
    const [taskOwnerName, setTaskOwnerName] = useState('');
    let memList = {};
    if (projectDtl !== null) {
        memList = projectDtl.memberList.members;
    }

    /* Invitation and RoleTags */
    const [open2, setOpen2] = useState(''); // form dialog open/close
    const [roleTag, setRole] = useState('');

    /* profile page icon */ 
    const [openProf, setopenProf] = useState(false);
    const [profile, setProfile] = useState('');

    /* Char room control variables */
    const [chatState, setChatState] = useState(false);

    const handleChatRoomOpen = () => {
        setChatState(true);
    }

    const handleChatRoomClose = () => {
        setChatState(false);
    }


    /* Project operations starts */
    const handleProjectDelete = () => {
        projectDelete(projectId, projectDtl);
        deleteDocument(`projects`, projectId);
    }


    const handleProjectInvitation = async(e) => {
        e.preventDefault();
        inviteUser(projectId,projectDtl, invite, roleTag);
        setRole('');
        setInvite('');
        setOpen2(false);
        if (errorAction) {
            alert(errorAction);
        }
    }
    /* Project operations ends */

    /* Task creation starts */
    const handleClickOpen = () => { //popup form
        setOpen(true);
        console.log(projectDtl);
    };

    /* user invitation form */
    const handleClickOpen2 = () => { //popup invitation form
        //judge invite limit
        const size = projectDtl.memberList.members.length;
        if(projectDtl.membersLimit){
            const memberLimit = projectDtl.membersLimit;
            //-1 because declude project leader
            if(size >= parseInt(memberLimit) - 1){
                setAlertOpen(true);
                return
            }
        }
        setOpen2(true);
        //console.log(projectDtl.memberList);
    }

    const handleClose2 = () => { //clear invitation form
        setInvite('');
        setRole('')
        setOpen2(false);
    }

    const handleDueDateChange = (tValue) => {
        console.log(dayjs(tValue).format("MM/DD/YYYY"));
        setDueDate(dayjs(tValue).format("MM/DD/YYYY"));
        setDueTateTime(new Date(dayjs(tValue).format("MM/DD/YYYY")))

    };

    const handleClose = () => { //close form and clear inputs
        setTaskName('');
        setTaskDescr('');
        setDueDate(null);
        setDueTateTime(null);
        setTaskPrio('');
        setOpen(false);
    }

    const handleOpenProfile = async (e) => {
        const return_prof = await getUserInfo(e.target.value)
        if (errorAction) {
            alert(errorAction);
        }
        //console.log(return_prof)
        setProfile(return_prof)
        setopenProf(true);
    }

    const handleCloseProfile = () => {
        setopenProf(false);
        setProfile('')
    }

    const handleTaskCreation = (event) => {
        //event.preventDefault();
        const taskid = uuid();
        let priority = taskPrio;
        if (taskPrio === undefined || taskPrio === null || taskPrio === "") {
            priority = 0;
        }

        if (!dueDate) {
            alert("Please Pick a due date");
            return;
        }

        createTask(projectId, user.uid, currMemId, taskid, taskName, taskDescr, dueDate, dueDateTime, priority);
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
        setDueDate(null);
        setDueTateTime(null);
        setCurrMemId('');
        setTaskPrio(0);
        setOpen(false);
    }

    const handleTaskPrio = (event) => {
        setTaskPrio(event.target.value);
    }

    useEffect(() => {
        if (task_collections) {
            //update task_ids if task collection changes
            let temp_collection = task_collections;
            let sorted_collection = {};
            sorted_collection = temp_collection.sort((a,b) => {
                return new Date(a.dueDate) - new Date(b.dueDate); 
            })
            let temp_ids = [];
            let temp_id_dict = {};
            let count = 0;
            sorted_collection.forEach(task => {
                if (task.taskState === "COMPLETED") count++;
                temp_ids.push(task.id);
                temp_id_dict[task.id] = task;
            })
            setTaskIds(temp_ids);
            setTaskDict(temp_id_dict);
            setProgress((count / Object.keys(task_collections).length) * 100)
        }

    }, [task_collections]);

    useEffect(() => {
        if (projectDtl) {
            let temp_mem = {};
            if (projectDtl.memberList !== undefined) {
                temp_mem[projectDtl.memberList.owner[0].id] = projectDtl.memberList.owner[0].displayName
                if (projectDtl.memberList.members.length > 0) {
                    projectDtl.memberList.members.forEach((member) => {
                        temp_mem[member.id] = member.displayName;
                    })
                }
                
                setTaskOwnerName(temp_mem);
            }
            
        }
    }, [projectDtl])

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

    /* Button control starts */
    function getPrioTheme(key) {
        let prio_theme;
        if (task_dict[key].prio === 0) prio_theme = CAS_THEME;
        else if (task_dict[key].prio === 1) prio_theme = IMP_THEME;
        else prio_theme = URG_THEME;
        return prio_theme;
    }

    function todoTaskBtns(key) { //TODO task color only depends on priority
        let prio_theme = getPrioTheme(key);
        return (
            <Paper sx={{display: 'flex', width: '90%', margin: 'auto'}}>
                <Button variant="contained" component={Link} className={styles['task-btn']} to={`/project/taskinfo/${projectId}/${task_dict[key].taskId}`} sx={{width: '85%'}} theme={prio_theme}>
                    {task_dict[key].taskName}
                </Button>
                <Button onClick={() => {handleTakeTask(key)}}><PlaylistAddIcon/></Button>
            </Paper>
        )
    }

    function inProgressBtns(key) { //In progress btns has 2 conditions
        let prio_theme = getPrioTheme(key);
        
            if (user.uid === task_dict[key].currUserId) {
            return (
                <ButtonGroup sx={{width: '100%', height: '80px'}}>
                    <Button variant="contained" component={Link} className={styles['task-btn']} to={`/project/taskinfo/${projectId}/${task_dict[key].taskId}`} sx={{width: '85%'}} theme={prio_theme}>
                        {task_dict[key].taskName}<br></br>
                        {taskOwnerName[task_dict[key].currUserId]}<br></br>
                        {task_dict[key].dueDateTime.toDate().toLocaleString().split(",")[0]}
                    </Button>
                    <Button onClick={() => {handleMarkDone(key)}} sx={{width:'15%'}}><TaskIcon/></Button>
                </ButtonGroup>
            )
        }
        else {
            return (
                <Button variant="contained" component={Link} className={styles['task-btn']} to={`/project/taskinfo/${projectId}/${task_dict[key].taskId}`} sx={{width: '100%', height: '80px'}} theme={prio_theme}>
                    {task_dict[key].taskName}<br></br>
                    {taskOwnerName[task_dict[key].currUserId]}<br></br>
                    {task_dict[key].dueDateTime.toDate().toLocaleString().split(",")[0]}
                </Button>
            )
        }
        
       
    }

    function inReviewBtns(key) {
        let prio_theme = getPrioTheme(key);
        if (user.uid === projectDtl.ownerid) {
            return (
                <ButtonGroup sx={{width: '100%'}}>
                    <Button variant="contained" component={Link} className={styles['task-btn']} to={`/project/taskinfo/${projectId}/${task_dict[key].taskId}`} sx={{width: '70%'}} theme={prio_theme}>
                        {task_dict[key].taskName}
                    </Button>
                    <Button onClick={() => {handleReview(key)}} sx={{width: '15%'}}><VisibilityIcon/></Button>
                    <Button onClick={() => {handleRejectResult(key)}} sx={{width: '15%'}}><ThumbDownOffAltIcon/></Button>
                </ButtonGroup>
            )
        }
        else {
            return (
                <Button variant="contained" component={Link} className={styles['task-btn']} to={`/project/taskinfo/${projectId}/${task_dict[key].taskId}`} sx={{width: '100%'}} theme={prio_theme}>
                    {task_dict[key].taskName}
                </Button>
            )
        }
    }
    /* Button control ends */

    if (error) {
        return <div className = "error">{error}</div>
    }

    if (!projectDtl || !task_collections ) {
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
                        <Grid item xs={2} sx={{display: 'flex', justifyContent: 'flex-start', textAlign: 'left'}}><h3>{projectDtl.projDescr}</h3></Grid>
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

                    <Paper sx={{width: '95%', margin: 'auto', marginBottom: '15px'}}>
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
                    </Grid>
                    </Paper>

                    {/* Task creation */}
                    <Paper sx={{width: '95%', margin: 'auto', marginBottom: '15px', height: '500px', overflow: 'auto'}}>
                    {task_ids.length === 0 ?

                    <Grid sx={{direction: 'column', alignItems: 'center', justifyContent: 'center'}}>
                        {
                            user.uid === projectDtl.ownerid &&
                            <Button variant="text" onClick={handleClickOpen} sx={{marginTop: "225px"}}><LibraryAddIcon fontSize="large"/></Button>
                        }

                    </Grid>
                    :
                    <Grid container columns={9} className={styles['task-board']}>
                        <Grid item xs={2}>
                            <Grid container columns={1} sx={{width: '100%', overflowY: 'auto'}}>
                                {
                                    task_ids.length > 0 && task_ids.filter(task => {
                                            if (task_dict[task]['taskState'] === "TODO") {return task;}
                                        }).map((task) =>
                                        <Grid item xs={1} key = {task} sx={{width: '100%', marginBottom: '5px'}}>
                                            {todoTaskBtns(task)}
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
                                                    {inProgressBtns(task)}
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
                                                    {inReviewBtns(task)}
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
                                                    <Button variant="contained" component={Link} className={styles['task-btn']} to={`/project/taskinfo/${projectId}/${task_dict[task].taskId}`} sx={{width: '100%'}} color="success">
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
                                    <Button variant='contained' endicon={<DeleteIcon />} color='error'>Delete Project</Button>
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
                                                    
                            <Grid item xs={3}>
                                <Grid container columns={4}>
                                    <Grid item xs={2} sx={{paddingBottom: '20px', paddingTop: '20px', fontSize:'20px', fontWeight:'bold'}}>
                                        People
                                    </Grid>
                                    <Grid item xs={2} sx={{display: 'flex', justifyContent: 'center', alignItems:'center'}}>
                                        {user.uid === projectDtl.ownerid ?
                                        <ButtonGroup>
                                            <Button variant="contained" onClick={handleClickOpen2} sx={{display: 'flex', alignItems: 'center'}}><GroupAddIcon/></Button>
                                            <Button variant='contained' onClick={handleChatRoomOpen}><ChatIcon/></Button>
                                        </ButtonGroup>
                                        :
                                        <ButtonGroup>
                                            <Button variant='contained' onClick={handleChatRoomOpen}><ChatIcon/></Button>
                                        </ButtonGroup>
                                        }
                                        
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={3}>
                                <Grid container columns={2}>
                                    <Grid item xs={1}><Button sx={{width: '100%'}} onClick={handleOpenProfile} value = {projectDtl.memberList.owner[0].id} >{projectDtl.memberList.owner[0].displayName}</Button></Grid>
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
                                            <Grid item xs={1}>
                                                <Button sx={{width: '100%', textTransform: 'none'}} onClick={handleOpenProfile} value = {member.id}>{member.displayName}</Button>
                                            </Grid>
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

            {/* Chat room */}
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                
                }}
                anchor="right"
                open={chatState}
                onClose={handleChatRoomClose}
            >
                <Box role="presentation"><Chat/></Box>
            </Drawer>


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
                            multiline
                            />
                            </FormControl>
                        </Grid>
                        <Grid item xs={1} sx={{marginTop: '20px'}}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <FormControl sx={{width: "100%"}}>
                                    <DesktopDatePicker
                                        label="Due Date"
                                        inputFormat="MM/DD/YYYY"
                                        value={dueDate}
                                        onChange={handleDueDateChange}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </FormControl>
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={0.6} sx={{marginTop: '20px'}}>
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
                        <Grid item xs={0.4} sx={{marginTop: '20px'}}>
                            <FormControl sx={{width:'100%'}}>
                                <InputLabel id="prio-label">Priority</InputLabel>
                                <Select
                                    labelId="prio-lable"
                                    id="prio-select"
                                    value={taskPrio}
                                    onChange={handleTaskPrio}
                                    label="Priority"
                                >
                                    <MenuItem value={0}>Casual</MenuItem>
                                    <MenuItem value={1}>Important</MenuItem>
                                    <MenuItem value={2}>Urgent</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleTaskCreation}>Create</Button>
                    </DialogActions>
            </Dialog>
            
            <Dialog open={Boolean(openProf)}>
                <Card variant="outlined" sx={{ width: "345px"}}>
                    <CardActionArea>
                        <CardMedia
                        component="img"
                        height="200px"
                        image={profile.photoURL}
                        alt="user photo"
                        />
                        <IconButton
                            size="sm"
                            onClick={handleCloseProfile}
                            sx={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
                        >
                            <CloseIcon />
                        </IconButton>

                        <CardContent>
                            <Typography variant="h5" component="div">{profile.displayName}</Typography>
                            <Typography variant="body2" color="text.secondary">{profile.email}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{overflowY: "scroll"}}>{profile.description}</Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
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
                            <InputLabel htmlFor="component-outlined">Email</InputLabel>
                            <OutlinedInput
                            id="component-outlined"
                            value={invite}
                            label="email"
                            onChange = {(e)=>setInvite(e.target.value)}
                            type="text"
                            />
                            </FormControl>
                        </Grid>
                        <Grid item xs={0.5}>
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

            <Dialog
                open={alertOpen}
                onClose={handleAlertClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Tips"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Members exceeds the limitation, you can't invite more
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAlertClose} autoFocus>
                        I Know
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    )
}


