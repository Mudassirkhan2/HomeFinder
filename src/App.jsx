import Home from "./pages/Home"
import {BrowserRouter as Router ,Route ,Routes} from "react-router-dom"
import Profile from "./pages/Profile"
import SignUP from "./pages/SignUP"
import ForgotPassword from "./pages/ForgotPassword"
import Offers from "./pages/Offers"
import SignIn from "./pages/Signin"
import Navbar from "./components/Navbar"
function App() {

  return (
    <>
        <Router>
          <Navbar/>
          <Routes>
            <Route  path="/" element={<Home/>}/>
            <Route  path="/profile" element={<Profile/>}/>
            <Route  path="/sign-in" element={<SignIn/>}/>
            <Route  path="/sign-up" element={<SignUP/>}/>
            <Route  path="/forgot-password" element={<ForgotPassword/>}/>
            <Route  path="/offers" element={<Offers/>}/>
          </Routes>
        </Router>
    </>
  )
}

export default App
