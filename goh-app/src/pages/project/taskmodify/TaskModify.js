import { useParams } from 'react-router-dom';
import { useDocument } from '../../../hooks/useDocument';
import { useFirestore } from '../../../hooks/useFirestore';
import { useState } from 'react';
import { Link } from "react-router-dom";


import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';

export default function TModify() {
    let { projectId, taskId } = useParams();
    const { documents: taskDtl } = useDocument(`projects/${projectId}/tasks`, taskId);
    const [taskName, setTaskName] = useState('');
    const [taskDescr, setTaskDescr] = useState('');
    const { modifyTask } = useFirestore();
    const [taskPrio, setTaskPrio] = useState('');

    //When user click button, the handledelete function will remove the project collection from the database and user's project id list
    const handleModify = () => {
        //remove from projects collection
        const tempName = (taskName) ? taskName : taskDtl.taskName
        const tempDescr = (taskDescr) ? taskDescr : taskDtl.taskDescr
        modifyTask(`projects/${projectId}/tasks`, taskId, tempName, tempDescr);
    }

    if (!taskDtl) {
        return <div> Loading... </div>
    }
    
    return (
        <Box >
            <Grid container sx={{margin: 'auto', width: '90%', alignItems: 'left'}} columns={4}>
                <Grid item xs={1}><h1>Task Modify</h1></Grid><Grid item xs={3}></Grid>
                <Grid item xs={1}>
                    <FormControl sx={{width:'55%'}}>
                        <InputLabel htmlFor="component-outlined">Task Name</InputLabel>
                        <OutlinedInput
                        id="component-outlined"
                        value={taskName}
                        label="TaskName"
                        onChange = {(e)=>{
                          setTaskName(e.target.value);
                        }}
                        type="text"
                        />
                    </FormControl>
                </Grid>

                <Grid item xs={2}>
                    <FormControl sx={{width:'80%'}}>
                        <InputLabel htmlFor="component-outlined">Task Description</InputLabel>
                        <OutlinedInput
                        id="component-outlined"
                        value={taskDescr}
                        label="TaskDescr"
                        onChange = {(e)=>{
                          setTaskDescr(e.target.value); 
                        }}
                        type="text"
                        />
                    </FormControl>
                </Grid>

                <Grid item xs={1}>
                    <Link to={`/project/taskinfo/${projectId}/${taskId}`} onClick={handleModify} >
                        <Button variant="contained" sx={{height: '90%', width: '50%'}}>Save</Button>
                    </Link>
                </Grid>
            
            </Grid>
        </Box>
    )
}