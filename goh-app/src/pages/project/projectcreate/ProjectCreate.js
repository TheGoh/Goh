//create project
import { useState } from 'react';
import { getAuth } from 'firebase/auth'
import { useCollection } from '../../../hooks/useCollection';
import { useAddDoc } from '../../../hooks/useAddDoc'
import { v4 as uuid } from 'uuid';

export default function Project() {
   const [projName, setProjName] = useState('');
   const [projDescr, setProjDescr] = useState('');
   const { addDoc, error } = useAddDoc();
   const user = getAuth().currentUser;

   //query error
   const { documents: projects } = useCollection('projects',
        ['projid','==',`users/${user.uid}/tokens/projid`] 
   );

   const { documents: lists } = useCollection(`users/${user.uid}/tokens`, null);

    const handleSubmit = (event) => {
    event.preventDefault();
    
    //generate date and unique id for project
    const projid = uuid();
    const createdAt = new Date();

    //create new collection structure
    const project = {
        projectid: projid,
        ownerid : user.uid,
        projName,
        projDescr,
        createdAt
    }
    
    addDoc(`projects`, projid, project)
    addDoc( `users/${user.uid}/tokens`, projid, projid)

    console.log('project list:' , projects)
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