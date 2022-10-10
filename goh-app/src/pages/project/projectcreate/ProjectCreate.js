/* Project Creation and Selection */

//Functionality
import { useState } from 'react';
import { getAuth } from 'firebase/auth'
import { useCollection } from '../../../hooks/useCollection';
import { useProject } from '../../../hooks/useProject';
import { firedb } from '../../../firebase/config';
import { doc, getDoc } from "firebase/firestore"

//Html components
import styles from './ProjectCreate.module.css';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';

export default function Project() {
    const [projName, setProjName] = useState('');
    const [projDescr, setProjDescr] = useState('');
    const [projOwned, setProjOwned] = useState('');
    const { createProject, error } = useProject();

    const { documents: allProjects } = useCollection('projects',null);
    const user = getAuth().currentUser;

    let ownProjectList = null;
    
    //fetch the current user project list
    const currUserDoc = doc(firedb, `users`, user.uid);
    getDoc(currUserDoc)
    .then((doc) => {
        ownProjectList = doc.data().ownedProjects;
    })
    .then(() => {
        //only get owned projects
        if (allProjects !== null) {
            setProjOwned(allProjects.filter((element) => {
                if (ownProjectList.includes(element.id)) {
                    return element;
                }
            }));
        }
    })
 
    const handleSubmit = (event) => {
        event.preventDefault();
        createProject(user.uid, projName, projDescr);
    }

    function test() {
        console.log(allProjects);
    }
   
    return (
        // <div> 
        // <form onSubmit={handleSubmit}>
        //     <h2>Project Info</h2>
                
        //         {/* Project Name field */}
        //         <label>
        //             <span>Project Name</span>
        //                 <input type = "projName"
        //                     onChange = {(e)=>setProjName(e.target.value)}
        //                     value = {projName}>
        //                 </input>
        //         </label>

                
        //         {/* Project Description */}
        //         <label>
        //             <span>Project Description</span>
        //                 <textarea type = "projDescr"
        //                     onChange = {(e)=>setProjDescr(e.target.value)}
        //                     value = {projDescr}>
        //                 </textarea>
        //         </label>

        //         {/* Project Lists */}


        //         <button className="btn" >Create Project</button>
        //         {error && <p> {error} </p>}
        //     </form>
        //     <button onClick={test}>Test</button>
        // </div> 
        <Box sx={{ p: 2, border: '1px dashed grey' }}>
            <Grid container spacing={5} className={styles['project-grid']} columns={5} sx={{ border: '1px dashed grey', width: '90%', margin: 'auto' }}>
                <Grid item xs={1}>
                    <Button variant="contained" className={styles['project-grid-button']}><AddIcon fontSize="large"/></Button>
                </Grid>              
            </Grid>
        </Box>

   )
}