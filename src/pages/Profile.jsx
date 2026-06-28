import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCheckCircle, FaHome, FaCog, FaTimes, FaKey, FaHeart } from 'react-icons/fa'
import { useInView } from 'react-intersection-observer'
import { useAuth } from '../context/AuthContext'
import { useSavedListings } from '../hooks/useSavedListings'
import api from '../utils/api'
import ListingItem from '../components/ListingItem'
import Spinner from '../components/Spinner'

const Profile = () => {
  const navigate = useNavigate()
  const { user, logout, updateProfile, updatePassword } = useAuth()
  const { savedIds, toggleSave } = useSavedListings()

  const [activeTab, setActiveTab] = useState('listings')
  const [listings, setListings] = useState([])
  const [savedListings, setSavedListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [savedLoading, setSavedLoading] = useState(false)
  const [savedLoaded, setSavedLoaded] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [nextCursor, setNextCursor] = useState(null)
  const [loadingMore, setLoadingMore] = useState(false)
  const { ref: sentinelRef, inView } = useInView({ threshold: 0 })
  const [showSettings, setShowSettings] = useState(false)
  const [editName, setEditName] = useState(user?.name || '')
  const [savingName, setSavingName] = useState(false)
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' })
  const [savingPw, setSavingPw] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  useEffect(() => { fetchListings() }, [])

  useEffect(() => {
    if (inView && hasMore && !loadingMore) {
      setLoadingMore(true)
      fetchListings(nextCursor)
    }
  }, [inView, hasMore, loadingMore])

  async function fetchListings(cursor = null) {
    try {
      const params = { limit: 9 }
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

  async function fetchSaved() {
    if (savedLoaded) return
    setSavedLoading(true)
    try {
      const res = await api.get('/saved', { params: { full: true, limit: 12 } })
      setSavedListings(res.data.listings.map((l) => ({ id: l._id, data: l })))
    } catch {}
    setSavedLoading(false)
    setSavedLoaded(true)
  }

  function handleTabChange(tab) {
    setActiveTab(tab)
    if (tab === 'saved' && !savedLoaded) fetchSaved()
  }

  async function onLogOut() {
    await logout()
    navigate('/sign-in')
  }

  async function saveName() {
    if (editName === user.name) { toast.info('No change'); return }
    setSavingName(true)
    try {
      await updateProfile({ name: editName })
      toast.success('Name updated')
    } catch {
      toast.error('Could not update name')
    }
    setSavingName(false)
  }

  async function savePassword(e) {
    e.preventDefault()
    if (pwForm.next !== pwForm.confirm) { toast.error('Passwords do not match'); return }
    setSavingPw(true)
    try {
      await updatePassword(pwForm.current, pwForm.next)
      toast.success('Password updated')
      setPwForm({ current: '', next: '', confirm: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update password')
    }
    setSavingPw(false)
  }

  function onDelete(id) {
    setConfirmDeleteId(id)
  }

  async function confirmDelete() {
    const id = confirmDeleteId
    setConfirmDeleteId(null)
    try {
      await api.delete(`/listings/${id}`)
      setListings((prev) => prev.filter((l) => l.id !== id))
      toast.success('Listing deleted')
    } catch {
      toast.error('Could not delete listing')
    }
  }

  const ratedListings = listings.filter((l) => l.data.reviewCount > 0)
  const avgRating = ratedListings.length
    ? ratedListings.reduce((s, l) => s + (l.data.avgRating || 0), 0) / ratedListings.length
    : null

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
    : null

  return (
    <div className="min-h-screen bg-surface-secondary dark:bg-dark-bg pb-16">

      {/* ── Delete confirmation modal ── */}
      <AnimatePresence>
        {confirmDeleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onClick={() => setConfirmDeleteId(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="bg-surface dark:bg-dark-surface rounded-2xl shadow-xl p-6 w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-content-primary dark:text-white mb-1">Delete listing?</h3>
              <p className="text-sm text-content-secondary dark:text-slate-400 mb-6">This action cannot be undone.</p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="border border-surface-border text-content-primary hover:bg-surface-secondary dark:border-dark-border dark:text-white dark:hover:bg-dark-bg rounded-lg px-5 py-2 font-semibold transition duration-150"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-5 py-2 font-semibold transition duration-150"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Cover banner ── */}
      <div className="relative h-44 bg-gradient-to-br from-primary via-indigo-500 to-violet-600 overflow-hidden">
        <div className="absolute -top-6 right-20 w-52 h-52 rounded-full bg-white/10" />
        <div className="absolute bottom-2 right-8 w-28 h-28 rounded-full bg-white/10" />
        <div className="absolute top-8 right-48 w-16 h-16 rounded-full bg-white/5" />
      </div>

      <div className="max-w-6xl mx-auto px-4">

        {/* ── Profile header card ── */}
        <motion.div
          className="relative z-10 bg-surface dark:bg-dark-surface rounded-2xl border border-surface-border dark:border-dark-border -mt-6 p-6 shadow-lift mb-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-start gap-5 flex-wrap">
            {/* Avatar */}
            <div className="-mt-16 flex-shrink-0">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-2xl object-cover border-4 border-surface dark:border-dark-surface shadow-md"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-accent flex items-center justify-center text-white text-3xl font-bold border-4 border-surface dark:border-dark-surface shadow-md select-none">
                  {user?.name?.[0]?.toUpperCase() ?? '?'}
                </div>
              )}
            </div>

            {/* User info */}
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-content-primary dark:text-white leading-tight">
                  {user?.name}
                </h1>
                {user?.googleId && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-primary bg-primary-light dark:bg-dark-bg px-2 py-0.5 rounded-full">
                    <FaCheckCircle className="text-xs" /> Verified
                  </span>
                )}
              </div>
              <p className="text-sm text-content-secondary dark:text-content-muted mt-0.5">{user?.email}</p>
              {memberSince && (
                <p className="text-xs text-content-muted mt-0.5">Member since {memberSince}</p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link
                to="/create-listing"
                className="flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-btn hover:shadow-btn-hover transition"
              >
                <FaHome className="text-xs" /> + List a property
              </Link>
              <button
                onClick={() => { setEditName(user?.name || ''); setShowSettings(true) }}
                className="w-10 h-10 rounded-xl border border-surface-border dark:border-dark-border flex items-center justify-center text-content-secondary dark:text-content-muted hover:bg-surface-secondary dark:hover:bg-dark-bg transition"
                title="Account settings"
              >
                <FaCog />
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Stats row ── */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
        >
          <div className="bg-surface dark:bg-dark-surface rounded-2xl border border-surface-border dark:border-dark-border p-5">
            <p className="text-2xl font-bold text-primary">{listings.length}{hasMore ? '+' : ''}</p>
            <p className="text-xs text-content-muted mt-0.5">Active listings</p>
          </div>
          <div className="bg-surface dark:bg-dark-surface rounded-2xl border border-surface-border dark:border-dark-border p-5">
            <p className="text-2xl font-bold text-accent">{savedIds?.size ?? 0}</p>
            <p className="text-xs text-content-muted mt-0.5">Saved homes</p>
          </div>
          <div className="bg-surface dark:bg-dark-surface rounded-2xl border border-surface-border dark:border-dark-border p-5 col-span-2 sm:col-span-1">
            <p className="text-2xl font-bold text-green-500">
              {avgRating != null ? avgRating.toFixed(1) : '—'}
            </p>
            <p className="text-xs text-content-muted mt-0.5">Seller rating</p>
          </div>
        </motion.div>

        {/* ── Tabs ── */}
        <div className="flex border-b border-surface-border dark:border-dark-border mb-5">
          {[
            { key: 'listings', label: 'My Listings', count: listings.length },
            { key: 'saved', label: 'Saved', count: savedIds?.size ?? 0 },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => handleTabChange(key)}
              className={`px-5 py-3 text-sm font-semibold border-b-2 -mb-px transition ${
                activeTab === key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-content-muted hover:text-content-secondary'
              }`}
            >
              {label}
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === key
                  ? 'bg-primary text-white'
                  : 'bg-surface-secondary dark:bg-dark-bg text-content-muted'
              }`}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* ── My Listings tab ── */}
        {activeTab === 'listings' && (
          loading ? <Spinner /> : listings.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <p className="text-content-muted mb-4">You haven't listed any properties yet.</p>
              <Link
                to="/create-listing"
                className="bg-primary hover:bg-primary-hover text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition"
              >
                List your first property
              </Link>
            </div>
          ) : (
            <>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
              <div ref={sentinelRef} className="h-4" />
              {loadingMore && (
                <div className="flex justify-center gap-1.5 py-6">
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                </div>
              )}
            </>
          )
        )}

        {/* ── Saved tab ── */}
        {activeTab === 'saved' && (
          savedLoading ? <Spinner /> : savedListings.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <FaHeart className="text-5xl text-surface-border dark:text-dark-border mb-4" />
              <p className="text-content-muted mb-4">No saved properties yet.</p>
              <Link
                to="/"
                className="bg-primary hover:bg-primary-hover text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition"
              >
                Browse properties
              </Link>
            </div>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {savedListings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                  savedIds={savedIds}
                  toggleSave={toggleSave}
                />
              ))}
            </ul>
          )
        )}
      </div>

      {/* ── Settings slide-over ── */}
      <AnimatePresence>
        {showSettings && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
            />
            <motion.div
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-surface dark:bg-dark-surface shadow-2xl overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-content-primary dark:text-white">Account settings</h2>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-content-muted hover:text-content-primary dark:hover:text-white transition"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>

                {/* Display name */}
                <div className="mb-5">
                  <label className="block text-xs font-bold text-content-muted uppercase tracking-wide mb-2">
                    Display name
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 border border-surface-border dark:border-dark-border rounded-xl px-4 py-2.5 text-sm text-content-primary dark:text-white dark:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                    <button
                      onClick={saveName}
                      disabled={savingName}
                      className="px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl transition disabled:opacity-50"
                    >
                      {savingName ? '…' : 'Save'}
                    </button>
                  </div>
                </div>

                {/* Email (read-only) */}
                <div className="mb-6">
                  <label className="block text-xs font-bold text-content-muted uppercase tracking-wide mb-2">Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full border border-surface-border dark:border-dark-border rounded-xl px-4 py-2.5 text-sm text-content-muted dark:bg-dark-bg opacity-60 cursor-not-allowed"
                  />
                </div>

                {/* Password — only for non-Google accounts */}
                {!user?.googleId && (
                  <form onSubmit={savePassword}>
                    <div className="flex items-center gap-2 mb-3">
                      <FaKey className="text-content-muted text-sm" />
                      <h3 className="text-sm font-bold text-content-primary dark:text-white">Change password</h3>
                    </div>
                    {[
                      { key: 'current', placeholder: 'Current password' },
                      { key: 'next', placeholder: 'New password' },
                      { key: 'confirm', placeholder: 'Confirm new password' },
                    ].map(({ key, placeholder }) => (
                      <input
                        key={key}
                        type="password"
                        placeholder={placeholder}
                        value={pwForm[key]}
                        onChange={(e) => setPwForm((p) => ({ ...p, [key]: e.target.value }))}
                        className="w-full border border-surface-border dark:border-dark-border rounded-xl px-4 py-2.5 text-sm text-content-primary dark:text-white dark:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary mb-3 placeholder:text-content-muted"
                      />
                    ))}
                    <button
                      type="submit"
                      disabled={savingPw}
                      className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl transition disabled:opacity-50 mb-6"
                    >
                      {savingPw ? 'Updating…' : 'Update password'}
                    </button>
                  </form>
                )}

                <button
                  onClick={onLogOut}
                  className="w-full py-2.5 border border-red-200 dark:border-red-900/40 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-semibold rounded-xl transition"
                >
                  Log out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Profile
