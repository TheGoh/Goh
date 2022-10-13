
//import './ProjectInfo.css'
import { useParams } from 'react-router-dom';
import { useFetchProject } from '../../../hooks/useFetchProject';
import { useCollection } from '../../../hooks/useCollection';
import { useDeleteDoc } from '../../../hooks/useDeleteDoc'
import { firedb } from '../../../firebase/config';
import { useAuthContext } from '../../../hooks/useAuthContext'
import { Link} from "react-router-dom";
import { useState } from 'react';

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

    // console.log(projectDtl)
    // console.log("project page user id", user.uid)

    if (!projectDtl) {
        return <div> Loading... </div>
    }

    //When user click button, the handledelete function will remove the project collection from the database and user's project id list
    const handleDelete = async(e) => {

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

    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log(invite);

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
                        if (!invite_list.includes(projectId) && !doc.data().ownedProjects.includes(projectId)) {
                            invite_list.push(projectId);
                            updateDoc(currUserDoc, {invitations: invite_list});
                        }                
                    })
            })
            .catch((err) => {
                console.error("Invalid User");
            })

        
    }

    return (
        <Box>
            <Grid container columns={3} sx={{width: '85%', margin: 'auto'}}>
                <Grid item xs={3}><h1>{projectDtl.projName}</h1></Grid>
                <Grid item xs={3}><h3>{projectDtl.projDescr}</h3></Grid>
                
                <Grid item xs={1}><h3>Add contributors</h3></Grid>
                <Grid item xs={1}>
                    <FormControl sx={{width: "80%"}}>
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
                    <Button variant='outlined' onClick={handleSubmit} endIcon={<SendIcon/>}>Send invitation</Button>
                </Grid>
            </Grid>

            <Grid container columns={3} sx={{width: '85%', margin: 'auto', paddingTop: '30px'}}>
                <Grid item xs={1}></Grid>
                <Grid item xs={1}>
                    <Link to={`/project/projectmodify/${projectId}`} key={projectId}>
                        <Button variant="contained">Change project information</Button>
                    </Link>
                </Grid>
                <Grid item xs={1} sx={{display: 'flex', alignItems:'center'}}>
                    <Link to="/project/projectcreate" onClick={handleDelete}>
                        <Button variant='contained' endIcon={<DeleteIcon />} color='error'>Delete This Project</Button>
                    </Link>
                </Grid>
                <Grid item xs={1} sx={{display: 'flex', alignItems:'center'}}>
                    <Link to={`/project/taskcreate/${projectId}/${user.uid}`} key = {projectId}> 
                        <Button variant='contained' endIcon={<DeleteIcon />} color='error'>Create Task</Button>
                    </Link>   
                </Grid>
            </Grid>
        </Box>
    )
}