import React from 'react'
import {useLocation , Link} from "react-router-dom"
const Navbar = () => {
    const location=useLocation()
    function pathMathRoute(route){
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
              <Link to={"/"}>  <li className={`py-3 text-sm font-semibold cursor-pointer text-gray-400 border-b-4 border-b-transparent ${pathMathRoute("/") && "text-black border-b-red-400"} `}>Home</li></Link>
              <Link to={"/offers"}><li className={`py-3 text-sm font-semibold cursor-pointer text-gray-400 border-b-4 border-b-transparent ${pathMathRoute("/offers")&& "text-black border-b-red-400"}`}>offers</li></Link>
              <Link to={"/sign-in"}><li className={`py-3 text-sm font-semibold cursor-pointer text-gray-400 border-b-4 border-b-transparent ${pathMathRoute("/sign-in")&&  "text-black border-b-red-400"}`}>Sign-in</li></Link>
            </ul>
        </div>
      </header>
    </div>
  )
}

export default Navbar
