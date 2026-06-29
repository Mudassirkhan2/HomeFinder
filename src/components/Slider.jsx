import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper'
import 'swiper/css/bundle'
import { SliderSkeleton } from './ListingCardSkeleton'
import api from '../utils/api'

const Slider = () => {
  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const swiperRef = useRef(null)

  useEffect(() => {
    api.get('/listings', { params: { limit: 5 } })
      .then((res) => setListings(res.data.listings))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <SliderSkeleton />
  if (!listings || listings.length === 0) return null

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-2">
      <div className="flex items-end justify-between mb-4">
        <div>
          <p className="text-xs font-bold tracking-widest uppercase text-accent mb-1">Featured</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-content-primary dark:text-white">
            Find your next home
          </h1>
        </div>
        <button
          onClick={() => navigate('/offers')}
          className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors whitespace-nowrap"
        >
          Browse all →
        </button>
      </div>

      <div className="relative rounded-2xl overflow-hidden shadow-lift">
        <Swiper
          slidesPerView={1}
          pagination={{ clickable: true }}
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          speed={650}
          loop
          onSwiper={(s) => (swiperRef.current = s)}
          className="h-[360px] sm:h-[420px] lg:h-[480px]"
        >
          {listings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div className="relative w-full h-full">
                <img
                  src={listing.imgUrls[0]}
                  alt={listing.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/85" />

                {/* Status badge */}
                <span className="absolute top-5 left-5 bg-accent text-white text-xs font-bold tracking-wide uppercase px-3 py-1.5 rounded-full">
                  {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                </span>

                {/* Bottom content */}
                <div className="absolute left-6 right-6 bottom-7 flex items-end justify-between gap-4 flex-wrap">
                  <div className="text-white max-w-xl">
                    {listing.propertyType && (
                      <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full mb-3 capitalize">
                        {listing.propertyType}
                      </span>
                    )}
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight mb-2 drop-shadow">
                      {listing.name}
                    </h2>
                    <p className="flex items-center gap-1.5 text-sm text-white/85 mb-3">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="#22c55e">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
                      </svg>
                      {listing.address}
                    </p>
                    <div className="flex gap-4 text-sm font-semibold text-white/90">
                      {listing.bedrooms && <span>{listing.bedrooms} Bed{listing.bedrooms > 1 ? 's' : ''}</span>}
                      {listing.bathrooms && <span>{listing.bathrooms} Bath{listing.bathrooms > 1 ? 's' : ''}</span>}
                      {listing.area && <span>{listing.area.toLocaleString()} sqft</span>}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <div className="font-Bellefair text-3xl sm:text-4xl text-white leading-none">
                      &#8377;{(listing.offer ? listing.discountedprice : listing.regularprice).toLocaleString('en-IN')}
                      {listing.type === 'rent' && (
                        <span className="font-sans text-sm font-normal text-white/70 ml-1">/mo</span>
                      )}
                    </div>
                    <button
                      onClick={() => navigate(`/category/${listing.type}/${listing._id}`)}
                      className="bg-white text-content-primary text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg hover:bg-surface-secondary transition-colors"
                    >
                      View details
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Prev/Next arrows */}
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          aria-label="Previous slide"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-content-primary flex items-center justify-center shadow-lg transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <button
          onClick={() => swiperRef.current?.slideNext()}
          aria-label="Next slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-content-primary flex items-center justify-center shadow-lg transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </section>
  )
}

export default Slider
