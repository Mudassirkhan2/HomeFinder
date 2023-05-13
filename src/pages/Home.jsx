import React, { useEffect, useState } from 'react'
import  Slider  from '../components/Slider'
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore'
import { db } from '../firebase'
import { Link } from 'react-router-dom'
import ListingItem from '../components/ListingItem'

const Home = () => {
  // offers
  const [offersListing, setOffersListing] = useState(null)
  useEffect(() => {
    async function fetchOffers() {
      // get reference to the offers collection
      const listingRef = collection(db, 'listings')
      // query to get the latest 4 offers
      const q = query(listingRef, where('offer', '==', true),
      orderBy('timeStamp', 'desc'),      
      limit(4))
      // querySnapshot is an array of documents in the collection that satisfy the condition of the query.
      const querySnapshot = await getDocs(q)
      let offers = []
      querySnapshot.forEach((doc) => {
        return offers.push({
          id: doc.id,
          data: doc.data(),
        })
      })
      setOffersListing(offers)
    }
    fetchOffers()
  }, [])
  // plcaes for Rent
  const [rentListing, setRentListing] = useState(null)
  useEffect(() => {
    async function fetchOffers() {
      // get reference to the offers collection
      const listingRef = collection(db, 'listings')
      // query to get the latest 4 offers
      const q = query(listingRef, where('type', '==', "rent"),
      orderBy('timeStamp', 'desc'),      
      limit(4))
      // querySnapshot is an array of documents in the collection that satisfy the condition of the query.
      const querySnapshot = await getDocs(q)
      let listing = []
      querySnapshot.forEach((doc) => {
        return listing.push({
          id: doc.id,
          data: doc.data(),
        })
      })
      setRentListing(listing)
    }
    fetchOffers()
  }, [])
  // plcaes for sale
  const [saleListing, setSaleListing] = useState(null)
  useEffect(() => {
    async function fetchOffers() {
      // get reference to the offers collection
      const listingRef = collection(db, 'listings')
      // query to get the latest 4 offers
      const q = query(listingRef, where('type', '==', "sale"),
      orderBy('timeStamp', 'desc'),      
      limit(4))
      // querySnapshot is an array of documents in the collection that satisfy the condition of the query.
      const querySnapshot = await getDocs(q)
      let listing = []
      querySnapshot.forEach((doc) => {
        return listing.push({
          id: doc.id,
          data: doc.data(),
        })
      })
      setSaleListing(listing)
    }
    fetchOffers()
  }, [])


  return (
    <div>
      <Slider />
      <div className='max-w-6xl pt-4 mx-auto space-y-6'>
        {
          offersListing && offersListing.length > 0 && (
            <div className='m-2 mb-6 '>
              <h2 className='px-3 mt-6 text-2xl font-semibold'> Recent Offers</h2>
              <Link to='/offers' className='px-3 text-sm text-blue-500 transition ease-in-out hover:text-blue-700'>
                <p>Show more offers</p>
              </Link>
              <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {
                  offersListing.map((listing) => (
                    <ListingItem key={listing.id} listing={listing.data}  id={listing.id
                    }/>
                  ))
                }
              </ul>

            </div>
          )
        }
        {
          rentListing && rentListing.length > 0 && (
            <div className='m-2 mb-6 '>
              <h2 className='px-3 mt-6 text-2xl font-semibold'>Places for Rent </h2>
              <Link to='/category/rent' className='px-3 text-sm text-blue-500 transition ease-in-out hover:text-blue-700'>
                <p>Show more places for rent</p>
              </Link>
              <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {
                  rentListing.map((listing) => (
                    <ListingItem key={listing.id} listing={listing.data}  id={listing.id
                    }/>
                  ))
                }
              </ul>

            </div>
          )
        }
        {
          saleListing && saleListing.length > 0 && (
            <div className='m-2 mb-6 '>
              <h2 className='px-3 mt-6 text-2xl font-semibold'>Places for Sale </h2>
              <Link to='/category/sale' className='px-3 text-sm text-blue-500 transition ease-in-out hover:text-blue-700'>
                <p>Show more places for sale</p>
              </Link>
              <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {
                  saleListing.map((listing) => (
                    <ListingItem key={listing.id} listing={listing.data}  id={listing.id
                    }/>
                  ))
                }
              </ul>

            </div>
          )
        }
      </div>
    </div>
  )
}

export default Home
