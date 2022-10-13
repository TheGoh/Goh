import { useParams } from 'react-router-dom';
import { useFetchProject } from '../../../hooks/useFetchProject';
import { useCollection } from '../../../hooks/useCollection';
import { useSetDoc } from '../../../hooks/useModifyDoc';
import { firedb } from '../../../firebase/config';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useState } from 'react';
import { Link } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore"

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';

export default function Modify() {
    let { projectId } = useParams();
    const { setDocument } = useSetDoc();
    const { documents: projectDtl } = useFetchProject('projects', projectId);
    const { user } = useAuthContext();
    const [projDescr, setProjDescr] = useState('');
    const [projName, setProjName] = useState('');
    const [projDescrSet, setDescr] = useState(false);
    const [projNameSet, setName] = useState(false);
    const { modifyDocument } = useSetDoc();

    if (!projectDtl) {
        return <div> Loading... </div>
    }
    const name = projectDtl.projName
    const descr = projectDtl.projDescr
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
                        />
                    </FormControl>
                </Grid>

                <Grid item xs={1}>
                    <Link to="/project/projectcreate" onClick={handleModify} >
                        <Button variant="contained" sx={{height: '90%', width: '50%'}}>Save</Button>
                    </Link>
                </Grid>
            
            </Grid>
        </Box>
    )
}