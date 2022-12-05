/* Project Creation and Selection */

//Functionality
import { useState, useEffect } from 'react';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useCollection } from '../../../hooks/useCollection';
import { useDocument } from '../../../hooks/useDocument';
import { useFirestore } from '../../../hooks/useFirestore';
import { v4 as uuid } from 'uuid';

//routing
import { Link } from "react-router-dom";

//Html components
import styles from './ProjectCreate.module.css';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';

export default function ProjectCreate() {
    /* React states */
    const [open, setOpen] = useState(''); // form dialog open/close
    const [projName, setProjName] = useState('');
    const [projDescr, setProjDescr] = useState('');
    const [membersLimit, setMembersLimit] = useState('');
    const [all_projects_dict, setAllProjectsDict] = useState('');

    const { user } = useAuthContext()
    const { createProject, error } = useFirestore();
    /* Fetch the current user document*/
    const { documents: userDetail } = useDocument('users', user.uid);
    const { documents: allProjects , error2} = useCollection('projects', null);


    useEffect(() => {
        if (allProjects) {
            /* initialize a temp dictionary */
            let temp = {};
            allProjects.forEach(project => {
                temp[project.id] = project;
            });
            setAllProjectsDict(temp);
        }
    }, [allProjects])

    /* Form control */
    const handleClickOpen = () => { //popup form
        setOpen(true);
    };

    const handleClose = () => { //close form and clear inputs
        setProjName('');
        setProjDescr('');
        setMembersLimit('');
        setOpen(false);
    };

    const handleSubmit = (event) => { //close form and save project
        event.preventDefault();
        if (membersLimit && (membersLimit < 1)) return alert("Please enter a number larger than 1");
        if (projName.length !== 0) {
            const projid = uuid();
            createProject(user.uid, projid, projName, projDescr,membersLimit);
            setOpen(false);
        }
        setProjName('');
        setProjDescr('');
    };

    if (allProjects === null || userDetail === null || Object.keys(all_projects_dict).length === 0) return (<div>Loading</div>)
    else return (
        <Box>

            {/* Projects display */}
            <Grid container spacing={5}
                  columns={5}
                  sx={{width: '90%', margin: 'auto' }}>
                <Grid item xs={5}  sx={{display: 'flex', justifyContent: 'flex-start'}} className={styles['heading']}><h1> All Projects</h1></Grid>
                <Grid item xs={1} sx={{display: 'flex', justifyContent: 'flex-start'}}>
                    <Button variant="outlined" className={styles['project-grid-button']} onClick={handleClickOpen}>
                        <AddIcon fontSize="large"/>
                    </Button>
                </Grid>
                {userDetail.ownedProjects.length > 0 && userDetail.ownedProjects.map((item) => (

                    all_projects_dict[item] === (undefined) ? ""
                    :
                    <Grid item xs={1} key = {item} sx={{display: 'flex', justifyContent: 'flex-start'}}>
                        <Link to = {`/project/${all_projects_dict[item].id}`} key = {all_projects_dict[item].id} style={{ textDecoration: 'none' }}>
                            <Button variant="contained" className={styles['project-grid-button']}>
                                {
                                    all_projects_dict[item].projName
                                }
                            </Button>
                        </Link>
                    </Grid>
                ))}
            </Grid>

            {/* Popup form */}
            <Dialog open={Boolean(open)} onClose={handleClose}>
                <DialogTitle>Create Project</DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{textIndent:'0px'}}>
                            To create a project, please enter your project details. We
                            will send updates occasionally.
                        </DialogContentText>

                        <Grid container sx={{marginTop: '20px'}} columns={1}>
                            <Grid item xs={1} sx={{marginBottom: '20px'}}>
                                <FormControl sx={{width: "100%"}}>
                                    <InputLabel htmlFor="component-outlined">Project Name</InputLabel>
                                    <OutlinedInput
                                    id="component-outlined0"
                                    value={projName}
                                    label="ProjectName"
                                    onChange = {(e)=>setProjName(e.target.value)}
                                    type="text"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={1}>
                                <FormControl sx={{width: "100%"}}>
                                    <InputLabel htmlFor="component-outlined">Project Description</InputLabel>
                                    <OutlinedInput
                                    id="component-outlined1"
                                    value={projDescr}
                                    label="ProjectDescription"
                                    onChange = {(e)=>setProjDescr(e.target.value)}
                                    type="text"
                                    multiline
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={1} sx={{marginTop: '20px'}}>
                                <FormControl sx={{width: "100%"}}>
                                    <InputLabel htmlFor="component-outlined">Members Limit (Optional)</InputLabel>
                                    <OutlinedInput
                                        id="component-outlined2"
                                        value={membersLimit}
                                        label="MembersLimit"
                                        onChange = {(e)=>setMembersLimit(e.target.value)}
                                        type="text"
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Create</Button>
                </DialogActions>
            </Dialog>
        </Box>

   )
}
