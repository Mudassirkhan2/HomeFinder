import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaHeart } from 'react-icons/fa'
import ListingItem from '../components/ListingItem'
import Spinner from '../components/Spinner'
import { useSavedListings } from '../hooks/useSavedListings'
import api from '../utils/api'

const Saved = () => {
  const { savedIds, toggleSave } = useSavedListings()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)
  const [nextCursor, setNextCursor] = useState(null)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => { fetchSaved() }, [])

  async function fetchSaved(cursor = null) {
    try {
      const params = { full: true, limit: 12 }
      if (cursor) params.cursor = cursor
      const res = await api.get('/saved', { params })
      const normalized = res.data.listings.map((l) => ({ id: l._id, data: l }))
      setListings((prev) => cursor ? [...prev, ...normalized] : normalized)
      setHasMore(res.data.hasMore)
      setNextCursor(res.data.nextCursor)
    } catch {}
    setLoading(false)
    setLoadingMore(false)
  }

  async function loadMore() {
    if (!nextCursor) return
    setLoadingMore(true)
    await fetchSaved(nextCursor)
  }

  if (loading) return <Spinner />

  return (
    <div className="max-w-6xl mx-auto px-3 py-6">
      <motion.div className="mb-6 text-center" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold text-content-primary dark:text-white flex items-center justify-center gap-2">
          <FaHeart className="text-primary" /> Saved Properties
        </h1>
        {listings.length > 0 && (
          <p className="text-sm text-content-muted mt-1">{listings.length} saved propert{listings.length === 1 ? 'y' : 'ies'}</p>
        )}
      </motion.div>

      {listings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FaHeart className="text-5xl text-surface-border dark:text-dark-border mb-4" />
          <p className="text-xl font-semibold text-content-primary dark:text-white">No saved properties yet</p>
          <p className="text-content-muted mt-2">Tap the heart icon on any listing to save it here</p>
          <Link to="/" className="mt-6 bg-primary hover:bg-primary-hover text-white font-semibold px-6 py-2 rounded-lg transition-colors">Browse properties</Link>
        </div>
      ) : (
        <>
          <motion.ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            {listings.map((listing) => (
              <ListingItem key={listing.id} id={listing.id} listing={listing.data} savedIds={savedIds} toggleSave={toggleSave} />
            ))}
          </motion.ul>
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button onClick={loadMore} disabled={loadingMore} className="bg-primary hover:bg-primary-hover text-white font-semibold px-8 py-2.5 rounded-lg shadow-md transition duration-150 disabled:opacity-60">
                {loadingMore ? 'Loading…' : 'Load more'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Saved
