import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import {collection, getDocs, limit, orderBy, query, startAfter, where} from 'firebase/firestore'
import { db } from '../firebase'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'
import { useParams } from 'react-router-dom'

const Category = () => {
  const[listings, setListings] = useState(null)
  const[loading, setLoading] = useState(true)
  const[lastFetchedListing, setLastFetchedListing] = useState(null)
//   to get the category name from the url
  const params = useParams()
  useEffect(() => {
    async function fetchListing() {
      try {
        const listingRef = collection(db, "listings")
        const q = query(listingRef, where("type", "==", params.categoryName),
        orderBy("timeStamp", "desc"),
        limit(8)
        )
        const querySnapshot = await getDocs(q)
        // to get the last visible document
        const lastvisible = querySnapshot.docs[querySnapshot.docs.length - 1]
        setLastFetchedListing(lastvisible)

        const  listing = []
        querySnapshot.forEach((doc) => {
          listing.push({
            id: doc.id,
            data: doc.data()
          })
        }
        )
        setListings(listing)
        setLoading(false)
      }
      catch (error) {
        toast.error("Error loading listings")
      }
    }
    fetchListing()

  }, [params.categoryName])
  // fetch more listings
async function onFetchMoreListings() {
  try {
    const listingRef = collection(db, "listings")
    const q = query(listingRef, where("type", "==", params.categoryName),
    orderBy("timeStamp", "desc"),
    startAfter(lastFetchedListing),
    limit(4)
    )
    const querySnapshot = await getDocs(q)
    // to get the last visible document
    const lastvisible = querySnapshot.docs[querySnapshot.docs.length - 1]
    setLastFetchedListing(lastvisible)

    const  listing = []
    querySnapshot.forEach((doc) => {
      listing.push({
        id: doc.id,
        data: doc.data()
      })
    }
    )
    setListings((prevListings) => [...prevListings, ...listing])
    setLoading(false)
  }
  catch (error) {
    toast.error("Error loading listings")
  }
}



  return (
    <div className='max-w-6xl px-3 mx-auto'>
      <h1 className='mt-6 mb-6 text-3xl font-bold text-center'>{
        params.categoryName == "rent" ? "Places for Rent" : "Places for Sale"
}</h1>
      {
        loading ? (
          <Spinner />
        ) : listings && listings.length > 0 ? (
          <>
            <main>
              <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {listings.map((listing) => (
                  <ListingItem key={listing.id} listing={listing.data} id={listing.id}/>
                ))}
              </ul>
            </main>
            {
              lastFetchedListing && (
                <div className='flex items-center justify-center'>
                  <button className='bg-white px-3 py-1.5 text-gray-700 border-gray-300 mb-6 mt-6 hover:border-slate-600 rounded transition duration-150 ease-in-out' onClick={onFetchMoreListings}> Load more</button>

                </div>
              )
            }
          </>
        ) : (
          <p> There are no current {params.categoryName===
            "rent" ? "Places for Rent" : "Places for Sale"
          }</p>
          
        )
      }
    </div>
  )
}

export default Category
