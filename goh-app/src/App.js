//import react-router
import { BrowserRouter, Switch, Route } from 'react-router-dom'

//import basic styles
import './App.css'

//adding pages and components
import Home from './pages/home/Home'
import Login from './pages/login/Login'
import Signup from './pages/signup/Signup'
import Navbar from './components/Navbar'

function App() {

  // JSX
  return (
    <div className="App">
      <BrowserRouter>
        <div className="App Container">
          <Navbar />
          <Switch>
            {/* Redirect to Home page */}
            <Route exact path = '/'>
              <Home />
            </Route>

            {/* Redirect to Home page */}

            <Route path = '/login'>
              <Login />
            </Route>

            {/* Redirect to Home page */}

            <Route path = '/signup'>
              <Signup />
            </Route>

          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
