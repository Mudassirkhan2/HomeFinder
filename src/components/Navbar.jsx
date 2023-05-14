import { getAuth, onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import {useLocation , Link} from "react-router-dom"
import {BsFillMoonStarsFill,BsSun} from "react-icons/bs"
const Navbar = () => {
    const[pageState,setPageState]=useState("Sign in")
    const [theme, setTheme] = useState(null)
    const location=useLocation()
    const auth =getAuth();
    useEffect(() => {
      if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){
        setTheme('dark')
      }else{
        setTheme('light')
      }
      const localTheme = window.localStorage.getItem('theme')
      localTheme && setTheme(localTheme)
    }, [])
    useEffect(() => {
      if (theme === 'light') {
        document.documentElement.classList.remove('dark')
        document.documentElement.classList.add('light')
      }
      if (theme === 'dark') {
        document.documentElement.classList.remove('light')
        document.documentElement.classList.add('dark')
      }
     
    }, [theme])
// handele the theme
    const handleTheme = () => {
      if (theme === 'light') {
        setTheme('dark')
        window.localStorage.setItem('theme', 'dark')
      } else {
        setTheme('light')
        window.localStorage.setItem('theme', 'light')
      }
    }

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
    <div className='sticky top-0 z-30 bg-white border-b shadow-sm dark:bg-black font-BarlowCondensed'>
      <header className='flex items-center justify-between max-w-6xl px-3 mx-auto'>
        <div>
            <Link to={"/"}>
              <p className='font-bold font-RampartOne dark:text-white'>Home
               <span className='text-teal-400'>Finder</span>
              </p>
            </Link>
        </div>
        <div>
            <ul className='flex space-x-10'>
              <button onClick={handleTheme}  className='dark:text-white' >{

                theme === 'light' ? (
                  <>
                  
                 <BsFillMoonStarsFill className='text-lg'/>
                  </>
                ) : (
                  <BsSun className='text-lg'/>
                )
              }</button>
              <Link to={"/"}>  <li className={`py-3 text-sm font-semibold cursor-pointer text-gray-400 border-b-4  ${pathMatchRoute("/") && "text-black border-b-red-400"} `}>Home</li></Link>
              <Link to={"/offers"}><li className={`py-3 text-sm font-semibold cursor-pointer text-gray-400 border-b-4  ${pathMatchRoute("/offers") && "text-black border-b-red-400"}`}>offers</li></Link>
              {/* we are navigating to profile if the user is not registered he will navigate to sign in as we protected the navigation */}
              <Link to={"/profile"}><li className={`py-3 text-sm font-semibold cursor-pointer text-gray-400 border-b-4  ${(pathMatchRoute("/sign-in") || pathMatchRoute("/profile")) &&  "text-black border-b-red-400"}`}>
                {pageState}
                </li></Link>
            </ul>
        </div>
      </header>
    </div>
  )
}

export default Navbar
