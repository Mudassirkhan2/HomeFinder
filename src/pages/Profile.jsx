import React, { useState } from 'react'
import { getAuth, updateProfile } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { doc, updateDoc } from "firebase/firestore";
import { db } from '../firebase';
const Profile = () => {
  const auth =getAuth();
  const navigate = useNavigate();
  const[changeDetails,setChangeDetails]=useState(false)
  const [formdata,setFormdata]=useState({
    name:auth.currentUser.displayName,
    email:auth.currentUser.email,
  })
  const {name,email}=formdata
  function onlogOut(){
    auth.signOut()
    navigate('/sign-in')
  }
  function onchange(e){
    setFormdata({...formdata,[e.target.id]:e.target.value})
  }
async function onSubmit(){
      try{
        if(auth.currentUser.displayName!==name){
          await updateProfile(auth.currentUser, {
            displayName: name,
          })
          const docRef =doc(db, "users", auth.currentUser.uid);
          await updateDoc(docRef, {
            name: name,
          });
          toast.success("name updated successfully")
        }
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
            <input type="email"  id="email" value={email} disabled={!changeDetails} 
            onChange={onchange}
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
        </div>
      </section> 
    </>
  )
}

export default Profile
