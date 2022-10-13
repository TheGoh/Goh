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
    )


}