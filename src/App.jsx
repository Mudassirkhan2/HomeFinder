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
import Listing from "./pages/Listing"
import Category from "./pages/Category"
import { FaLinkedin,FaGithub } from "react-icons/fa"
import { motion } from "framer-motion"

function App() {
  return (
    <div className="bg-[#D6E8DB] dark:bg-black">
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
            <Route  path="/category/:categoryName" element={<Category/>}/>
            
            <Route  path="/category/:categoryName/:listingId" element={<Listing/>}/>
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
        {/* My Profile linkden and github */}
        <motion.div className="fixed bottom-0 right-0 flex p-1 space-x-4 bg-teal-500 rounded-md dark:text-white" 
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }} >
          <p className="text-lg text-center font-BarlowCondensed lg:text-2xl">Made By Mudassir Khan</p>
          <div className="flex items-center justify-center space-x-3 ">
          <motion.p initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}>
          <FaLinkedin className="text-2xl text-center cursor-pointer hover:text-blue-500" onClick={()=>window.open("https://www.linkedin.com/in/mudassir-khan-522303233/")} />
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}>
            <FaGithub className="text-2xl text-center cursor-pointer hover:text-blue-500" onClick={()=>window.open("https://github.com/Mudassirkhan2")} />
          </motion.p>
          </div>
        </motion.div>
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

    </div>
  )
}

export default App
