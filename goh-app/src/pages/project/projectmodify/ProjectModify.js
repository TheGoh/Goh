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

export default function Modify() {
    let { projectId } = useParams();
    const { documents: projectDtl } = useDocument('projects', projectId);
    const [projDescr, setProjDescr] = useState('');
    const [projName, setProjName] = useState('');
    const [projDescrSet, setDescr] = useState(false);
    const [projNameSet, setName] = useState(false);
    const [orig, setOrig] = useState(false);
    const { modifyDocument } = useFirestore();

    if (!projectDtl) {
        return <div> Loading... </div>
    }
    const name = projectDtl.projName
    const descr = projectDtl.projDescr
    if (orig === false) {
        setProjDescr(descr);
        setProjName(name);
        setOrig(true);
    }
    //When user click button, the handledelete function will remove the project collection from the database and user's project id list
    const handleModify = (e) => {
        if (projNameSet === false) {
            setProjName(name);
        }
        if (projDescrSet === false) {
            setProjDescr(descr);
        }
    
        //remove from projects collection
        if (projName !== '' && projDescr !== '') {
            modifyDocument(`projects`, projectId, projName, projDescr);
        } else if (projName !== '') {
            modifyDocument(`projects`, projectId, projName, descr);
        } else if (projDescr !== '') {
            modifyDocument(`projects`, projectId, name, projDescr);
        } else {
            modifyDocument(`projects`, projectId, name, descr);
        }
    }
    
    return (
        <Box >
            <Grid container sx={{margin: 'auto', width: '90%', alignItems: 'left'}} columns={4}>
                <Grid item xs={1}><h1>Project Modify</h1></Grid><Grid item xs={3}></Grid>
                <Grid item xs={1}>
                    <FormControl sx={{width:'55%'}}>
                        <InputLabel htmlFor="component-outlined">Project Name</InputLabel>
                        <OutlinedInput
                        id="component-outlined"
                        value={projName}
                        label="ProjectName"
                        onChange = {(e)=>{
                          setProjName(e.target.value);
                          setName(true);
                        }}
                        type="text"
                        />
                    </FormControl>
                </Grid>

                <Grid item xs={2}>
                    <FormControl sx={{width:'80%'}}>
                        <InputLabel htmlFor="component-outlined">Project Description</InputLabel>
                        <OutlinedInput
                        id="component-outlined"
                        value={projDescr}
                        label="ProjectDescr"
                        onChange = {(e)=>{
                          setProjDescr(e.target.value); 
                          setDescr(true);
                        }}
                        type="text"
                        multiline
                        />
                    </FormControl>
                </Grid>

                <Grid item xs={1}>
                    <Button component={Link} to="/project/projectcreate" onClick={handleModify} variant="contained" sx={{width: '50%'}}>Save</Button>    
                </Grid>
            
            </Grid>
        </Box>
    )
}