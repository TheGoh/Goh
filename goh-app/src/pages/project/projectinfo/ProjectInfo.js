
//import './ProjectInfo.css'
import { useParams } from 'react-router-dom';
import { useFetchProject } from '../../../hooks/useFetchProject'
import { useCollection } from '../../../hooks/useCollection';
import { useDeleteDoc } from '../../../hooks/useDeleteDoc'

import { firedb } from '../../../firebase/config';
import { useAuthContext } from '../../../hooks/useAuthContext'

import { Link} from "react-router-dom";




import { 
    doc,
    getDoc,
    updateDoc
    } from "firebase/firestore"

export default function Project() {
    let { projectId } = useParams();
    const { deleteDocument } = useDeleteDoc()
    //console.log("here is target project id", projectId );
    const { documents: projectDtl } = useFetchProject('projects', projectId);
    const { user } = useAuthContext()

    // console.log(projectDtl)
    // console.log("project page user id", user.uid)

    if (!projectDtl) {
        return <div> Loading... </div>
    }

    //When user click button, the handledelete function will remove the project collection from the database and user's project id list
    const handleDelete = async(e) => {

        //remove from projects collection
        deleteDocument(`projects`, projectId)
        const ref = doc(firedb, `users`, user.uid)

        //remove from user's project id entry
        getDoc(ref)
            .then ((doc) => {
                let tempOwnedProjects = doc.data().ownedProjects;
                let tempList = tempOwnedProjects.filter((project) => {
                    if (projectId !== project) return project
                })
                
                updateDoc(ref, {
                     ownedProjects: tempList
                })
                .then(() => {
                    console.log("update successfully!!!",tempList)
                })

            })
    }

    return (
        <div className = "project - detail"> 
            <h1>{projectDtl.projName}</h1>
            <h2>{projectDtl.projDescr}</h2>
            <Link to={`/project/projectmodify/${projectId}`} key = {projectId}> !!!Modify This Project!!! </Link>
            <Link to="/project/projectcreate" onClick={handleDelete}> !!!Delete This Project!!! </Link>
        </div>
    )
}