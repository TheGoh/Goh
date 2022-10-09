//create project
import { useState } from 'react';
import { useProject } from '../../../hooks/useProject';
import { getAuth } from 'firebase/auth'

export default function Project() {
   const [ownerid, setOwnerID] = useState('');
   const [projName, setProjName] = useState('');
   const [projDescr, setProjDescr] = useState('');
   const [projCapcity, setProjCapcity] = useState('');
   const {createProject, error, isPending} = useProject();

    //Form submit handler that calls createProj, will store proj in firebase
   const handleSubmit = (event) => {
    event.preventDefault();
    const auth = getAuth();
    const user = auth.currentUser;
    createProject(user.uid, projName, projDescr,projCapcity);
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

            {/* Project user capcity*/}
            <label>
                <span>Limitations on the number of people</span>
                    <textarea type = "projCapcity">
                        onChange = {(e)=>setProjCapcity(e.target.value)} 
                        value = {projCapcity}
                    </textarea>
            </label>
            {!isPending && <button className="btn" >Create Project</button>}
            {isPending && <button className="btn" disabled>loading</button>}
            {error && <p> {error} </p>}
        </form>
    </div>

    
    
   )
}