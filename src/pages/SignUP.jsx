import React, { useState } from 'react'
import {AiFillEyeInvisible,AiFillEye} from "react-icons/ai"
import { Link } from 'react-router-dom';
import OAuth from '../components/OAuth';
const SignUP = () => {
  const[formdata,setFormData]=React.useState({
    name:"", 
    email:"",
    password:""
  })
  const[showpassword,setShowPassword]=useState(false);

  const {email,password,name}=formdata;
  function onChange(e){
    setFormData((prevState)=>({
      ...prevState,[e.target.id]:e.target.value,
    }))
  }
  return (
    <section>
      <h1 className='mt-6 text-3xl font-bold text-center'> Sign Up </h1>
      <div className='flex flex-wrap items-center justify-center max-w-6xl px-6 py-12 mx-auto '>
        <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
          <img src="https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80" alt="Key"  className='w-full rounded-2xl'/>
        </div>
        <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>
          <form >
            <input type="text" id='name' value={name}  className='w-full px-4 py-2 mb-6 text-xl text-gray-700 transition ease-in-out bg-white border-gray-300 rounded' onChange={onChange}
            placeholder='Full name'/>
            <input type="email" id='email' value={email}  className='w-full px-4 py-2 mb-6 text-xl text-gray-700 transition ease-in-out bg-white border-gray-300 rounded' onChange={onChange}
            placeholder='Email address'/>
            <div className='relative mb-6'>
              <input type={showpassword ? "text" : "password"} id='password' value={password}  className='w-full px-4 py-2 text-xl text-gray-700 transition ease-in-out bg-white border-gray-300 rounded' onChange={onChange}
              placeholder='Password'/>

              {
                showpassword ? <AiFillEyeInvisible className='absolute text-2xl text-gray-500 cursor-pointer right-4 top-4' onClick={()=>setShowPassword(!showpassword)}/> : <AiFillEye className='absolute text-2xl text-gray-500 cursor-pointer right-4 top-4' onClick={()=>setShowPassword(!showpassword)}/>
              }
            </div>

            <div className='flex justify-between text-sm whitespace-nowrap sm:text-lg'>
              <p className='mb-6'>Have an account? <Link to="/sign-in" className='ml-1 text-red-600 transition duration-200 ease-in-out hover:text-red-900'>Sign-in</Link> </p>
              <p>
                <Link to={"/forgot-password"}  className='text-blue-600 transition duration-200 ease-in-out hover:text-blue-900'>Forgot password? </Link>
              </p>
            </div>
            
            <button type='submit' className='w-full py-3 text-sm font-medium text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded shadow-md px-7 hover:bg-blue-700 hover:shadow-lg active:bg-blue-800' >Sign Up</button>

            <div className='flex items-center my-4 before:border-t before:flex-1 before:border-gray-300 after:border-t after:flex-1 after:border-gray-300'>
              <p className='mx-4 font-semibold text-center'>OR</p>
            </div>
            <OAuth/>
          </form>
       
        </div>
      </div>
    </section>
  )
}
export default SignUP

