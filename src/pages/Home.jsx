import { useEffect, useState } from 'react'
import Slider from '../components/Slider'
import { Link } from 'react-router-dom'
import ListingItem from '../components/ListingItem'
import { FaHome } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useSavedListings } from '../hooks/useSavedListings'
import api from '../utils/api'

const slideIn = { visible: { opacity: 1, x: 0 }, hidden: { opacity: 0, x: -60 } }

const Section = ({ title, to, label, listings, motionRef, inView, savedIds, toggleSave }) => (
  <div className="m-2 mb-4" ref={motionRef}>
    <motion.h2
      className="px-3 mt-6 text-2xl font-semibold text-content-primary dark:text-white"
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={slideIn}
      transition={{ duration: 0.6 }}
    >
      {title}
    </motion.h2>
    <Link to={to}>
      <p className="px-3 text-sm text-primary hover:text-primary-hover transition-colors animate-pulse">{label}</p>
    </Link>
    <motion.ul
      className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={slideIn}
      transition={{ duration: 0.6 }}
    >
      {listings.map((listing) => (
        <ListingItem key={listing.id} listing={listing.data} id={listing.id} savedIds={savedIds} toggleSave={toggleSave} />
      ))}
    </motion.ul>
  </div>
)

const Home = () => {
  const [offersListing, setOffersListing] = useState(null)
  const [rentListing, setRentListing] = useState(null)
  const [saleListing, setSaleListing] = useState(null)
  const { savedIds, toggleSave } = useSavedListings()
  const [refRent, inViewRent] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [refSale, inViewSale] = useInView({ triggerOnce: true, threshold: 0.1 })

  function normalize(listings) {
    return listings.map((l) => ({ id: l._id, data: l }))
  }

  useEffect(() => {
    api.get('/listings', { params: { offer: true, limit: 4 } })
      .then((r) => setOffersListing(normalize(r.data.listings)))
      .catch(() => {})
  }, [])

  useEffect(() => {
    api.get('/listings', { params: { type: 'rent', limit: 4 } })
      .then((r) => setRentListing(normalize(r.data.listings)))
      .catch(() => {})
  }, [])

  useEffect(() => {
    api.get('/listings', { params: { type: 'sale', limit: 4 } })
      .then((r) => setSaleListing(normalize(r.data.listings)))
      .catch(() => {})
  }, [])

  return (
    <div>
      <Slider />
      <div className="max-w-6xl pt-4 mx-auto space-y-6 pb-10">
        {offersListing && offersListing.length > 0 && (
          <div className="m-2 mb-4">
            <Link to="/create-listing">
              <button className="flex items-center mt-4 ml-3 bg-primary hover:bg-primary-hover text-white font-semibold text-sm px-5 py-2.5 rounded-lg shadow-md transition duration-150">
                <FaHome className="mr-2 text-xl" /> Sell or rent your property
              </button>
            </Link>
            <motion.h2
              className="px-3 mt-6 text-2xl font-semibold text-content-primary dark:text-white"
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              Recent Offers
            </motion.h2>
            <Link to="/offers">
              <p className="px-3 text-sm text-primary hover:text-primary-hover transition-colors animate-pulse">Show more offers</p>
            </Link>
            <motion.ul
              className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              {offersListing.map((listing) => (
                <ListingItem key={listing.id} listing={listing.data} id={listing.id} savedIds={savedIds} toggleSave={toggleSave} />
              ))}
            </motion.ul>
          </div>
        )}

        {rentListing && rentListing.length > 0 && (
          <Section
            title="Places for Rent"
            to="/category/rent"
            label="Show more places for rent"
            listings={rentListing}
            motionRef={refRent}
            inView={inViewRent}
            savedIds={savedIds}
            toggleSave={toggleSave}
          />
        )}

        {saleListing && saleListing.length > 0 && (
          <Section
            title="Places for Sale"
            to="/category/sale"
            label="Show more places for sale"
            listings={saleListing}
            motionRef={refSale}
            inView={inViewSale}
            savedIds={savedIds}
            toggleSave={toggleSave}
          />
        )}
      </div>
    </div>
  )
}

export default Home
