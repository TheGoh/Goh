//import './ProjectInfo.css'
import { useParams } from 'react-router-dom';
import { useFetchProject } from '../../../hooks/useFetchProject';
import { useCollection } from '../../../hooks/useCollection';
import { useDeleteDoc } from '../../../hooks/useDeleteDoc'
import { firedb } from '../../../firebase/config';
import { useAuthContext } from '../../../hooks/useAuthContext'
import { Link} from "react-router-dom";
import { useState } from 'react';

import styles from './ProjectInfo.module.css';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';


import { 
    collection,
    doc,
    getDoc,
    getDocs,
    updateDoc,
    query,
    where
} from "firebase/firestore"

export default function Project() {
    let { projectId } = useParams();
    const { deleteDocument } = useDeleteDoc()
    //console.log("here is target project id", projectId );
    const { documents: projectDtl } = useFetchProject('projects', projectId);
    const { user } = useAuthContext()
    const [invite, setInvite] = useState('')

    //When user click button, the handledelete function will remove the project collection from the database and user's project id list
    const handleProjectDelete = async(e) => {

        //remove from projects collection
        deleteDocument(`projects`, projectId)
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
                .then(() => {
                    console.log("update successfully!!!",tempList);
                })

            })
    }

    const handleInvitation = async(e) => {
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
                            updateDoc(currUserDoc, {invitations: invite_list});
                        }
                        else {
                            console.log("error")
                        }                
                    })
            })
            .catch((err) => {
                console.error("Invalid User");
            })        
    }

    if (!projectDtl) {
        return <div> Loading... </div>
    }
    return (
        <Box>
            <Grid container columns={5}>
                <Grid item xs={4}>
                    {/* Basic information display */}
                    <Grid container columns={3} sx={{width: '95%', margin: 'auto', marginTop: '20px',}} className={styles['info']}>
                        <Grid item xs={1} sx={{display: 'flex', justifyContent: 'flex-start', margin: '0px'}}><h1>{projectDtl.projName} Board</h1></Grid>
                        <Grid item xs={2}></Grid>
                        <Grid item xs={1} sx={{display: 'flex', justifyContent: 'flex-start'}}><h3>{projectDtl.projDescr}</h3></Grid>
                    </Grid>

                    {/* Task creation */}

                    <Grid container columns={4} className={styles['task-board']} sx={{marginBottom: '20px'}}>
                        <Grid item xs={1}><h4>TODO</h4></Grid>
                        <Grid item xs={1}>In Progress</Grid>
                        <Grid item xs={1}>In Review</Grid>
                        <Grid item xs={1}>Completed</Grid>
                    </Grid>


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
                            <Button variant='outlined' onClick={handleInvitation} endIcon={<SendIcon/>}>Send invitation</Button>
                        </Grid>
                    </Grid>

                    {/* Project operations */}
                    <Grid container columns={5} sx={{width: '95%', margin: 'auto', paddingTop: '30px'}}>
                        {/* <Grid item xs={1} sx={{display: 'flex', alignItems:'center'}}>
                            <Link to={`/project/taskcreate/${projectId}/${user.uid}`} key = {projectId} style={{ textDecoration: 'none' }}> 
                                <Button variant='contained'>Create Task</Button>
                            </Link>   
                        </Grid> */}

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
                <Grid item xs={1}>

                </Grid>
            </Grid>
            
        </Box>
    )
}