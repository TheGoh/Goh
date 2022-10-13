
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
    const { modifyDocument } = useSetDoc();

    // console.log(projectDtl)
    // console.log("project page user id", user.uid)

    if (!projectDtl) {
        return <div> Loading... </div>
    }

    //When user click button, the handledelete function will remove the project collection from the database and user's project id list
    const handleModify = async(e) => {

        //remove from projects collection
        modifyDocument(`projects`, projectId, projName, projDescr)
        //const ref = doc(firedb, `users`, user.uid
        //remove from user's project id entry
    }

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
            {<button onClick={handleModify}>Save</button>}
          </form>
        </div>
    )
}