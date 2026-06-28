import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaHome } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import ListingItem from '../components/ListingItem'
import Spinner from '../components/Spinner'

const INPUT_CLASS = "w-full px-4 py-2 mb-6 text-xl text-content-primary dark:text-white bg-surface dark:bg-dark-surface border border-surface-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition ease-in-out"

const Profile = () => {
  const navigate = useNavigate()
  const { user, logout, updateProfile } = useAuth()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)
  const [nextCursor, setNextCursor] = useState(null)
  const [loadingMore, setLoadingMore] = useState(false)
  const [changeDetails, setChangeDetails] = useState(false)
  const [formdata, setFormdata] = useState({ name: user?.name || '', email: user?.email || '' })

  useEffect(() => {
    fetchListings()
  }, [])

  async function fetchListings(cursor = null) {
    try {
      const params = { limit: 8 }
      if (cursor) params.cursor = cursor
      const res = await api.get('/listings/mine', { params })
      const normalized = res.data.listings.map((l) => ({ id: l._id, data: l }))
      setListings((prev) => cursor ? [...prev, ...normalized] : normalized)
      setHasMore(res.data.hasMore)
      setNextCursor(res.data.nextCursor)
    } catch {
      toast.error('Could not load listings')
    }
    setLoading(false)
    setLoadingMore(false)
  }

  async function loadMore() {
    if (!nextCursor) return
    setLoadingMore(true)
    await fetchListings(nextCursor)
  }

  async function onLogOut() {
    await logout()
    navigate('/sign-in')
  }

  function onchange(e) {
    setFormdata((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  async function onSubmit() {
    if (formdata.name === user.name) {
      toast.error('Name is the same as before')
      return
    }
    try {
      await updateProfile({ name: formdata.name })
      toast.success('Name updated successfully')
    } catch {
      toast.error('Could not update profile')
    }
  }

  async function onDelete(id) {
    if (!window.confirm('Are you sure you want to delete this listing?')) return
    try {
      await api.delete(`/listings/${id}`)
      setListings((prev) => prev.filter((l) => l.id !== id))
      toast.success('Listing deleted')
    } catch {
      toast.error('Could not delete listing')
    }
  }

  return (
    <>
      <section className="flex flex-col items-center justify-center max-w-6xl mx-auto">
        <motion.h1
          className="mt-6 text-3xl font-bold text-center text-content-primary dark:text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          My Profile
        </motion.h1>

        <div className="w-full md:w-[50%] mt-6 px-3">
          <form>
            <input
              type="text"
              id="name"
              value={formdata.name}
              disabled={!changeDetails}
              onChange={onchange}
              className={`${INPUT_CLASS} ${changeDetails ? 'bg-primary-light dark:bg-dark-surface' : ''}`}
            />
            <input
              type="email"
              id="email"
              value={formdata.email}
              disabled
              className={INPUT_CLASS}
            />

            <div className="flex justify-between text-sm whitespace-nowrap sm:text-lg">
              <p className="flex items-center text-content-secondary dark:text-content-muted">
                Do you want to change your name?
                <span
                  onClick={() => { changeDetails && onSubmit(); setChangeDetails(!changeDetails) }}
                  className="ml-1 text-primary cursor-pointer hover:text-primary-hover transition duration-200"
                >
                  {changeDetails ? 'Apply change' : 'Edit'}
                </span>
              </p>
              <p onClick={onLogOut} className="text-primary cursor-pointer hover:text-primary-hover transition duration-150">
                Log out
              </p>
            </div>
          </form>

          <Link to="/create-listing">
            <button className="flex items-center justify-center w-full py-3 mt-4 text-sm font-semibold text-white uppercase bg-primary hover:bg-primary-hover rounded-lg shadow-md transition duration-150">
              <FaHome className="p-1 mr-2 text-3xl border-2 rounded-full" />
              Sell or Rent Your Property
            </button>
          </Link>
        </div>
      </section>

      <div className="px-3 mx-auto mt-6 max-w-6xl pb-10">
        {loading ? (
          <Spinner />
        ) : listings.length > 0 ? (
          <>
            <h2 className="mb-6 text-2xl font-semibold text-center text-content-primary dark:text-white">My Listings</h2>
            <ul className="gap-2 mt-6 mb-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => navigate(`/edit-listing/${listing.id}`)}
                />
              ))}
            </ul>
            {hasMore && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="bg-primary hover:bg-primary-hover text-white font-semibold px-8 py-2.5 rounded-lg shadow-md transition duration-150 disabled:opacity-60"
                >
                  {loadingMore ? 'Loading…' : 'Load more'}
                </button>
              </div>
            )}
          </>
        ) : null}
      </div>
    </>
  )
}

export default Profile
