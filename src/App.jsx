import Home from "./pages/Home"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Profile from "./pages/Profile"
import SignUP from "./pages/SignUP"
import ForgotPassword from "./pages/ForgotPassword"
import Offers from "./pages/Offers"
import SignIn from "./pages/SignIn"
import Navbar from "./components/Navbar"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import PrivateRoute from "./components/PrivateRoute"
import CreateListing from "./pages/CreateListing"
import EditListing from "./pages/EditListing"
import Listing from "./pages/Listing"
import Category from "./pages/Category"
import Search from "./pages/Search"
import Saved from "./pages/Saved"
import Footer from "./components/Footer"
import { AuthProvider } from "./context/AuthContext"

function App() {
  return (
    <AuthProvider>
      <div className="bg-surface-secondary dark:bg-dark-bg min-h-screen">
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/profile" element={<PrivateRoute />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="/saved" element={<PrivateRoute />}>
              <Route path="/saved" element={<Saved />} />
            </Route>
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUP />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/category/:categoryName" element={<Category />} />
            <Route path="/category/:categoryName/:listingId" element={<Listing />} />
            <Route path="/create-listing" element={<PrivateRoute />}>
              <Route path="/create-listing" element={<CreateListing />} />
            </Route>
            <Route path="/edit-listing" element={<PrivateRoute />}>
              <Route path="/edit-listing/:listingId" element={<EditListing />} />
            </Route>
          </Routes>
          <Footer />
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
      </div>
    </AuthProvider>
  )
}

export default App
