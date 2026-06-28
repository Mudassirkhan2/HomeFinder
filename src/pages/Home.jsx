import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css/bundle'
import { motion } from 'framer-motion'
import { MdLocationOn } from 'react-icons/md'
import { FaHeart, FaRegHeart, FaHome, FaStar } from 'react-icons/fa'
import Slider from '../components/Slider'
import { CarouselCardSkeleton } from '../components/ListingCardSkeleton'
import { useSavedListings } from '../hooks/useSavedListings'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

const TYPE_FILTERS = ['All', 'House', 'Apartment', 'Villa', 'Plot', 'PG']

const SkeletonSection = ({ title }) => (
  <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-2">
    <div className="flex items-end justify-between mb-5">
      <div className="h-7 w-44 bg-surface-border dark:bg-dark-border animate-pulse rounded-lg" />
    </div>
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex-shrink-0 w-[calc(100%-1rem)] sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)] xl:w-[calc(25%-12px)]">
          <CarouselCardSkeleton />
        </div>
      ))}
    </div>
  </section>
)

const SectionCarousel = ({ title, subtitle, to, toLabel, listings, savedIds, toggleSave }) => {
  const swiperRef = useRef(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-2">
      <div className="flex items-end justify-between gap-4 mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-content-primary dark:text-white mb-1">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-content-secondary dark:text-content-muted">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label="Previous"
            className="w-9 h-9 rounded-xl border border-surface-border dark:border-dark-border bg-surface dark:bg-dark-surface text-content-secondary dark:text-content-muted flex items-center justify-center hover:text-content-primary dark:hover:text-white transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            aria-label="Next"
            className="w-9 h-9 rounded-xl border border-surface-border dark:border-dark-border bg-surface dark:bg-dark-surface text-content-secondary dark:text-content-muted flex items-center justify-center hover:text-content-primary dark:hover:text-white transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
          {to && (
            <Link to={to} className="hidden sm:block text-sm font-semibold text-primary hover:text-primary-hover transition-colors ml-1 whitespace-nowrap">
              {toLabel || 'See all →'}
            </Link>
          )}
        </div>
      </div>

      <Swiper
        slidesPerView={1.15}
        spaceBetween={16}
        onSwiper={(s) => (swiperRef.current = s)}
        breakpoints={{
          560:  { slidesPerView: 2.1, spaceBetween: 16 },
          900:  { slidesPerView: 3,   spaceBetween: 20 },
          1180: { slidesPerView: 4,   spaceBetween: 20 },
        }}
      >
        {listings.map((listing) => {
          const isSaved = savedIds ? savedIds.has(listing._id) : false
          const price = listing.offer ? listing.discountedprice : listing.regularprice

          return (
            <SwiperSlide key={listing._id}>
              <motion.div
                className="bg-surface dark:bg-dark-surface border border-surface-border dark:border-dark-border rounded-2xl overflow-hidden shadow-md hover:shadow-lift transition-shadow h-full"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Image */}
                <div className="relative">
                  <img
                    src={listing.imgUrls[0]}
                    alt={listing.name}
                    className="w-full h-44 object-cover"
                    loading="lazy"
                  />
                  {listing.propertyType && (
                    <span className="absolute top-2.5 left-2.5 bg-primary text-white text-xs font-semibold px-2.5 py-1 rounded-full capitalize">
                      {listing.propertyType}
                    </span>
                  )}
                  {user && toggleSave && (
                    <button
                      onClick={() => toggleSave(listing._id)}
                      aria-label={isSaved ? 'Unsave' : 'Save'}
                      className="absolute top-2.5 right-2.5 w-8 h-8 bg-white/90 dark:bg-dark-surface/90 rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform"
                    >
                      {isSaved
                        ? <FaHeart className="text-accent text-sm" />
                        : <FaRegHeart className="text-content-secondary text-sm" />
                      }
                    </button>
                  )}
                  <span className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">
                    {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                  </span>
                </div>

                {/* Content */}
                <div
                  className="p-3.5 cursor-pointer"
                  onClick={() => navigate(`/category/${listing.type}/${listing._id}`)}
                >
                  <p className="flex items-center gap-1 text-xs text-content-secondary dark:text-content-muted mb-1 truncate">
                    <MdLocationOn className="text-green-500 flex-shrink-0 text-sm" />
                    {listing.address}
                  </p>
                  <h3 className="text-base font-bold text-content-primary dark:text-white truncate mb-2">
                    {listing.name}
                  </h3>
                  <div className="font-Bellefair text-xl text-primary leading-none mb-3">
                    &#8377;{price.toLocaleString('en-IN')}
                    {listing.type === 'rent' && (
                      <span className="font-sans text-xs font-medium text-content-secondary dark:text-content-muted ml-1">/mo</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 pt-2.5 border-t border-surface-border dark:border-dark-border text-xs font-bold text-content-secondary dark:text-content-muted">
                    {listing.bedrooms && <span>{listing.bedrooms} Bed{listing.bedrooms > 1 ? 's' : ''}</span>}
                    {listing.bathrooms && <span>{listing.bathrooms} Bath{listing.bathrooms > 1 ? 's' : ''}</span>}
                    {listing.area && <span>{listing.area.toLocaleString()} sqft</span>}
                    {listing.reviewCount > 0 && (
                      <span className="flex items-center gap-0.5 ml-auto">
                        <FaStar className="text-yellow-400" />
                        {listing.avgRating?.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          )
        })}
      </Swiper>

      {to && (
        <Link to={to} className="sm:hidden block mt-4 text-sm font-semibold text-primary hover:text-primary-hover transition-colors text-center">
          {toLabel || 'See all →'}
        </Link>
      )}
    </section>
  )
}

const Home = () => {
  const [offersListing, setOffersListing] = useState(null)
  const [rentListing, setRentListing] = useState(null)
  const [saleListing, setSaleListing] = useState(null)
  const [activeType, setActiveType] = useState('All')
  const { savedIds, toggleSave } = useSavedListings()
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/listings', { params: { offer: true, limit: 6 } })
      .then((r) => setOffersListing(r.data.listings))
      .catch(() => setOffersListing([]))
  }, [])

  useEffect(() => {
    api.get('/listings', { params: { type: 'rent', limit: 6 } })
      .then((r) => setRentListing(r.data.listings))
      .catch(() => setRentListing([]))
  }, [])

  useEffect(() => {
    api.get('/listings', { params: { type: 'sale', limit: 6 } })
      .then((r) => setSaleListing(r.data.listings))
      .catch(() => setSaleListing([]))
  }, [])

  const filterListings = (listings) => {
    if (!listings) return null
    if (activeType === 'All') return listings
    return listings.filter(
      (l) => l.propertyType?.toLowerCase() === activeType.toLowerCase()
    )
  }

  const filteredOffers = filterListings(offersListing)
  const filteredRent   = filterListings(rentListing)
  const filteredSale   = filterListings(saleListing)

  const hasAny = (filteredOffers?.length > 0) || (filteredRent?.length > 0) || (filteredSale?.length > 0)

  return (
    <div className="pb-16">
      {/* Hero slider */}
      <Slider />

      {/* Property type filter */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-1">
        <div className="flex gap-2 flex-wrap">
          {TYPE_FILTERS.map((type) => (
            <button
              key={type}
              onClick={() =>
                type === activeType
                  ? setActiveType('All')
                  : type === 'All'
                  ? setActiveType('All')
                  : navigate(`/search?propertyType=${type.toLowerCase()}`)
              }
              className={`text-sm font-semibold px-4 py-2 rounded-full border transition-colors ${
                activeType === type
                  ? 'bg-primary border-primary text-white'
                  : 'bg-surface dark:bg-dark-surface border-surface-border dark:border-dark-border text-content-secondary dark:text-content-muted hover:border-primary hover:text-primary'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </section>

      {/* Sections */}
      {offersListing === null && rentListing === null && saleListing === null ? (
        <>
          <SkeletonSection />
          <SkeletonSection />
          <SkeletonSection />
        </>
      ) : !hasAny ? (
        <p className="text-center text-content-secondary dark:text-content-muted py-16">
          No listings found for this property type.
        </p>
      ) : (
        <>
          {filteredOffers && filteredOffers.length > 0 && (
            <SectionCarousel
              title="Recent offers"
              subtitle="Hand-picked listings updated daily"
              to="/offers"
              toLabel="Show more offers →"
              listings={filteredOffers}
              savedIds={savedIds}
              toggleSave={toggleSave}
            />
          )}

          {filteredRent && filteredRent.length > 0 && (
            <SectionCarousel
              title="Places for Rent"
              to="/category/rent"
              toLabel="Show more rentals →"
              listings={filteredRent}
              savedIds={savedIds}
              toggleSave={toggleSave}
            />
          )}

          {filteredSale && filteredSale.length > 0 && (
            <SectionCarousel
              title="Places for Sale"
              to="/category/sale"
              toLabel="Show more for sale →"
              listings={filteredSale}
              savedIds={savedIds}
              toggleSave={toggleSave}
            />
          )}
        </>
      )}

      {/* CTA Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-2">
        <motion.div
          className="relative overflow-hidden bg-primary rounded-2xl px-8 py-10 flex items-center justify-between gap-6 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Decorative circles */}
          <div className="absolute -right-14 -top-14 w-56 h-56 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute right-20 -bottom-20 w-48 h-48 rounded-full bg-white/7 pointer-events-none" />

          <div className="relative text-white">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mb-2">
              Have a property to sell or rent?
            </h2>
            <p className="text-sm sm:text-base text-white/85 max-w-md">
              List it on HomeFinder in minutes and reach thousands of buyers and tenants near you.
            </p>
          </div>

          <Link
            to="/create-listing"
            className="relative flex items-center gap-2 bg-white text-primary text-sm font-bold px-6 py-3.5 rounded-xl shadow-xl hover:bg-surface-secondary transition-colors whitespace-nowrap"
          >
            <FaHome className="text-base" />
            List your property
          </Link>
        </motion.div>
      </section>
    </div>
  )
}

export default Home
