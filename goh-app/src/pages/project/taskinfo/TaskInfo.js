
//import './ProjectInfo.css'
import { useParams } from 'react-router-dom';
import { useDocument } from '../../../hooks/useDocument';
import { useFirestore } from '../../../hooks/useFirestore'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { Link} from "react-router-dom";

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';

export default function TaskInfo() {
    let { projectId, taskId } = useParams();
    const { deleteDocument } = useFirestore()
    //console.log("here is target project id", projectId );
    const { documents: projectDtl } = useDocument(`projects/${projectId}/tasks`, taskId);
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
                    {user.uid === projectDtl.ownerid ?
                        <Button component={Link} to={`/project/taskmodify/${projectId}/${taskId}`} key={projectId} variant="contained">Change Task information</Button>
                        :
                        <div></div>
                    }
                </Grid>
                <Grid item xs={1} sx={{display: 'flex', alignItems:'center'}}>
                    {user.uid === projectDtl.ownerid ?
                        <Button component={Link} to={`/project/${projectId}`} onClick={handleDelete} key = {projectId} variant='contained' endIcon={<DeleteIcon />} color='error'>Delete This Task</Button>                    
                    :
                        <div></div>
                    }
                    
                </Grid>
                
            </Grid>
        </Box>
    )
}