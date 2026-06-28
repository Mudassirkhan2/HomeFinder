import { useEffect, useState } from 'react'
import { FaStar, FaRegStar } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
function relativeTime(date) {
  const diff = (date - Date.now()) / 1000
  if (Math.abs(diff) < 60) return rtf.format(Math.round(diff), 'second')
  if (Math.abs(diff) < 3600) return rtf.format(Math.round(diff / 60), 'minute')
  if (Math.abs(diff) < 86400) return rtf.format(Math.round(diff / 3600), 'hour')
  if (Math.abs(diff) < 2592000) return rtf.format(Math.round(diff / 86400), 'day')
  if (Math.abs(diff) < 31536000) return rtf.format(Math.round(diff / 2592000), 'month')
  return rtf.format(Math.round(diff / 31536000), 'year')
}

const StarPicker = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button key={star} type="button" onClick={() => onChange(star)} className="text-2xl transition-transform hover:scale-110 focus:outline-none" aria-label={`${star} star`}>
        {star <= value ? <FaStar className="text-yellow-400" /> : <FaRegStar className="text-surface-border dark:text-dark-border" />}
      </button>
    ))}
  </div>
)

const StarDisplay = ({ rating, size = 'sm' }) => {
  const cls = size === 'lg' ? 'text-xl' : 'text-sm'
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) =>
        s <= Math.round(rating)
          ? <FaStar key={s} className={`${cls} text-yellow-400`} />
          : <FaRegStar key={s} className={`${cls} text-surface-border dark:text-dark-border`} />
      )}
    </span>
  )
}

const ReviewSection = ({ listingId }) => {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [myReview, setMyReview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)
  const [nextCursor, setNextCursor] = useState(null)
  const [loadingMore, setLoadingMore] = useState(false)
  const [myRating, setMyRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { fetchReviews() }, [listingId])

  async function fetchReviews(cursor = null) {
    try {
      const params = { limit: 10 }
      if (cursor) params.cursor = cursor
      const res = await api.get(`/listings/${listingId}/reviews`, { params })
      setReviews((prev) => cursor ? [...prev, ...res.data.reviews] : res.data.reviews)
      setHasMore(res.data.hasMore)
      setNextCursor(res.data.nextCursor)
      if (!cursor) setMyReview(res.data.myReview || null)
    } catch {}
    setLoading(false)
    setLoadingMore(false)
  }

  async function submitReview(e) {
    e.preventDefault()
    if (!myRating) { toast.error('Please select a star rating'); return }
    if (!comment.trim()) { toast.error('Please write a comment'); return }
    setSubmitting(true)
    try {
      const res = await api.post(`/listings/${listingId}/reviews`, { rating: myRating, comment })
      toast.success('Review submitted!')
      setMyRating(0)
      setComment('')
      setMyReview(res.data.review)
      await fetchReviews()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review')
    }
    setSubmitting(false)
  }

  async function loadMore() {
    if (!nextCursor) return
    setLoadingMore(true)
    await fetchReviews(nextCursor)
  }

  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({ star, count: reviews.filter((r) => r.rating === star).length }))

  return (
    <div className="mt-4">
      <div className="bg-surface dark:bg-dark-surface rounded-2xl shadow-lg p-6">
        <h2 className="text-lg font-bold text-content-primary dark:text-white mb-5">Reviews & Ratings</h2>

        {reviews.length > 0 && (
          <div className="flex gap-8 items-start mb-6 pb-6 border-b border-surface-border dark:border-dark-border">
            <div className="text-center flex-shrink-0">
              <p className="text-5xl font-extrabold text-content-primary dark:text-white">{avgRating.toFixed(1)}</p>
              <StarDisplay rating={avgRating} size="lg" />
              <p className="text-xs text-content-muted mt-1">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="flex-1 space-y-1.5">
              {ratingCounts.map(({ star, count }) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-content-muted w-3">{star}</span>
                  <FaStar className="text-yellow-400 text-xs flex-shrink-0" />
                  <div className="flex-1 bg-surface-secondary dark:bg-dark-bg rounded-full h-1.5 overflow-hidden">
                    <div className="bg-yellow-400 h-full rounded-full transition-all duration-500" style={{ width: reviews.length ? `${(count / reviews.length) * 100}%` : '0%' }} />
                  </div>
                  <span className="text-xs text-content-muted w-4 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {user && !myReview && (
          <form onSubmit={submitReview} className="mb-6 pb-6 border-b border-surface-border dark:border-dark-border">
            <h3 className="text-sm font-semibold text-content-primary dark:text-white mb-3">Write a Review</h3>
            <StarPicker value={myRating} onChange={setMyRating} />
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this property…"
              rows={3}
              className="mt-3 w-full border border-surface-border dark:border-dark-border rounded-xl px-4 py-2.5 text-sm text-content-primary dark:text-white bg-surface dark:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none transition-shadow"
            />
            <button type="submit" disabled={submitting} className="mt-2 bg-primary hover:bg-primary-hover text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-150 disabled:opacity-50">
              {submitting ? 'Submitting…' : 'Submit Review'}
            </button>
          </form>
        )}

        {user && myReview && (
          <p className="text-sm text-content-muted mb-6 pb-6 border-b border-surface-border dark:border-dark-border">
            You've already reviewed this property.
          </p>
        )}

        {!user && (
          <p className="text-sm text-content-muted mb-6 pb-6 border-b border-surface-border dark:border-dark-border">
            <a href="/sign-in" className="text-primary font-semibold hover:underline">Sign in</a> to leave a review.
          </p>
        )}

        {loading ? (
          <p className="text-sm text-content-muted">Loading reviews…</p>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-content-muted">No reviews yet. Be the first!</p>
        ) : (
          <AnimatePresence>
            <ul className="space-y-5">
              {reviews.map((review) => (
                <motion.li key={review._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex gap-3">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary-light dark:bg-dark-bg flex items-center justify-center text-primary font-bold text-sm uppercase">
                    {review.userName?.[0] ?? '?'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-content-primary dark:text-white">{review.userName}</span>
                      <StarDisplay rating={review.rating} />
                      {review.createdAt && (
                        <span className="text-xs text-content-muted">{relativeTime(new Date(review.createdAt))}</span>
                      )}
                    </div>
                    <p className="text-sm text-content-secondary dark:text-content-muted mt-1 leading-relaxed">{review.comment}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
            {hasMore && (
              <div className="flex justify-center mt-5">
                <button onClick={loadMore} disabled={loadingMore} className="text-sm text-primary hover:text-primary-hover font-semibold transition disabled:opacity-50">
                  {loadingMore ? 'Loading…' : 'Load more reviews'}
                </button>
              </div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

export default ReviewSection
