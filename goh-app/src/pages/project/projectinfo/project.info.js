
import './projectInfo.css'
import { useParams } from 'react-router-dom';
import { useFetchProject } from '../../../hooks/useFetchProject'



export default function Project() {
    let { projectId } = useParams;
    const { documents: projectDtl } = useFetchProject('projects', projectId);

    if (!projectDtl) {
        return <div className = "loading"> Loading .... </div>
    }
    
    return (
        <div className = "project - detail"> 
            Project Detail
        </div>
    )
}