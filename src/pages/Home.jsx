import React, { useEffect, useState } from 'react'
import  Slider  from '../components/Slider'
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore'
import { db } from '../firebase'
import { Link } from 'react-router-dom'
import ListingItem from '../components/ListingItem'
import { FaHome } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer';
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
  // plcaes for rent
  const [ref, inView] = useInView({
    triggerOnce: true, // Animation triggers only once
    threshold: 0.1, // Trigger animation when 10% of the element is visible
  });
  // for Sale
    const [targetref, inView1] = useInView({
      triggerOnce: true, // Animation triggers only once
      threshold: 0.1, // Trigger animation when 10% of the element is visible
    });


    const animationVariants = {
      visible: { opacity: 1, x: 0 },
      hidden: { opacity: 0, x: -100 },
    };

  return (
    <div>
      <Slider />
      <div className='max-w-6xl pt-4 mx-auto space-y-6'>
        {
          offersListing && offersListing.length > 0 && (
            <div className='m-2 mb-4 '>
          <button type="submit" className='py-3 mt-4 ml-3 text-sm font-medium text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded shadow-md px-7 hover:bg-blue-800 hover:shadow-lg' >
            <Link to="/create-listing " className='flex items-center justify-center '>
              <FaHome className='p-1 mr-2 text-3xl border-2 rounded-full animate-pulse' />
              Sell or rent your property
            </Link>
          </button>
              <motion.h2 className='px-3 mt-6 text-2xl font-semibold dark:text-teal-400'
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9 }}
              > Recent Offers</motion.h2>
              <Link to='/offers' >
                <p className='px-3 text-sm text-blue-600 transition ease-in-out text-start hover:text-blue-700 animate-pulse'>Show more offers</p>
              </Link>
              <motion.ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9 }} >
                {
                  offersListing.map((listing) => (
                    <ListingItem key={listing.id} listing={listing.data}  id={listing.id
                    }/>
                  ))
                }
              </motion.ul>

            </div>
          )
        }
        {
          rentListing && rentListing.length > 0 && (
            <div className='m-2 mb-4 ' ref={ref}>
              <motion.h2 className='px-3 mt-6 text-2xl font-semibold dark:text-teal-400' initial="hidden"
                  animate={inView ? 'visible' : 'hidden'}
                  variants={animationVariants}
                  transition={{ duration: 0.8 }}>Places for Rent </motion.h2>
              <Link to='/category/rent' >
                <p className='px-3 text-sm text-blue-600 transition ease-in-out hover:text-blue-700 animate-pulse'>Show more places for rent</p>
              </Link>
              <motion.ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' initial="hidden"
                  animate={inView ? 'visible' : 'hidden'}
                  variants={animationVariants}
                  transition={{ duration: 0.8 }}>
                {
                  rentListing.map((listing) => (
                    <ListingItem key={listing.id} listing={listing.data}  id={listing.id
                    }/>
                  ))
                }
              </motion.ul>

            </div>
          )
        }
        {
          saleListing && saleListing.length > 0 && (
            <div className='m-2 mb-4 ' ref={targetref} >
              <motion.h2 className='px-3 mt-6 text-2xl font-semibold dark:text-teal-400' initial="hidden"
                  animate={inView1 ? 'visible' : 'hidden'}
                  variants={animationVariants}
                  transition={{ duration: 0.8 }}>Places for Sale </motion.h2>
              <Link to='/category/sale' >
                <p className='px-3 text-sm text-blue-600 transition duration-300 ease-in-out hover:text-blue-700 animate-pulse'>Show more places for sale</p>
              </Link>
              <motion.ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' initial="hidden"
                  animate={inView1 ? 'visible' : 'hidden'}
                  variants={animationVariants}
                  transition={{ duration: 0.8 }} >
                {
                  saleListing.map((listing) => (
                    <ListingItem key={listing.id} listing={listing.data}  id={listing.id
                    }/>
                  ))
                }
              </motion.ul>

            </div>
          )
        }
      </div>
    </div>
  )
}

export default Home
