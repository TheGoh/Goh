import { useState } from 'react'
import React  from 'react';
import styles from './Dashboard.module.css'

export default function UserDashboard(){
    const [projectList, showProjectList] = useState([
        {title: "project 1", id:1},
        {title: "project 2", id:2}, 
        {title: "project 3", id:3}
      ]);
    
      const handleClick = () =>{
    
      }
    
      return(
        <div className='App'>
          {/* goes to your profile*/}
          <button >Account</button>
          <h1>Dashboard </h1>
          
          {/* shows user enrolled projects */}
    
          {projectList.map((project)=> (
            <div key={project.id}>
              <h2>{project.title}</h2>
            </div>
          ))}
        </div>
      )
}