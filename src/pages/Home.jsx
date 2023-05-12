import React, { useEffect, useState } from 'react'
import  Slider  from '../components/Slider'
import { collection,getDocs, limit, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'
import Spinner from '../components/Spinner'
const Home = () => {
  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchListings() {
      const listingRef = collection(db, 'listings')
      // query to get the latest 5 listings
      const q = query(listingRef, orderBy('timeStamp', 'desc'),limit(5))
      const querySnapshot = await getDocs(q)
      let listings = []
      querySnapshot.forEach((doc) => {
        return  listings.push({
          id : doc.id,
          data : doc.data(),
        });
      });
      setListings(listings)
      setLoading(false)
    }
    fetchListings()
  }, [])
  if (loading) {
    return <Spinner />
  }
  if (listings.length === 0) {
    return <h1>No listings found</h1>
  }


  return (
    <div>
      <Slider />
    </div>
  )
}

export default Home
