import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay, EffectFade } from 'swiper'
import 'swiper/css/bundle'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { FaMapMarkerAlt, FaBed, FaBath, FaParking, FaChair, FaWhatsapp, FaShare, FaTimes, FaChevronLeft, FaChevronRight, FaExpand } from 'react-icons/fa'
import { MdSquareFoot } from 'react-icons/md'
import { geocodeAddress } from '../utils/geocode'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import EmiCalculator from '../components/EmiCalculator'
import ReviewSection from '../components/ReviewSection'
import Spinner from '../components/Spinner'
import api from '../utils/api'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const Listing = () => {
  const params = useParams()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [coords, setCoords] = useState(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

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

  function openLightbox(index) { setLightboxIndex(index); setLightboxOpen(true) }
  function lightboxPrev() { setLightboxIndex((i) => (i === 0 ? listing.imgUrls.length - 1 : i - 1)) }
  function lightboxNext() { setLightboxIndex((i) => (i === listing.imgUrls.length - 1 ? 0 : i + 1)) }

  async function handleShare() {
    if (navigator.share) {
      await navigator.share({ title: listing.name, url: window.location.href })
    } else {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  if (loading) return <Spinner />

  const displayPrice = listing.offer
    ? listing.discountedprice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : listing.regularprice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  return (
    <main className="pb-20">
      <div className="relative">
        <Swiper slidesPerView={1} pagination={{ type: 'progressbar' }} effect="fade" modules={[Pagination, Autoplay, EffectFade]} autoplay={{ delay: 3000 }}>
          {listing.imgUrls.map((url, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-[300px] lg:h-[420px] overflow-hidden cursor-zoom-in" onClick={() => openLightbox(index)}>
                <img src={url} alt={`${listing.name} - photo ${index + 1}`} className="w-full h-full object-cover" />
                <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <FaExpand className="text-xs" /> View full
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <motion.div className="max-w-2xl mx-auto mt-6 px-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="bg-surface dark:bg-dark-surface rounded-2xl shadow-lg p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-2xl font-bold text-content-primary dark:text-white">{listing.name}</h1>
            <button onClick={handleShare} className="flex-shrink-0 p-2 rounded-full border border-surface-border dark:border-dark-border text-content-secondary hover:bg-surface-secondary dark:hover:bg-dark-bg transition-colors" title="Share">
              <FaShare />
            </button>
          </div>

          <p className="text-2xl font-bold text-primary font-Bellefair mb-1">
            &#8377;{displayPrice}
            {listing.type === 'rent' && <span className="text-base font-normal text-content-muted"> / month</span>}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-primary-light text-primary text-xs font-semibold px-3 py-1 rounded-full capitalize">For {listing.type === 'rent' ? 'Rent' : 'Sale'}</span>
            {listing.propertyType && (
              <span className="bg-surface-secondary dark:bg-dark-bg text-content-secondary text-xs font-semibold px-3 py-1 rounded-full capitalize border border-surface-border dark:border-dark-border">{listing.propertyType}</span>
            )}
            {listing.offer && (
              <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                &#8377;{(+listing.regularprice - +listing.discountedprice).toLocaleString('en-IN')} off
              </span>
            )}
          </div>

          <p className="flex items-start gap-1.5 text-content-secondary dark:text-content-muted mb-4">
            <FaMapMarkerAlt className="mt-1 text-green-600 flex-shrink-0" />{listing.address}
          </p>

          <ul className="flex flex-wrap gap-x-6 gap-y-3 mb-4">
            <li className="flex items-center gap-1.5 text-sm font-semibold text-content-primary dark:text-white"><FaBed className="text-content-muted" />{listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : '1 Bedroom'}</li>
            <li className="flex items-center gap-1.5 text-sm font-semibold text-content-primary dark:text-white"><FaBath className="text-content-muted" />{listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` : '1 Bathroom'}</li>
            {listing.area && <li className="flex items-center gap-1.5 text-sm font-semibold text-content-primary dark:text-white"><MdSquareFoot className="text-content-muted text-base" />{listing.area} sqft</li>}
            <li className="flex items-center gap-1.5 text-sm font-semibold text-content-primary dark:text-white"><FaParking className="text-content-muted" />{listing.parking ? 'Parking available' : 'No parking'}</li>
            <li className="flex items-center gap-1.5 text-sm font-semibold text-content-primary dark:text-white"><FaChair className="text-content-muted" />{listing.furnished ? 'Furnished' : 'Unfurnished'}</li>
          </ul>

          <div className="border-t border-surface-border dark:border-dark-border pt-4 mb-4">
            <h2 className="text-sm font-semibold text-content-muted uppercase mb-2">Description</h2>
            <p className="text-content-secondary dark:text-content-muted leading-relaxed">{listing.description}</p>
          </div>

          {listing.phone && (
            <a
              href={`https://wa.me/91${listing.phone}?text=${encodeURIComponent(`Hi, I'm interested in "${listing.name}" listed on HomeFinder. Please share more details.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors shadow-md mb-3"
            >
              <FaWhatsapp className="text-xl" /> Chat on WhatsApp
            </a>
          )}
        </div>

        <EmiCalculator defaultAmount={listing.offer ? listing.discountedprice : listing.regularprice} />

        {coords && (
          <div className="mt-4 rounded-2xl overflow-hidden shadow-lg border border-surface-border dark:border-dark-border">
            <p className="px-4 py-3 text-sm font-semibold text-content-secondary dark:text-content-muted bg-surface dark:bg-dark-surface border-b border-surface-border dark:border-dark-border">Location</p>
            <MapContainer center={[coords.lat, coords.lng]} zoom={14} scrollWheelZoom={false} style={{ height: '300px', width: '100%' }}>
              <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[coords.lat, coords.lng]}><Popup>{listing.name}</Popup></Marker>
            </MapContainer>
          </div>
        )}

        <ReviewSection listingId={params.listingId} />
      </motion.div>

      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setLightboxOpen(false)}>
          <button className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 z-10" onClick={() => setLightboxOpen(false)}><FaTimes /></button>
          <button className="absolute left-4 text-white text-2xl hover:text-gray-300 z-10 p-2" onClick={(e) => { e.stopPropagation(); lightboxPrev() }}><FaChevronLeft /></button>
          <img src={listing.imgUrls[lightboxIndex]} alt={`Photo ${lightboxIndex + 1}`} className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
          <button className="absolute right-4 text-white text-2xl hover:text-gray-300 z-10 p-2" onClick={(e) => { e.stopPropagation(); lightboxNext() }}><FaChevronRight /></button>
          <p className="absolute bottom-4 text-white/60 text-sm">{lightboxIndex + 1} / {listing.imgUrls.length}</p>
        </div>
      )}
    </main>
  )
}

export default Listing
