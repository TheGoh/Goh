
//import './ProjectInfo.css'
import { useParams } from 'react-router-dom';
import { useFetchProject } from '../../../hooks/useFetchProject'
import { useCollection } from '../../../hooks/useCollection';
import { useSetDoc } from '../../../hooks/useModifyDoc';

import { firedb } from '../../../firebase/config';
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useState } from 'react';
import { Link } from "react-router-dom";




import { 
    doc,
    getDoc,
    updateDoc
    } from "firebase/firestore"

export default function Modify() {
    let { projectId } = useParams();
    const { setDocument } = useSetDoc()
    //console.log("here is target project id", projectId );
    const { documents: projectDtl } = useFetchProject('projects', projectId);
    const { user } = useAuthContext()
    const [projDescr, setProjDescr] = useState('');
    const [projName, setProjName] = useState('');
    const [projDescrSet, setDescr] = useState(false);
    const [projNameSet, setName] = useState(false);
    const { modifyDocument } = useSetDoc();


    // console.log(projectDtl)
    // console.log("project page user id", user.uid)

    if (!projectDtl) {
        return <div> Loading... </div>
    }
    const name = projectDtl.projName
    const descr = projectDtl.projDescr
    const handleModify = (e) => {
        if (projName !== '' && projDescr !== '') {
          modifyDocument(`projects`, projectId, projName, projDescr)
        } else if (projName !== '') {
          modifyDocument(`projects`, projectId, projName, descr)
        } else if (projDescr !== '') {
          modifyDocument(`projects`, projectId, name, projDescr)
        } else {
          modifyDocument(`projects`, projectId, name, descr)
        }
        
        //const ref = doc(firedb, `users`, user.uid
        //remove from user's project id entry
    }
    //asdjasjdklajs
    return (
        <div>
          <form>
            <h2>Project Information</h2>
            <label>
            <span>Project Name</span>
              <input
                    type = "text"
                    value={projName}
                    onChange={(e)=>{
                        setProjName(e.target.value)
                    }}
              />
              <span>Project Description</span>
              <input
                    type = "text"
                    value={projDescr}
                    onChange={(e)=>{
                         setProjDescr(e.target.value)
                    }}  
              />
            </label>
            <Link to="/project/projectcreate" onClick={handleModify}> Save </Link>
          </form>
        </div>
    )
}