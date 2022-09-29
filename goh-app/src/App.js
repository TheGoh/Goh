//import react-router

//TODO: update the react router package
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { version } from 'react';


//import basic styles
import './App.css'

//adding pages and components
import Home from './pages/home/Home'
import Login from './pages/login/Login'
import Signup from './pages/signup/Signup'
import Navbar from './components/Navbar'
import AccountInfo from './pages/accountInfo/AccountInfo'

console.log(version);

function App() {

  // JSX
  return (
    <div className="App">
      <BrowserRouter>
        <div className="App Container">
          <Navbar />
          <Routes>
            {/* Redirect to Home page */}
            <Route path = '/' element={<Home />} />

            {/* Redirect to Home page */}
            <Route path = '/login' element={<Login />} />

            {/* Redirect to Home page */}
            <Route path = '/signup' element={<Signup />} />

            <Route path = '/accountInfo' element={<AccountInfo />} />

          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
