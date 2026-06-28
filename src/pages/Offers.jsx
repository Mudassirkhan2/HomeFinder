import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import ListingItem from '../components/ListingItem'
import { ListingCardSkeleton } from '../components/ListingCardSkeleton'
import { useSavedListings } from '../hooks/useSavedListings'
import api from '../utils/api'

const Offers = () => {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)
  const [nextCursor, setNextCursor] = useState(null)
  const [loadingMore, setLoadingMore] = useState(false)
  const { savedIds, toggleSave } = useSavedListings()
  const { ref: sentinelRef, inView } = useInView({ threshold: 0 })

  useEffect(() => { fetchListings() }, [])

  useEffect(() => {
    if (inView && hasMore && !loadingMore) {
      setLoadingMore(true)
      fetchListings(nextCursor)
    }
  }, [inView, hasMore, loadingMore])

  async function fetchListings(cursor = null) {
    try {
      const params = { offer: true, limit: 8 }
      if (cursor) params.cursor = cursor
      const res = await api.get('/listings', { params })
      const normalized = res.data.listings.map((l) => ({ id: l._id, data: l }))
      setListings((prev) => cursor ? [...prev, ...normalized] : normalized)
      setHasMore(res.data.hasMore)
      setNextCursor(res.data.nextCursor)
    } catch {
      toast.error('Error loading offers')
    }
    setLoading(false)
    setLoadingMore(false)
  }

  return (
    <div className="max-w-6xl px-3 mx-auto py-6">
      <motion.h1
        className="mb-6 text-3xl font-bold text-center text-content-primary dark:text-white"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Latest Offers
      </motion.h1>

      {loading ? (
        <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <ListingCardSkeleton key={i} />)}
        </ul>
      ) : listings.length > 0 ? (
        <>
          <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {listings.map((listing) => (
              <ListingItem key={listing.id} listing={listing.data} id={listing.id} savedIds={savedIds} toggleSave={toggleSave} />
            ))}
          </ul>
          <div ref={sentinelRef} className="h-4" />
          {loadingMore && (
            <div className="flex justify-center gap-1.5 py-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce" />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🏷️</p>
          <p className="text-xl font-semibold text-content-primary dark:text-white">No offers available right now</p>
        </div>
      )}
    </div>
  )
}

export default Offers
