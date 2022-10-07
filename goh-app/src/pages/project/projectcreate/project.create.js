//create project
export default function project() {
   const [ownerid, setOwnerID] = useState('');
   const [projName, setProjName] = useState('');
   const [projDescr, setProjDescr] = useState('');
    //Form submit handler that calls createProj, will store proj in firebase
   const handleSubmit = (event) => {
    event.preventDefault();
    const user = firebase.auth().currentUser;
    setOwnerID(user.uid);
    createProj(ownerid, projName, projDescr);
   }
   //Project information form
   const addProj = (e) => {
    <form onSubmit={handleSubmit} className={styles['project-info form']}><h2>Project Info</h2>
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