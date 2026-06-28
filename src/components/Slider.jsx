import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, EffectFade } from 'swiper'
import 'swiper/css/bundle'
import Spinner from './Spinner'
import api from '../utils/api'

const Slider = () => {
  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/listings', { params: { limit: 5 } })
      .then((res) => setListings(res.data.listings))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />
  if (!listings || listings.length === 0) return null

  return (
    <Swiper
      slidesPerView={1}
      pagination={{ type: 'progressbar' }}
      effect="fade"
      modules={[Autoplay, Pagination, EffectFade]}
      autoplay={{ delay: 3000 }}
    >
      {listings.map((listing) => (
        <SwiperSlide
          key={listing._id}
          onClick={() => navigate(`/category/${listing.type}/${listing._id}`)}
          className="cursor-pointer"
        >
          <div className="relative w-full h-[300px] lg:h-[420px] overflow-hidden">
            <img src={listing.imgUrls[0]} alt={listing.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <p className="absolute left-4 top-4 text-white font-semibold text-sm bg-primary/90 backdrop-blur-sm shadow-lg px-3 py-1.5 rounded-full">
              {listing.name}
            </p>
            <p className="absolute left-4 bottom-4 text-white font-bold text-lg">
              <span className="text-accent">&#8377;</span>
              {(listing.discountedprice ?? listing.regularprice).toLocaleString('en-IN')}
              {listing.type === 'rent' && <span className="text-sm font-normal text-white/80"> / month</span>}
            </p>
            <span className="absolute right-4 bottom-4 bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase">
              {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
            </span>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

export default Slider
