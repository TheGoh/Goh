import { useState } from 'react'
import React  from 'react';

export default function UserDashboard(){
    const [projectList, showProjectList] = useState([
        {title: "project 1", id:1},
        {title: "project 2", id:2},
        {title: "project 3", id:3}
      ]);
    
      const handleClick = (event) =>{
        //show project
      }
    
      return(
        <div>
          {/* goes to your profile*/}
          <label>Account</label>
          
          {/* project num */}
          <text>Project enrolled </text>
          
          {/* shows user enrolled projects */}
          {projectList.map((project)=> (
            <div key={project.id}>
              <h2>{project.title}</h2>
            </div>
          ))}
        </div>
      )
}