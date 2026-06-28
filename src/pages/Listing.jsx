import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import {
  FaMapMarkerAlt, FaBed, FaBath, FaParking, FaChair, FaWhatsapp,
  FaShare, FaTimes, FaChevronLeft, FaChevronRight, FaHeart,
  FaRegHeart, FaStar, FaCheckCircle
} from 'react-icons/fa'
import { MdSquareFoot } from 'react-icons/md'
import { geocodeAddress } from '../utils/geocode'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import ReviewSection from '../components/ReviewSection'
import Spinner from '../components/Spinner'
import api from '../utils/api'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function formatINR(n) {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const Listing = () => {
  const params = useParams()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [coords, setCoords] = useState(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [activeImg, setActiveImg] = useState(0)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function fetchListing() {
      try {
        const res = await api.get(`/listings/${params.listingId}`)
        const data = res.data.listing
        setListing(data)
        if (data.address) {
          const result = await geocodeAddress(data.address)
          if (result) setCoords(result)
        }
      } catch {
        toast.error('Could not load listing')
      }
      setLoading(false)
    }
    fetchListing()
  }, [params.listingId])

  function openLightbox(index) {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }
  function lightboxPrev() {
    setLightboxIndex((i) => (i === 0 ? listing.imgUrls.length - 1 : i - 1))
  }
  function lightboxNext() {
    setLightboxIndex((i) => (i === listing.imgUrls.length - 1 ? 0 : i + 1))
  }

  async function handleShare() {
    if (navigator.share) {
      await navigator.share({ title: listing.name, url: window.location.href })
    } else {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied!')
    }
  }

  if (loading) return <Spinner />
  if (!listing) return (
    <div className="min-h-screen flex items-center justify-center bg-surface-secondary dark:bg-dark-bg">
      <p className="text-content-secondary dark:text-content-muted">Listing not found.</p>
    </div>
  )

  const displayPrice = listing.offer ? listing.discountedprice : listing.regularprice
  const ownerName = listing.owner?.name || listing.ownerName

  return (
    <main className="min-h-screen bg-surface-secondary dark:bg-dark-bg pb-20">
      <div className="max-w-6xl mx-auto px-4 pt-6">

        {/* Page header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-accent text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                For {listing.type === 'rent' ? 'Rent' : 'Sale'}
              </span>
              {listing.propertyType && (
                <span className="border border-primary text-primary text-xs font-semibold px-3 py-1 rounded-full capitalize">
                  {listing.propertyType}
                </span>
              )}
              {listing.offer && (
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                  ₹{(+listing.regularprice - +listing.discountedprice).toLocaleString('en-IN')} off
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-content-primary dark:text-white leading-tight">
              {listing.name}
            </h1>
            <p className="flex items-center gap-1.5 text-content-secondary dark:text-content-muted mt-2 text-sm">
              <FaMapMarkerAlt className="text-green-500 flex-shrink-0" />
              {listing.address}
            </p>
          </div>

          {listing.reviewCount > 0 && (
            <div className="flex-shrink-0 flex items-center gap-1.5 bg-surface dark:bg-dark-surface border border-surface-border dark:border-dark-border rounded-xl px-3 py-2 shadow-sm">
              <FaStar className="text-yellow-400 text-sm" />
              <span className="text-sm font-bold text-content-primary dark:text-white">
                {listing.avgRating?.toFixed(1)}
              </span>
              <span className="text-xs text-content-muted">({listing.reviewCount})</span>
            </div>
          )}
        </div>

        {/* Image gallery */}
        <div className="bg-surface dark:bg-dark-surface rounded-2xl overflow-hidden shadow-lift mb-6">
          <div className="relative h-[400px] cursor-zoom-in" onClick={() => openLightbox(activeImg)}>
            <img
              src={listing.imgUrls[activeImg]}
              alt={`${listing.name} — photo ${activeImg + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              className="absolute top-4 right-4 w-9 h-9 bg-white/90 dark:bg-dark-surface/90 rounded-full flex items-center justify-center shadow-md hover:bg-white dark:hover:bg-dark-surface transition-colors"
              onClick={(e) => { e.stopPropagation(); setSaved((s) => !s) }}
            >
              {saved
                ? <FaHeart className="text-red-500 text-sm" />
                : <FaRegHeart className="text-content-muted text-sm" />}
            </button>
            {listing.imgUrls.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 dark:bg-dark-surface/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveImg((i) => (i === 0 ? listing.imgUrls.length - 1 : i - 1))
                  }}
                >
                  <FaChevronLeft className="text-content-secondary text-sm" />
                </button>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 dark:bg-dark-surface/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveImg((i) => (i === listing.imgUrls.length - 1 ? 0 : i + 1))
                  }}
                >
                  <FaChevronRight className="text-content-secondary text-sm" />
                </button>
              </>
            )}
          </div>

          {listing.imgUrls.length > 1 && (
            <div className="flex gap-2 p-3 overflow-x-auto">
              {listing.imgUrls.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImg === i
                      ? 'border-primary shadow-md opacity-100'
                      : 'border-transparent opacity-60 hover:opacity-90'
                  }`}
                >
                  <img src={url} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">

          {/* Left — main content */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            {/* Property specs */}
            <div className="bg-surface dark:bg-dark-surface rounded-2xl border border-surface-border dark:border-dark-border p-6">
              <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 dark:bg-dark-bg rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaBed className="text-blue-500 text-lg" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-content-muted uppercase tracking-wide">Bedrooms</p>
                    <p className="text-sm font-bold text-content-primary dark:text-white">
                      {listing.bedrooms} {listing.bedrooms === 1 ? 'Bed' : 'Beds'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-50 dark:bg-dark-bg rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaBath className="text-cyan-500 text-lg" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-content-muted uppercase tracking-wide">Bathrooms</p>
                    <p className="text-sm font-bold text-content-primary dark:text-white">
                      {listing.bathrooms} {listing.bathrooms === 1 ? 'Bath' : 'Baths'}
                    </p>
                  </div>
                </div>

                {listing.area && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-violet-50 dark:bg-dark-bg rounded-xl flex items-center justify-center flex-shrink-0">
                      <MdSquareFoot className="text-violet-500 text-xl" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-content-muted uppercase tracking-wide">Area</p>
                      <p className="text-sm font-bold text-content-primary dark:text-white">
                        {listing.area.toLocaleString('en-IN')} sqft
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-50 dark:bg-dark-bg rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaParking className="text-red-400 text-lg" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-content-muted uppercase tracking-wide">Parking</p>
                    <p className="text-sm font-bold text-content-primary dark:text-white">
                      {listing.parking ? 'Available' : 'Not available'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-50 dark:bg-dark-bg rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaChair className="text-amber-500 text-lg" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-content-muted uppercase tracking-wide">Furnishing</p>
                    <p className="text-sm font-bold text-content-primary dark:text-white">
                      {listing.furnished ? 'Furnished' : 'Unfurnished'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-surface dark:bg-dark-surface rounded-2xl border border-surface-border dark:border-dark-border p-6">
              <h2 className="text-base font-bold text-content-primary dark:text-white mb-3">About this property</h2>
              <p className="text-sm text-content-secondary dark:text-content-muted leading-relaxed">
                {listing.description}
              </p>
            </div>

            {/* Location */}
            {coords && (
              <div className="bg-surface dark:bg-dark-surface rounded-2xl border border-surface-border dark:border-dark-border overflow-hidden">
                <div className="px-6 py-4 border-b border-surface-border dark:border-dark-border">
                  <h2 className="text-base font-bold text-content-primary dark:text-white">Location</h2>
                </div>
                <MapContainer
                  center={[coords.lat, coords.lng]}
                  zoom={14}
                  scrollWheelZoom={false}
                  style={{ height: '280px', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[coords.lat, coords.lng]}>
                    <Popup>{listing.name}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            )}

            {/* Reviews */}
            <ReviewSection listingId={params.listingId} />
          </motion.div>

          {/* Right — sticky sidebar */}
          <motion.div
            className="lg:sticky lg:top-6 space-y-4"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            <div className="bg-surface dark:bg-dark-surface rounded-2xl border border-surface-border dark:border-dark-border p-6 shadow-lift">

              {/* Price */}
              <p className="text-xs font-semibold text-content-muted uppercase tracking-wide mb-1">
                {listing.type === 'rent' ? 'Monthly rent' : 'Sale price'}
              </p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-bold text-accent font-Bellefair">
                  ₹{formatINR(displayPrice)}
                </span>
                {listing.type === 'rent' && (
                  <span className="text-sm text-content-muted">/mo</span>
                )}
              </div>
              {listing.area > 0 && (
                <p className="text-xs text-content-muted mb-4">
                  ₹{Math.round(displayPrice / listing.area).toLocaleString('en-IN')}/sqft
                </p>
              )}

              {/* Owner */}
              {ownerName && (
                <div className="flex items-center gap-3 py-4 border-t border-surface-border dark:border-dark-border mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0 uppercase">
                    {ownerName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-content-primary dark:text-white truncate">
                      {ownerName}
                    </p>
                    <p className="text-xs text-content-muted flex items-center gap-1">
                      Owner&nbsp;·&nbsp;<FaCheckCircle className="text-blue-500" />&nbsp;Verified
                    </p>
                  </div>
                </div>
              )}

              {/* Contact actions */}
              {listing.phone && (
                <a
                  href={`https://wa.me/91${listing.phone}?text=${encodeURIComponent(
                    `Hi, I'm interested in "${listing.name}" listed on HomeFinder. Please share more details.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors shadow-sm mb-3 text-sm"
                >
                  <FaWhatsapp className="text-lg" /> Chat on WhatsApp
                </a>
              )}

              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 w-full border border-surface-border dark:border-dark-border text-content-secondary dark:text-content-muted hover:bg-surface-secondary dark:hover:bg-dark-bg font-semibold py-2.5 rounded-xl transition-colors text-sm"
              >
                <FaShare className="text-sm" /> Share this listing
              </button>

              <p className="text-xs text-content-muted text-center mt-4 leading-relaxed">
                Always visit the property and verify documents before making any payment.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 z-10"
            onClick={() => setLightboxOpen(false)}
          >
            <FaTimes />
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-2xl hover:text-gray-300 z-10 p-2"
            onClick={(e) => { e.stopPropagation(); lightboxPrev() }}
          >
            <FaChevronLeft />
          </button>
          <img
            src={listing.imgUrls[lightboxIndex]}
            alt={`Photo ${lightboxIndex + 1}`}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-2xl hover:text-gray-300 z-10 p-2"
            onClick={(e) => { e.stopPropagation(); lightboxNext() }}
          >
            <FaChevronRight />
          </button>
          <p className="absolute bottom-4 text-white/60 text-sm">
            {lightboxIndex + 1} / {listing.imgUrls.length}
          </p>
        </div>
      )}
    </main>
  )
}

export default Listing
