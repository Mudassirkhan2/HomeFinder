import React, { useState } from 'react'
import {AiFillEyeInvisible,AiFillEye} from "react-icons/ai"
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { signInWithEmailAndPassword,getAuth } from 'firebase/auth';
import { toast } from 'react-toastify';
import property from "../assets/property.png"
import {motion} from 'framer-motion'
const SignIn = () => {
  const navigate=useNavigate();
  const[formdata,setFormData]=React.useState({ 
    email:"",
    password:""
  })
  const[showpassword,setShowPassword]=useState(false);
 
  const {email,password}=formdata;
  function onChange(e){
    setFormData((prevState)=>({
      ...prevState,[e.target.id]:e.target.value,
    }))
  }
  async function onSubmit(e){
    e.preventDefault();
    try{
      const auth = getAuth();
       const userCredential =await signInWithEmailAndPassword(auth, email, password);
      toast.success("Sign in successful")
      if(userCredential.user){
        navigate("/")
      }
    }
    catch{
      toast.error("Could not sign in")
    }
  }
  return (
    <section className='h-screen'>
      <motion.h1 className='mt-6 text-3xl font-bold text-center dark:text-teal-400' initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}> Sign In </motion.h1>
      <div className='flex flex-wrap items-center justify-center max-w-6xl px-6 py-12 mx-auto '>
        <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
          <img src={property} alt="Key"  className='w-full rounded-2xl'/>
        </div>
        <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>
          <form onSubmit={onSubmit}>
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
              <p className='mb-6 dark:text-teal-400'>Don't have account? <Link to="/sign-up" className='ml-1 text-red-600 transition duration-200 ease-in-out hover:text-red-900'>Register</Link> </p>
              <p>
                <Link to={"/forgot-password"}  className='text-blue-600 transition duration-200 ease-in-out hover:text-blue-900'>Forgot password? </Link>
              </p>
            </div>
            
            <button type='submit' className='w-full py-3 text-sm font-medium text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded shadow-md px-7 hover:bg-blue-700 hover:shadow-lg active:bg-blue-800' >Sign in</button>

            <div className='flex items-center my-4 before:border-t before:flex-1 before:border-gray-300 after:border-t after:flex-1 after:border-gray-300'>
              <p className='mx-4 font-semibold text-center dark:text-teal-400'>OR</p>
            </div>
            <OAuth/>
          </form>
       
        </div>
      </div>
    </section>
  )
}

export default SignIn
