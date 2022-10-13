//import react-router
import { BrowserRouter, Routes, Route ,Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'

//import basic styles
import './App.css'

//adding pages and components
import Home from './pages/home/Home'
import Login from './pages/login/Login'
import Signup from './pages/signup/Signup'
import Navbar from './components/Navbar'
import AccountInfo from './pages/accountInfo/AccountInfo'
import ProjectCreate from './pages/project/projectcreate/ProjectCreate'
import Notification from './pages/notification/Notification'
import Project from './pages/project/projectinfo/ProjectInfo'
import Modify from './pages/project/projectmodify/ProjectModify'
import TModify from './pages/project/taskmodify/TaskModify'
import Task from './pages/project/taskcreate/TaskCreate'
import PendingInvite from './pages/pendinginvite/PendingInvite'
import TaskInfo from './pages/project/taskinfo/TaskInfo'

//import TaskCreate from './pages/task/taskcreate/TaskCreate'

//console.log(version);

function App() {
  const { user, authIsReady } = useAuthContext()

  // JSX
  return (
    <div className="App">
      {authIsReady && (
        <BrowserRouter>
          <div className="App Container">
            <Navbar />
            <Routes>
              {/* Redirect to Home page */}
              <Route path = '/' element={<Home />} />

              {/* Redirect to Home page */}
              <Route 
              path = '/login' 
              element={ !user ? <Login /> : <Navigate to = "/project/projectcreate"/> } 
              />

              {/* Redirect to Home page */}
              <Route
              path = '/signup'
              element={ user ? <Navigate to = "/project/projectcreate"/> : <Signup />} 
              />       

              <Route 
              path = '/accountInfo' 
              element={ user ? <AccountInfo/> : <Navigate to = "/login"/> } 
              />
              
              {/* Redirect to add project */}
              <Route
              path = '/project/projectcreate'
              element={ user ? <ProjectCreate/> : <Navigate to = "/login"/>} 
              />        

              {/* Redirect to add task */}
              {/* <Route
              path = '/task/taskcreate'
              element={ user ? <TaskCreate/> : <Navigate to = "/login"/>} 
              /> */}

              <Route
              path = '/project/:projectId'
              element={ user ? <Project/> : <Navigate to = "/login"/>}
              />

              {/* <Route
              path = '/notification'
              element={ user ? <Notification/> : <Navigate to = "/notification"/>}
              /> */}

              <Route
              path = '/project/projectmodify/:projectId'
              element={ user ? <Modify/> : <Navigate to = "/login"/>}
              />
              <Route
              path = '/project/taskmodify/:projectId/:taskId'
              element={ user ? <TModify/> : <Navigate to = "/login"/>}
              />

              <Route
              path = '/project/taskcreate/:projectId/:userUid'
              element={ user ? <Task/> : <Navigate to = "/login"/>}

              />

              <Route
              path = '/project/taskinfo/:projectId/:taskId'
              element={ user ? <TaskInfo/> : <Navigate to = "/login"/>}

              />

              <Route
              path = '/invitation'
              element={ user ? <PendingInvite/> : <Navigate to = "/login"/>}
              /> 

            </Routes>
          </div>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
