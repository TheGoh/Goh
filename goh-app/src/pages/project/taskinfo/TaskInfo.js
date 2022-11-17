
//import './ProjectInfo.css'
import { useParams } from 'react-router-dom';
import { useDocument } from '../../../hooks/useDocument';
import { useFirestore } from '../../../hooks/useFirestore'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { Link} from "react-router-dom";
import { useEffect, useState } from 'react';
import { firedb } from '../../../firebase/config';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
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
import DeleteIcon from '@mui/icons-material/Delete';

export default function TaskInfo() {
    let { projectId, taskId } = useParams();
    const { deleteDocument } = useFirestore()
    //console.log("here is target project id", projectId );
    const { documents: projectDtl } = useDocument(`projects/${projectId}/tasks`, taskId);
    const { user } = useAuthContext()
    const [ open, setOpen ] = useState('')
    const [ commentList, setCommentList ] = useState('');
    const [ comment, setComment ] = useState('')

    useEffect(() => {
        if (projectDtl) {
            let all_Comments = []
            Object.keys(projectDtl.comments).forEach(item => {
                const date = new Date()          
                all_Comments.push({comment: projectDtl.comments[item].comment, id:projectDtl.comments[item].id, time: date, resolved: projectDtl.comments[item].resolved});        
            })
            setCommentList(all_Comments);
        }
    }, [projectDtl]);

    if (!projectDtl) {
        return <div> Loading... </div>
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

    return (
        <Box>
            <Grid container columns={3} sx={{width: '85%', margin: 'auto'}}>
                <Grid item xs={3}><h1>{projectDtl.taskName}</h1></Grid>
                <Grid item xs={3}><h3>{projectDtl.taskDescr}</h3></Grid>
                <Grid item xs={3}><h4>{projectDtl.dueDate}</h4></Grid>
            </Grid>

            <Grid container columns={3} sx={{width: '85%', margin: 'auto', paddingTop: '30px'}}>
                <Grid item xs={1}>
                    {user.uid === projectDtl.ownerid ?
                        <Button component={Link} to={`/project/taskmodify/${projectId}/${taskId}`} key={projectId} variant="contained">Change Task information</Button>
                        :
                        <div></div>
                    }
                </Grid>
                <Grid item xs={1} sx={{display: 'flex', alignItems:'center'}}>
                    {user.uid === projectDtl.ownerid ?
                        <Button component={Link} to={`/project/${projectId}`} onClick={handleDelete} key = {projectId} variant='contained' endIcon={<DeleteIcon />} color='error'>Delete This Task</Button>                    :
                        <div></div>
                    }
                    
                </Grid>
                <Grid item xs={1} sx={{display: 'flex', alignItems:'center'}}>
                    <Button onClick={handleOpen} variant='contained' color='error'>Comment</Button>                    
                </Grid>
                {/* Comments List */}
                {
                  projectDtl.comments.length > 0 && projectDtl.comments.map(comment => (
                    <Grid item xs ={1} key = {comment.id} sx={{display: 'flex', justifyContent: 'flex-start', marginBottom: '10px'}}>
                      <Paper sx={{ width: "80%"}}>
                        <Grid container columns={1} sx={{width: "95%", p: '15px'}}>
                            {(comment.resolved.includes("UNRESOLVED")) ?
                                <Button onClick={() => {handleResolved(comment)}} color="error">{comment.comment}</Button> 
                                :
                                <Button onClick={() => {handleResolved(comment)}} color="success">{comment.comment}</Button> 
                            }
                            
                        </Grid>
                      </Paper>
                    </Grid>
                  ))
                }
            </Grid>
            {/* Comments Popup */}
            <Dialog open={Boolean(open)} onClose={handleClose}>
                <DialogTitle>Add Comment</DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{textIndent:'0px'}}>
                            Please enter your comments
                        </DialogContentText>

                        <Grid container sx={{marginTop: '20px'}} columns={1}>
                        <Grid item xs={1} sx={{marginBottom: '20px'}}>
                            <FormControl sx={{width: "100%"}}>
                            <InputLabel htmlFor="component-outlined">Comments</InputLabel>
                            <OutlinedInput
                            id="component-outlined"
                            value={comment}
                            label="Comment"
                            onChange = {(e)=>setComment(e.target.value)}
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
        </Box>
    )
}
