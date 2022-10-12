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
import TaskCreate from './pages/task/taskcreate/TaskCreate'

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
              element={ !user ? <Login /> : <Navigate to = "/accountInfo"/> } 
              />

              {/* Redirect to Home page */}
              <Route
              path = '/signup'
              element={ user ? <Navigate to = "/accountInfo"/> : <Signup />} 
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
              <Route
              path = '/task/taskcreate'
              element={ user ? <TaskCreate/> : <Navigate to = "/login"/>} 
              />

              <Route
              path = '/notification'
              element={ user ? <Notification/> : <Navigate to = "/notification"/>}
              />

            </Routes>
          </div>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
