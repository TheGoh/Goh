
//import './ProjectInfo.css'
import { useParams } from 'react-router-dom';
import { useDocument } from '../../../hooks/useDocument';
import { useFirestore } from '../../../hooks/useFirestore'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { Link} from "react-router-dom";
import { useEffect, useState } from 'react';
import { firedb, storage } from '../../../firebase/config';
import { useProjectActions } from '../../../hooks/useProjectActions';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { handleBreakpoints } from '@mui/system';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import DeleteIcon from '@mui/icons-material/Delete';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import AttachmentIcon from '@mui/icons-material/Attachment';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import AddCommentIcon from '@mui/icons-material/AddComment';
import UndoIcon from '@mui/icons-material/Undo';

import styles from './TaskInfo.module.css';


export default function TaskInfo() {
    let { projectId, taskId } = useParams();
    const { deleteDocument } = useFirestore()
    const { documents: projectDtl } = useDocument(`projects/${projectId}/tasks`, taskId);
    const { user } = useAuthContext()
    const { getUserInfo, error: errorAction } = useProjectActions();
    const [ open, setOpen ] = useState('')  //Comment popup
    const [ openA, setAOpen ] = useState('') //Attachment popup
    const [ commentList, setCommentList ] = useState('');
    const [ comment, setComment ] = useState('')
    const [ fileUrl, setUrl ] = useState('');
    const [ file, setFile ] = useState('');
    const [ taskOwner, setTaskOwner ] = useState(null);
    let remChar = 0;
    if (comment.length <= 500) {
        remChar = 500 - comment.length;
    }
    useEffect(() => {
        if (projectDtl) {
            let all_Comments = [];
            let attach_URL = '';
            Object.keys(projectDtl.comments).forEach(item => {
                const date = new Date()          
                all_Comments.push({comment: projectDtl.comments[item].comment, id:projectDtl.comments[item].id, time: date, resolved: projectDtl.comments[item].resolved});        
            })

            const getUsers = async () => {
                let temp_taskOwner = await getUserInfo(projectDtl.currUserId);
                setTaskOwner(temp_taskOwner)
            };

            if (projectDtl.taskState === "IN PROGRESS") {
                getUsers();
            } else {
                setTaskOwner(null);
            }

            attach_URL = projectDtl.fileURL;
            setUrl(attach_URL);
            setCommentList(all_Comments);
        }
    }, [projectDtl]);

    if (!projectDtl) {
        return <div> Loading... </div>
    }
    const handleOpenAttach = () => {
        window.open(fileUrl, '_blank', 'noopener,noreferrer');
    }
    const uploadAttachment = async(e) => {
        e.preventDefault();
        const attachment = e.target.files[0];
        if (attachment.size >= 10000000) {
            alert("Max File Size: 10MB")
            return;
        }
        const storage = getStorage();
        const fileRef = ref(storage, `TaskAttachment/${taskId}`)
        await uploadBytes(fileRef, attachment).then((snapshot) => {
            console.log("Uploaded")
        })
        const dwnldUrl = await getDownloadURL(fileRef)
        setUrl(dwnldUrl)
    }
    const handleAttach = (e) => {
        e.preventDefault();
        const ref = doc(firedb, `projects/${projectId}/tasks/`, taskId);
        if (ref) {
            updateDoc(ref, {
                fileURL: fileUrl
            })
            console.log("firestore update")
        }
        setAOpen(false)
    }
    const handleAOpen = () => {
        setAOpen(true);
    }
    const handleAttachClose = () => {
        setAOpen(false);
    }
    //When user click button, the handledelete function will remove the project collection from the database and user's project id list
    const handleDelete = async(e) => {
        //remove from projects collection
        deleteDocument(`projects/${projectId}/tasks`, taskId)
    }

    const handleResolved = (comment) => {
        const ref = doc(firedb, `projects/${projectId}/tasks/`, taskId);
        const id = comment.id;

        let comments_list = commentList;
        console.log(comments_list);
        //console.log(comments_list);
        let resolved = comments_list[id].resolved;
        if (resolved === "UNRESOLVED") {
            resolved = "RESOLVED";
        } else {
            resolved = "UNRESOLVED";
        }
        comments_list[id].resolved = resolved;
        updateDoc(ref, {
            comments: comments_list
        })
    }

    const handleComment = async(e) => {
        e.preventDefault();
        if (comment.length > 500) {
            setComment('');
            setOpen(false);
            return
        }
        const ref = doc(firedb, `projects/${projectId}/tasks/`, taskId);
        await getDoc(ref).then((doc) => {
            let comment_list = doc.data().comments;
            const time = new Date();
            const id = comment_list.length;
            const isResolved = "UNRESOLVED";
            const new_comment = {
                Sender: user.displayName,
                Time: time,
                comment: comment,
                resolved: isResolved,
                id: id
            }
            if (comment_list) {

                comment_list.push(new_comment)
                updateDoc(ref, {
                    comments: comment_list
                }); 
            } else {
                let new_list = [];
                new_list.push(new_comment);
                updateDoc(ref, {
                    comments: new_list
                }); 
            }
            setComment('');
            setOpen(false);
        })

    }
    const handleOpen = () => {
        console.log("my Comments: ", commentList);

        setOpen(true);
    }
    const handleClose = () => { //close form and clear inputs
        setComment('');
        setOpen(false);
    }

    function taskPrio(task) {
        if (task.prio === 0) return "Casual"
        else if (task.prio === 1) return "Important"
        else return "Urgent"
    }

    function ownerButton() {
        if (user.uid === projectDtl.ownerid || user.uid === projectDtl.currUserId) {
            return (
                <ButtonGroup key={projectId}>
                    <Button component={Link} to={`/project/${projectId}`}  variant="contained"><UndoIcon/></Button>
                    <Button component={Link} to={`/project/taskmodify/${projectId}/${taskId}`}  variant="contained"><ChangeCircleIcon/></Button>
                    <Button component={Link} to={`/project/${projectId}`} onClick={handleDelete} variant='contained' color='error'><DeleteIcon /></Button>
                </ButtonGroup>
            )
        }
        else {
            return (
                <ButtonGroup key={projectId}>
                    <Button component={Link} to={`/project/${projectId}`} variant="contained"><UndoIcon/></Button>
                    <Button component={Link} to={`/project/taskmodify/${projectId}/${taskId}`} variant="contained" disabled><ChangeCircleIcon/></Button>
                    <Button component={Link} to={`/project/${projectId}`} onClick={handleDelete} variant='contained' color='error' disabled><DeleteIcon /></Button>
                </ButtonGroup>
            )
        }
    }

    return (
        <Box>
            <Grid container columns={3} sx={{padding: "30px"}}>
                {/* Basic info and operations */}
                <Grid item xs={2}> 
                    <Grid container columns={1}>
                        <Grid item xs={1} className={styles['basic-info']}>
                            <h1>{projectDtl.taskName}</h1>
                            {taskOwner !== null && <Avatar alt="owner-img" src={taskOwner.photoURL} sx={{width: "50px", height:"50px"}}/>}
                        </Grid>
                        <Grid item xs={1} className={styles['basic-info']}><p>{projectDtl.taskDescr}</p></Grid>
                        <Grid item xs={1} className={styles['basic-info']}>
                            <p>{projectDtl.dueDate}&nbsp;&nbsp;</p>
                            <p>|</p>
                            <p>&nbsp;&nbsp;{taskPrio(projectDtl)}</p>
                        </Grid>
                        <Grid item xs={1} className={styles['btn-bar']} sx={{marginTop: "15px"}}>  
                            <ButtonGroup>
                                <Button onClick={handleAOpen}><AttachmentIcon/></Button>
                                <Button onClick={handleOpenAttach}><FileOpenIcon/></Button>
                            </ButtonGroup>
                            &nbsp;&nbsp;
                            <Divider orientation="vertical" variant="middle" flexItem />
                            &nbsp;&nbsp;
                            {ownerButton()}
                        </Grid>
                    </Grid>
                </Grid>

                {/* Comments */}
                <Grid item xs={1}>
                    <Grid container columns={1}>
                        <Grid item xs={1} className={styles['comment-title']}>
                        <h1>Comments</h1>
                        <Button onClick={handleOpen}><AddCommentIcon/></Button></Grid>
                        {/* Comments List */}
                        {
                        projectDtl.comments.length > 0 ? projectDtl.comments.map(comment => (
                            <Grid item xs ={1} key = {comment.id} sx={{display: 'flex', justifyContent: 'flex-start', marginBottom: '10px'}}>
                            <Paper sx={{ width: "80%"}}>
                                {(user.uid === projectDtl.ownerid || user.uid === projectDtl.currUserId) ? 
                                <Grid container columns={1} sx={{width: "95%", p: '15px'}}>
                                    <Button variant="contained"
                                            onClick={() => {handleResolved(comment)}}
                                            color={comment.resolved.includes("UNRESOLVED") ? "error" : "success"}
                                            sx={{textTransform: "none"}}>
                                        {comment.comment}
                                    </Button> 
                                </Grid>
                                :
                                <Grid container columns={1} sx={{width: "95%", p: '15px'}}>
                                    {(comment.resolved.includes("UNRESOLVED")) ?
                                        <Button variant="outlined" color="error" sx={{textTransform: "none"}}>{comment.comment}</Button> 
                                        :
                                        <Button variant="contained" color="success" sx={{textTransform: "none"}}>{comment.comment}</Button> 
                                    }
                                
                                </Grid>
                                }
                            </Paper>
                            </Grid>
                        ))
                        :
                        <Grid item xs ={1} key="no-comment" sx={{display: 'flex', justifyContent: 'flex-start', marginBottom: '10px'}}>
                        <Paper sx={{ width: "80%"}}>
                            No Comments yet
                        </Paper>
                        </Grid>
                        }
                    </Grid>
                </Grid>

            </Grid>


            {/* Comments Popup */}
            <Dialog open={Boolean(open)} onClose={handleClose}>
                <DialogTitle>Add Comment</DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{textIndent:'0px'}}>
                            Please enter your comments
                        </DialogContentText>
                        <h5>Characters Remaining: {remChar}</h5>
                        <Grid container sx={{marginTop: '20px'}} columns={1}>
                        <Grid item xs={1} sx={{marginBottom: '20px'}}>
                            <FormControl sx={{width: "100%"}}>
                            <InputLabel htmlFor="component-outlined">Comments</InputLabel>
                            <OutlinedInput
                            id="component-outlined"
                            value={comment}
                            label="Comment"
                            onChange = {(e)=>
                                setComment(e.target.value)}
                            type="text"
                            />
                            </FormControl>
                        </Grid>                    
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleComment}>Comment</Button> 
                    </DialogActions>
            </Dialog>


            {/* Attachment Popup */}
            <Dialog open={Boolean(openA)} onClose={handleAttachClose}>
                <DialogTitle>Add Attachment</DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{textIndent:'0px'}}>
                            Please add your attachment
                        </DialogContentText>

                        <Grid container sx={{marginTop: '20px'}} columns={1}>
                        <Grid item xs={1} sx={{marginBottom: '20px'}}>
                            <FormControl sx={{width: "100%"}}>
                            <OutlinedInput
                                id="component-outlined"
                                onChange = {uploadAttachment}
                                type="file"
                                
                            />
                            </FormControl>
                        </Grid>                    
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleAttachClose}>Cancel</Button>
                        <Button onClick={handleAttach}>Attach</Button> 
                    </DialogActions>
            </Dialog>
        </Box>
    )
}
