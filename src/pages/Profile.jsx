import React, { useState } from 'react'
import { getAuth, updateProfile } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { doc, updateDoc } from "firebase/firestore";
import { db } from '../firebase';
import {FaHome} from 'react-icons/fa'
import { Link } from 'react-router-dom';
const Profile = () => {
  const auth =getAuth();
  const navigate = useNavigate();
  const[changeDetails,setChangeDetails]=useState(false)
  const [formdata,setFormdata]=useState({
    name:auth.currentUser.displayName,
    email:auth.currentUser.email,
  })
  const {name,email}=formdata
  // on logout
  function onlogOut(){
    auth.signOut()
    navigate('/sign-in')
  }
  // to update the name in firebase auth and firestore
  function onchange(e){
    setFormdata({...formdata,[e.target.id]:e.target.value})
  }
async function onSubmit(){
      try{
        // to update the name in firebase auth
        if(auth.currentUser.displayName!==name){
          await updateProfile(auth.currentUser, {
            displayName: name,
          })
          // to update the name in firestore
          const docRef =doc(db, "users", auth.currentUser.uid);
          await updateDoc(docRef, {
            name: name,
          });
          toast.success("name updated successfully")
        }
        // if name is same as before
        else{
            toast.error("name is same as before")
          }
      }
      catch(err){
        toast.error("could not update the profile details")
      }
  }
  return (
    <>
      <section className='flex flex-col items-center justify-center max-w-6xl mx-auto'>  
        <h1 className='mt-6 text-3xl font-bold text-center'>My Profile</h1>
        <div className='w-full md:w-[50%] mt-6 px-3'>
          <form >
            {/* Name */}
            <input type="text"  id="name" value={name} disabled={!changeDetails}
            onChange={onchange} 
            className={ `w-full px-4 py-2 mb-6 text-xl text-gray-700 transition ease-in-out bg-white border border-gray-300 rounded ${changeDetails && "bg-red-200 "}`}/>
             {/* Email */}
            <input type="email"  id="email" value={email} disabled
            className='w-full px-4 py-2 mb-6 text-xl text-gray-700 transition ease-in-out bg-white border border-gray-300 rounded'/>

            <div className='flex justify-between text-sm whitespace-nowrap sm:text-lg'>
              <p className='flex items-center '>Do you want to change your name?
                <span onClick={()=>{
                  changeDetails && onSubmit()
                  setChangeDetails(!changeDetails)
                }
              } className='ml-1 text-red-600 transition duration-200 ease-in-out cursor-pointer hover:text-red-700'>{
                  changeDetails?'Apply change':'Edit'
                }</span>
              </p>
              <p onClick={onlogOut} className='text-blue-600 transition duration-150 ease-in-out cursor-pointer hover:text-blue-800'>Log out</p>

            </div>
          </form>
          <button type="submit" className='w-full py-3 mt-4 text-sm font-medium text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded shadow-md px-7 hover:bg-blue-800 hover:shadow-lg' >
            <Link to="/create-listing " className='flex items-center justify-center'>
              <FaHome className='p-1 mr-2 text-3xl border-2 rounded-full'/>
              Sell or rent your property
            </Link>
          </button>
        </div>
      </section> 
    </>
  )
}

export default Profile
