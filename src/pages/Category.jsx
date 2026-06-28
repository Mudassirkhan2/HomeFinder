import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'
import { useSavedListings } from '../hooks/useSavedListings'
import api from '../utils/api'

const Category = () => {
  const params = useParams()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)
  const [nextCursor, setNextCursor] = useState(null)
  const [loadingMore, setLoadingMore] = useState(false)
  const { savedIds, toggleSave } = useSavedListings()

  useEffect(() => {
    setListings([])
    setNextCursor(null)
    fetchListings()
  }, [params.categoryName])

  async function fetchListings(cursor = null) {
    try {
      const params2 = { type: params.categoryName, limit: 8 }
      if (cursor) params2.cursor = cursor
      const res = await api.get('/listings', { params: params2 })
      const normalized = res.data.listings.map((l) => ({ id: l._id, data: l }))
      setListings((prev) => cursor ? [...prev, ...normalized] : normalized)
      setHasMore(res.data.hasMore)
      setNextCursor(res.data.nextCursor)
    } catch {
      toast.error('Error loading listings')
    }
    setLoading(false)
    setLoadingMore(false)
  }

  async function loadMore() {
    if (!nextCursor) return
    setLoadingMore(true)
    await fetchListings(nextCursor)
  }

  const title = params.categoryName === 'rent' ? 'Places for Rent' : 'Places for Sale'

  return (
    <div className="max-w-6xl px-3 mx-auto py-6">
      <motion.h1
        className="mb-6 text-3xl font-bold text-center text-content-primary dark:text-white"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {title}
      </motion.h1>

      {loading ? (
        <Spinner />
      ) : listings.length > 0 ? (
        <>
          <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {listings.map((listing) => (
              <ListingItem key={listing.id} listing={listing.data} id={listing.id} savedIds={savedIds} toggleSave={toggleSave} />
            ))}
          </ul>
          {hasMore && (
            <div className="flex items-center justify-center mt-8">
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
      ) : (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🏠</p>
          <p className="text-xl font-semibold text-content-primary dark:text-white">No {title.toLowerCase()} right now</p>
        </div>
      )}
    </div>
  )
}

export default Category
