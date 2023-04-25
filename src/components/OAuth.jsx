import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import React from 'react'
import {FcGoogle} from "react-icons/fc"
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { db } from '../firebase'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
const OAuth = () => {
  const navigate = useNavigate()
  async function onGoogleClick() {
    try{
        const auth =getAuth();
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        //check if user is new or not
        const docRef =doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if(!docSnap.exists()){
          //if user is new then add user to database
          await setDoc(docRef,{
            name:user.displayName,
            email:user.email,
            timestamp:serverTimestamp(),
          });
        }
        navigate("/")
        toast.success("Sign in successful")

    }
    catch{
      toast.error("Could not sign in with google")
    }
  }
  return (
    <button type='button' onClick={onGoogleClick} className='flex items-center justify-center w-full py-3 text-sm font-medium text-white transition duration-150 ease-in-out bg-red-700 rounded shadow-md px-7 hover:bg-red-800 active:bg-red-900 hover:shadow-lg active:shadow-xl'>
    <FcGoogle   className='mr-2 text-2xl bg-white rounded-full '/>
      Continue With Google
    </button>
  )
}

export default OAuth
