import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaFilter, FaTimes } from 'react-icons/fa'
import { useInView } from 'react-intersection-observer'
import ListingItem from '../components/ListingItem'
import { ListingCardSkeleton } from '../components/ListingCardSkeleton'
import { useSavedListings } from '../hooks/useSavedListings'
import api from '../utils/api'

const PROPERTY_TYPES = ['house', 'apartment', 'villa', 'plot', 'pg']
const DEFAULT_FILTERS = { listingType: '', minPrice: '', maxPrice: '', minBeds: '', furnished: '', propertyTypes: [] }

const Search = () => {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''

  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)
  const [nextCursor, setNextCursor] = useState(null)
  const [loadingMore, setLoadingMore] = useState(false)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [showFilters, setShowFilters] = useState(false)
  const { savedIds, toggleSave } = useSavedListings()
  const { ref: sentinelRef, inView } = useInView({ threshold: 0 })

  const buildParams = useCallback((cursor = null) => {
    const params = { limit: 12 }
    if (q) params.q = q
    if (filters.listingType) params.type = filters.listingType
    if (filters.minPrice) params.minPrice = filters.minPrice
    if (filters.maxPrice) params.maxPrice = filters.maxPrice
    if (filters.minBeds) params.minBeds = filters.minBeds
    if (filters.furnished !== '') params.furnished = filters.furnished
    if (filters.propertyTypes.length === 1) params.propertyType = filters.propertyTypes[0]
    if (cursor) params.cursor = cursor
    return params
  }, [q, filters])

  useEffect(() => {
    setListings([])
    setNextCursor(null)
    setLoading(true)
    const endpoint = q ? '/listings/search' : '/listings'
    api.get(endpoint, { params: buildParams() })
      .then((res) => {
        setListings(res.data.listings.map((l) => ({ id: l._id, data: l })))
        setHasMore(res.data.hasMore)
        setNextCursor(res.data.nextCursor)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [q, filters])

  useEffect(() => {
    if (inView && hasMore && !loadingMore) {
      setLoadingMore(true)
      const endpoint = q ? '/listings/search' : '/listings'
      api.get(endpoint, { params: buildParams(nextCursor) })
        .then((res) => {
          setListings((prev) => [...prev, ...res.data.listings.map((l) => ({ id: l._id, data: l }))])
          setHasMore(res.data.hasMore)
          setNextCursor(res.data.nextCursor)
        })
        .catch(() => {})
        .finally(() => setLoadingMore(false))
    }
  }, [inView, hasMore, loadingMore])

  function togglePropertyType(pt) {
    setFilters((prev) => {
      const next = prev.propertyTypes.includes(pt) ? prev.propertyTypes.filter((x) => x !== pt) : [...prev.propertyTypes, pt]
      return { ...prev, propertyTypes: next }
    })
  }

  function resetFilters() { setFilters(DEFAULT_FILTERS) }

  const FilterPanel = () => (
    <aside className="bg-surface dark:bg-dark-surface border border-surface-border dark:border-dark-border rounded-xl p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-content-primary dark:text-white">Filters</h2>
        <button onClick={resetFilters} className="text-xs text-primary hover:text-primary-hover transition-colors">Reset all</button>
      </div>

      <div>
        <p className="text-xs font-semibold text-content-muted uppercase mb-2">Listing type</p>
        <div className="flex gap-2">
          {[['', 'All'], ['rent', 'Rent'], ['sale', 'Sale']].map(([val, label]) => (
            <button key={val} onClick={() => setFilters((p) => ({ ...p, listingType: val }))}
              className={`flex-1 py-1.5 text-sm rounded-lg border font-semibold transition-colors ${filters.listingType === val ? 'bg-primary text-white border-primary' : 'border-surface-border dark:border-dark-border text-content-secondary dark:text-content-muted hover:bg-surface-secondary dark:hover:bg-dark-bg'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-content-muted uppercase mb-2">Price range (₹)</p>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => setFilters((p) => ({ ...p, minPrice: e.target.value }))} className="w-full border border-surface-border dark:border-dark-border rounded-lg px-3 py-1.5 text-sm text-content-primary dark:text-white bg-surface dark:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-primary" />
          <input type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => setFilters((p) => ({ ...p, maxPrice: e.target.value }))} className="w-full border border-surface-border dark:border-dark-border rounded-lg px-3 py-1.5 text-sm text-content-primary dark:text-white bg-surface dark:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-content-muted uppercase mb-2">Min bedrooms</p>
        <input type="number" placeholder="Any" min="1" value={filters.minBeds} onChange={(e) => setFilters((p) => ({ ...p, minBeds: e.target.value }))} className="w-full border border-surface-border dark:border-dark-border rounded-lg px-3 py-1.5 text-sm text-content-primary dark:text-white bg-surface dark:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>

      <div>
        <p className="text-xs font-semibold text-content-muted uppercase mb-2">Furnished</p>
        <div className="flex gap-2">
          {[['', 'Any'], ['true', 'Yes'], ['false', 'No']].map(([val, label]) => (
            <button key={val} onClick={() => setFilters((p) => ({ ...p, furnished: val }))}
              className={`flex-1 py-1.5 text-sm rounded-lg border font-semibold transition-colors ${filters.furnished === val ? 'bg-primary text-white border-primary' : 'border-surface-border dark:border-dark-border text-content-secondary dark:text-content-muted hover:bg-surface-secondary dark:hover:bg-dark-bg'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-content-muted uppercase mb-2">Property type</p>
        <div className="flex flex-wrap gap-2">
          {PROPERTY_TYPES.map((pt) => (
            <button key={pt} onClick={() => togglePropertyType(pt)}
              className={`px-3 py-1.5 text-xs rounded-full border font-semibold transition-colors ${filters.propertyTypes.includes(pt) ? 'bg-primary text-white border-primary' : 'border-surface-border dark:border-dark-border text-content-secondary dark:text-content-muted hover:bg-surface-secondary dark:hover:bg-dark-bg'}`}>
              {pt === 'pg' ? 'PG' : pt.charAt(0).toUpperCase() + pt.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )

  return (
    <div className="max-w-6xl mx-auto px-3 py-6">
      <motion.div className="mb-6" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-bold text-content-primary dark:text-white">{q ? `Results for "${q}"` : 'All Properties'}</h1>
        {!loading && <p className="text-sm text-content-muted mt-1">{listings.length} propert{listings.length === 1 ? 'y' : 'ies'} found</p>}
      </motion.div>

      <div className="flex gap-6">
        <div className="hidden lg:block w-64 flex-shrink-0"><FilterPanel /></div>

        <div className="flex-1 min-w-0">
          <button className="lg:hidden flex items-center gap-2 mb-4 px-4 py-2 border border-surface-border dark:border-dark-border rounded-lg text-sm font-semibold text-content-secondary dark:text-content-muted hover:bg-surface-secondary dark:hover:bg-dark-surface transition-colors" onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? <FaTimes /> : <FaFilter />}{showFilters ? 'Hide filters' : 'Show filters'}
          </button>
          {showFilters && <div className="lg:hidden mb-4"><FilterPanel /></div>}

          {loading ? (
            <motion.ul className="sm:grid sm:grid-cols-2 xl:grid-cols-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              {Array.from({ length: 12 }).map((_, i) => <ListingCardSkeleton key={i} />)}
            </motion.ul>
          ) : listings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-4xl mb-4">🏠</p>
              <p className="text-xl font-semibold text-content-primary dark:text-white">No properties found</p>
              <p className="text-content-muted mt-2">Try adjusting your search or filters</p>
              <button onClick={resetFilters} className="mt-4 text-primary hover:text-primary-hover font-semibold transition-colors">Reset filters</button>
            </div>
          ) : (
            <>
              <motion.ul className="sm:grid sm:grid-cols-2 xl:grid-cols-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                {listings.map((listing) => (
                  <ListingItem key={listing.id} listing={listing.data} id={listing.id} savedIds={savedIds} toggleSave={toggleSave} />
                ))}
              </motion.ul>
              <div ref={sentinelRef} className="h-4" />
              {loadingMore && (
                <div className="flex justify-center gap-1.5 py-6">
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Search
