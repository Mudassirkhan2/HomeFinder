import { getAuth, onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import {useLocation , Link} from "react-router-dom"
const Navbar = () => {
    const[pageState,setPageState]=useState("Sign in")
    const location=useLocation()
    const auth =getAuth();
    useEffect(()=>{ 
        onAuthStateChanged(auth, (user) => {
            if (user) {
              setPageState("Profile")
            } else {
              setPageState("Sign in")
            }
          });
    },[auth])
    function pathMatchRoute(route){
      if(route === location.pathname){
          return true
        }
    }
  return (
    <div className='sticky top-0 z-30 bg-white border-b shadow-sm'>
      <header className='flex items-center justify-between max-w-6xl px-3 mx-auto'>
        <div>
            <Link to={"/"}><img src=" " alt="logo" className='h-5 cursor-pointer' /></Link>
        </div>
        <div>
            <ul className='flex space-x-10'>
              <Link to={"/"}>  <li className={`py-3 text-sm font-semibold cursor-pointer text-gray-400 border-b-4 border-b-transparent ${pathMatchRoute("/") && "text-black border-b-red-400"} `}>Home</li></Link>
              <Link to={"/offers"}><li className={`py-3 text-sm font-semibold cursor-pointer text-gray-400 border-b-4 border-b-transparent ${pathMatchRoute("/offers")&& "text-black border-b-red-400"}`}>offers</li></Link>
              {/* we are navigating to profile if the user is not registered he will navigate to sign in as we protected the navigation */}
              <Link to={"/profile"}><li className={`py-3 text-sm font-semibold cursor-pointer text-gray-400 border-b-4 border-b-transparent ${(pathMatchRoute("/sign-in") || pathMatchRoute("/profile"))&&  "text-black border-b-red-400"}`}>
                {pageState}
                </li></Link>
            </ul>
        </div>
      </header>
    </div>
  )
}

export default Navbar
