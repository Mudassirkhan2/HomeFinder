import Home from "./pages/Home"
import {BrowserRouter as Router ,Route ,Routes} from "react-router-dom"
import Profile from "./pages/Profile"
import SignUP from "./pages/SignUP"
import ForgotPassword from "./pages/ForgotPassword"
import Offers from "./pages/Offers"
import SignIn from "./pages/SignIn"
import Navbar from "./components/Navbar"
import {ToastContainer} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from "./components/PrivateRoute"
import CreateListing from "./pages/CreateListing"
import EditListing from "./pages/EditListing"
function App() {

  return (
    <>
        <Router>
          <Navbar/>
          <Routes>
            <Route  path="/" element={<Home/>}/>
            {/* private Route */}
            <Route path="/profile" element={<PrivateRoute/>}>
              <Route  path="/profile" element={<Profile/>}/>
            </Route>
            <Route  path="/sign-in" element={<SignIn/>}/>
            <Route  path="/sign-up" element={<SignUP/>}/>
            <Route  path="/forgot-password" element={<ForgotPassword/>}/>
            <Route  path="/offers" element={<Offers/>}/>
            {/* private Route for create listing */}
            <Route path="/create-listing" element={<PrivateRoute/>}>
              <Route  path="/create-listing" element={<CreateListing/>}/>
            </Route>
            {/* private Route for edit listing */}
            <Route path="/edit-listing" element={<PrivateRoute/>}>
              <Route  path="/edit-listing/:listingId" element={<EditListing/>}/>
            </Route>
          </Routes>
        </Router>
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
/>
    </>
  )
}

export default App
