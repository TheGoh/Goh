//create project
import { useState } from 'react';
import { useProject } from '../../../hooks/useProject';
import { getAuth } from 'firebase/auth'
export default function Project() {
   const [ownerid, setOwnerID] = useState('');
   const [projName, setProjName] = useState('');
   const [projDescr, setProjDescr] = useState('');
   const {createProject, error, isPending} = useProject();

    //Form submit handler that calls createProj, will store proj in firebase
   const handleSubmit = (event) => {
    event.preventDefault();
    const auth = getAuth();
    const user = auth.currentUser;
    setOwnerID(user.uid);

    createProject(ownerid, projName, projDescr);
   }
   //Project information form
   const addProj = (e) => {
    <form onSubmit={handleSubmit}><h2>Project Info</h2>
        <label>
           <span>Project Name</span>
            <input type = "projName"
                    onChange = {(e)=>setProjName(e.target.value)}
                    value = {projName}></input>
       </label>
       <label>
           <span>Project Description</span>
            <input type = "projDescr"
                    onChange = {(e)=>setProjDescr(e.target.value)}
                    value = {projDescr}></input>
       </label></form>
   }


   return (
    <div className="Project">
        {/* Add Project Button*/}
        <h1 className="projects">Projects</h1>
                <button onClick={addProj}>Add</button>
        
    </div>
    
   )
}