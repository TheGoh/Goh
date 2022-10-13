import { v4 as uuid } from 'uuid';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useFetchProject } from '../../../hooks/useFetchProject'
import { useTask } from '../../../hooks/useTask';
import { Link} from "react-router-dom";

export default function Task() {
    let { projectId, userUid } = useParams();
    const { documents: projectDtl } = useFetchProject('projects', projectId);
    const [taskName, setTaskName] = useState('');
    const [taskDescr, setTaskDescr] = useState('');
    const { createTask } = useTask();

    if (!projectDtl) {
        return <div> Loading... </div>
    }

    const handleSubmit = (event) => {
        //event.preventDefault();
        const taskid = uuid();
        createTask(projectId, 
                    userUid, 
                      taskid, 
                    taskName, 
                    taskDescr)
        setTaskName('')
        setTaskDescr('')
        
    }

    return(
<<<<<<< Updated upstream
        <div>
          <form>
            <h2>Task Information</h2>
            <label>
            <span>Task Name</span>
              <input
                    type = "text"
                    value={taskName}
                    onChange={(e)=>{
                        setTaskName(e.target.value)
                    }}
              />
              <span>Task Description</span>
              <input
                    type = "text"
                    value={taskDescr}
                    onChange={(e)=>{
                         setTaskDescr(e.target.value)
                    }}  
              />
            </label>
            <Link to= {`/project/${projectId}`} key = {projectId} onClick={handleSubmit}> Save </Link>
          </form>
        </div>
=======
        // <Link to= {`/project/${projectId}`} key = {projectId} onClick={handleSubmit}> Save </Link>
        
        <Box>
          <Grid container spacing={5} columns={6} sx={{width: '90%', margin: 'auto'}}>
              <Grid item xs={1}>
                  <Button variant="outlined" className={styles['task-grid-button']} onClick={handleClickOpen}><LibraryAddIcon/></Button>
             </Grid>
              {
                task_ids.length > 0 && task_ids.map((task) => 
                <Grid item xs={1} key={task}>
                  <Link to={`/project/taskinfo/${projectId}/${task_dict[task].taskId}`} style={{ textDecoration: 'none' }}>
                    <Button variant="contained" className={styles['task-grid-button']}>
                      {task_dict[task].taskName}
                    </Button>
                  </Link>
                </Grid>
              )}
          </Grid>
          {/* Popup form */}
          <Dialog open={Boolean(open)} onClose={handleClose}>
            <DialogTitle>Create Task</DialogTitle>
              <DialogContent>
                <DialogContentText sx={{textIndent:'0px'}}>
                  To create a task, please enter your task details. We
                  will send updates occasionally.
                </DialogContentText>

                <Grid container sx={{marginTop: '20px'}} columns={1}>
                  <Grid item xs={1} sx={{marginBottom: '20px'}}>
                    <FormControl sx={{width: "100%"}}>
                      <InputLabel htmlFor="component-outlined">Task Name</InputLabel>
                      <OutlinedInput
                      id="component-outlined"
                      value={taskName}
                      label="TaskName"
                      onChange = {(e)=>setTaskName(e.target.value)}
                      type="text"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={1}>
                    <FormControl sx={{width: "100%"}}>
                      <InputLabel htmlFor="component-outlined">Task Description</InputLabel>
                      <OutlinedInput
                      id="component-outlined"
                      value={taskDescr}
                      label="TaskDescription"
                      onChange = {(e)=>setTaskDescr(e.target.value)}
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
>>>>>>> Stashed changes
    )


}