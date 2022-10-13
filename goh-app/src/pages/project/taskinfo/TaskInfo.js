
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

export default function TaskInfo() {
    let { projectId, taskId } = useParams();
    const { deleteDocument } = useDeleteDoc()
    //console.log("here is target project id", projectId );
    const { documents: projectDtl } = useFetchProject(`projects/${projectId}/tasks`, taskId);
    const { user } = useAuthContext()
    // console.log(projectDtl)
    // console.log("project page user id", user.uid)

    if (!projectDtl) {
        return <div> Loading... </div>
    }

    //When user click button, the handledelete function will remove the project collection from the database and user's project id list
    const handleDelete = async(e) => {
        //remove from projects collection
        deleteDocument(`projects/${projectId}/tasks`, taskId)
    }


    return (
        <Box>
            <Grid container columns={3} sx={{width: '85%', margin: 'auto'}}>
                <Grid item xs={3}><h1>{projectDtl.taskName}</h1></Grid>
                <Grid item xs={3}><h3>{projectDtl.taskDescr}</h3></Grid>
            </Grid>

            <Grid container columns={3} sx={{width: '85%', margin: 'auto', paddingTop: '30px'}}>
                <Grid item xs={1}>
                    <Link to={`/project/taskmodify/${projectId}/${taskId}`} key={projectId}>
                        <Button variant="contained">Change Task information</Button>
                    </Link>
                </Grid>
                <Grid item xs={1} sx={{display: 'flex', alignItems:'center'}}>
                    <Link to={`/project/taskcreate/${projectId}/${user.uid}`} onClick={handleDelete} key = {projectId}>
                        <Button variant='contained' endIcon={<DeleteIcon />} color='error'>Delete This Task</Button>                    
                    </Link>
                </Grid>
                
            </Grid>
        </Box>
    )
}