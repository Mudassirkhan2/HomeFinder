import { collection,getDocs, limit, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'
import Spinner from '../components/Spinner'
import React, { useEffect, useState } from 'react'
import {Swiper, SwiperSlide} from 'swiper/react'
import SwiperCore, { 
    EffectFade,
    Autoplay,
    Pagination,
    Navigation,
} from 'swiper'
import 'swiper/css/bundle'
import {useNavigate} from 'react-router-dom'

const Slider = () => {
    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    SwiperCore.use([Autoplay, Pagination, Navigation])
    useEffect(() => {
    async function fetchListings() {
        const listingRef = collection(db, 'listings')
        // query to get the latest 5 listings
        const q = query(listingRef, orderBy('timeStamp', 'desc'),limit(5))
        // querySnapshot is an array of documents in the collection that satisfy the condition of the query.
        const querySnapshot = await getDocs(q)
        let listings = []
        querySnapshot.forEach((doc) => {
        return  listings.push({
            id : doc.id,
            data : doc.data(),
        });
        });
        setListings(listings)
        setLoading(false)
    }
    fetchListings()
    }, [])
    if (loading) { 
        return <Spinner />
    }
    if (listings.length === 0) {
        return <h1>No listings found</h1>
    }
    // listing.data.imgUrls[0]
    return listings && (
    <>
       <Swiper 
       slidesPerView={1}
       navigation
       pagination={{ type: "progressbar" }}
       effect="fade"
       modules={[EffectFade]}
       autoplay={{ delay: 3000 }} >
        
            {listings.map((listing) => (
                <SwiperSlide key={listing.id}  onClick={() => navigate(`/category/${listing.data.type}/${listing.id}`)}
                >
                    <div className="relative w-full h-[300px] lg:h-[400px] overflow-hidden">
                        <img src={listing.data.imgUrls[0]} alt={listing.data.title}  style={{
                            objectFit: "fill",
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                }}/>
                      
                    </div>
                    <p className="text-[#f1faee] absolute left-1 top-3 font-medium max-w-[90%] bg-[#457b9d] shadow-lg opacity-90 p-2 rounded-br-3xl">
                {listing.data.name}
              </p>
              <p className="text-[#f1faee] absolute left-1 bottom-1 font-semibold max-w-[90%] bg-[#e63946] shadow-lg opacity-90 p-2 rounded-tr-3xl">
              <span className="text-xl font-semibold"> &#8377;</span>{listing.data.discountedprice ?? listing.data.regularprice}
                {listing.data.type === "rent" && " / month"}
              </p>
                {/* <div
                style={{
                  background: `url(${listing.data.imgUrls[0]}) center, no-repeat`,
                  backgroundSize: "cover",
                }}
                className="relative w-full h-[300px] overflow-hidden"
              ></div> */}
                    
                </SwiperSlide>
            ))}



       </Swiper>
    </>
  )
}

export default Slider
