import React, { useState } from 'react'
import { getAuth, updateProfile } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from '../firebase';
import {FaHome} from 'react-icons/fa'
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import ListingItem from '../components/ListingItem';
import {motion} from 'framer-motion'
const Profile = () => {
  const auth =getAuth();
  const navigate = useNavigate();
  const [listings,setListings]=useState([])
  const [loading,setLoading]=useState(false)
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
  // to fetch the listings of the user
  useEffect(() => {
    async function fetchUserListings() {
      const listingRef = collection(db, "listings");
      // query to get the listings of the  current user
      // to check if the userRef is equal to the current user id
      // to create a query in  firestore we have to  use index
      const q = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timeStamp", "desc")
      );
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        // push the listings to the listings array
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    }
    fetchUserListings();
  }, [auth.currentUser.uid]);


  // to delete the listing
 async function onDelete(id){
    if(window.confirm("Are you sure you want to delete this listing?")){
      try{
        await deleteDoc(doc(db,'listings',id))
        const updatedListings=listings.filter(listing=>listing.id!==id)
        setListings(updatedListings)
        toast.success("listing deleted successfully")
      }
      catch(err){
        toast.error("could not delete the listing")
      }
    }
  }
  function onEdit(id){
    navigate(`/edit-listing/${id}`)
  }
  

    
  return (
    <>
      <section className='flex flex-col items-center justify-center max-w-6xl mx-auto'>  
        <motion.h1 className='mt-6 text-3xl font-bold text-center dark:text-white'  initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}>My Profile</motion.h1>
        <motion.img src={auth.currentUser.photoURL} alt="Profile Img" className='mt-2 rounded-lg' initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }} />
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
              <p className='flex items-center dark:text-white'>Do you want to change your name?
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
       {/* to show the listings of the user */}
      <div className='px-3 mx-auto mt-6 max-width-6xl'>
        {
          // condition to check if the listings are loaded and if the listings are not empty
          !loading&& listings.length>0 &&
          (
            <>
              <h2 className='mb-6 text-2xl font-semibold text-center'></h2>
              <ul className='gap-2 mt-6 mb-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4'>
                {
                  listings.map((listing)=>{
                    return(
                      <ListingItem key={listing.id} id={listing.id} listing={listing.data}
                      onDelete={()=>onDelete(listing.id)} 
                      onEdit={()=>onEdit(listing.id)} 
                      />
                    )
                  })
                }
              </ul>
            </>
          )
        }
      </div>
    </>
  )
}

export default Profile
