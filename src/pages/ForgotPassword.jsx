import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { toast } from 'react-toastify';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import property from "../assets/property.png"
import { motion } from 'framer-motion';
const ForgotPassword = () => {
  const[email,setEmail]=React.useState("")

  function onChange(e){
    setEmail(e.target.value)
  }
  async function onSubmit(e){
     e.preventDefault();
      try{
        const auth =getAuth()
        await sendPasswordResetEmail(auth, email);
        toast.success("Reset password link sent to your email")
      }catch{
        toast.error("Could not send reset password ")
      }

  }
  return (
    <section className='h-screen'>
      <motion.h1 className='mt-6 text-3xl font-bold text-center dark:text-teal-400' initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}> Forgot Password </motion.h1>
      <div className='flex flex-wrap items-center justify-center max-w-6xl px-6 py-12 mx-auto '>
        <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
          <img src={property} alt="Key"  className='w-full rounded-2xl'/>
        </div>
        <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>
          <form onSubmit={onSubmit}>
            <input type="email" id='email' value={email}  className='w-full px-4 py-2 mb-6 text-xl text-gray-700 transition ease-in-out bg-white border-gray-300 rounded' onChange={onChange}
            placeholder='Email address'/>
            

            <div className='flex justify-between text-sm whitespace-nowrap sm:text-lg'>
              <p className='mb-6 dark:text-teal-400'>Don't have account? <Link to="/sign-up" className='ml-1 text-red-600 transition duration-200 ease-in-out hover:text-red-900'>Register</Link> </p>
              <p>
                <Link to={"/sign-in"}  className='text-blue-600 transition duration-200 ease-in-out hover:text-blue-900'>Sign in instead</Link>
              </p>
            </div>
            
            <button type='submit' className='w-full py-3 text-sm font-medium text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded shadow-md px-7 hover:bg-blue-700 hover:shadow-lg active:bg-blue-800' >Send reset password</button>

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

export default ForgotPassword
