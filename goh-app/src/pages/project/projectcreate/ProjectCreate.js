//create project
import { useState } from 'react';
import { getAuth } from 'firebase/auth'
import { useCollection } from '../../../hooks/useCollection';
import { useProject } from '../../../hooks/useProject';

import { 
    doc,
    getDoc,
} from "firebase/firestore"
   
import { firedb } from '../../../firebase/config';

export default function Project() {
   const [projName, setProjName] = useState('');
   const [projDescr, setProjDescr] = useState('');
   const { createProject, error } = useProject();

   //const { documents: allProjects } = useCollection('projects',null);
   const user = getAuth().currentUser;

   let ownProjectList = null

   //console.log(allProjects.where('id', '==', user.id))


   //fetch the current user project list
    const currUserDoc = doc(firedb, `users`, user.uid);

    getDoc(currUserDoc)
        .then((doc) => {
        ownProjectList = doc.data().ownedProjects
    })
 

    const handleSubmit = (event) => {
        event.preventDefault();
        createProject(user.uid, projName, projDescr);
    }
   

   return (
    <div> 
    <form onSubmit={handleSubmit}>
        <h2>Project Info</h2>
            
            {/* Project Name field */}
            <label>
                <span>Project Name</span>
                    <input type = "projName"
                        onChange = {(e)=>setProjName(e.target.value)}
                        value = {projName}>
                    </input>
            </label>

            
            {/* Project Description */}
            <label>
                <span>Project Description</span>
                    <textarea type = "projDescr"
                        onChange = {(e)=>setProjDescr(e.target.value)}
                        value = {projDescr}>
                    </textarea>
            </label>

            {/* Project Lists */}


            <button className="btn" >Create Project</button>
            {error && <p> {error} </p>}
        </form>
    </div>   
   )
}