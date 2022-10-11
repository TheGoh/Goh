
import './ProjectInfo.css'
import { useParams } from 'react-router-dom';
import { useFetchProject } from '../../../hooks/useFetchProject'
import { useCollection } from '../../../hooks/useCollection';

export default function Project() {
    let { projectId } = useParams();
    //console.log("here is target project id", projectId );
    const { documents: projectDtl } = useFetchProject('projects', projectId);

    console.log(projectDtl)

    if (!projectDtl) {
        return <div> Loading... </div>
    }

    return (
        <div className = "project - detail"> 
            <h1>{projectDtl.projName}</h1>
            <h2>{projectDtl.projDescr}</h2>
        </div>
    )
}