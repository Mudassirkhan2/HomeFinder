import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'
import Spinner from '../components/Spinner'
import {Swiper,SwiperSlide} from 'swiper/react'
import SwiperCore,{Navigation,Pagination,Autoplay,EffectFade} from 'swiper'
import "swiper/css/bundle";
import { FaMapMarkerAlt ,FaBed ,FaBath ,FaParking ,FaChair} from 'react-icons/fa'


const Listing = () => {
    const params = useParams()
    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(true)
    SwiperCore.use([Autoplay, Navigation, Pagination]);
    useEffect(() => {
      async function fetchListing() {
        const docRef = doc(db, "listings", params.listingId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setListing(docSnap.data());
          setLoading(false);
        }
        console.log(listing)
      }
      fetchListing();
    }, [params.listingId]);
    if (loading) {
      return <Spinner />;
    }
  return (
    <main>
      {/* Swiper Slides  */}
      <Swiper
        slidesPerView={1}
        navigation
        pagination={{ type: "progressbar" }}
        effect="fade"
        modules={[EffectFade]}
        autoplay={{ delay: 3000 }}
        fade= { {crossFade: false} }
      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-[300px] lg:h-[400px] overflow-hidden">
                        <img src={url}   style={{
                            objectFit: "cover",
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                }}/>
                      
            </div>
          </SwiperSlide>
          
        ))}

       
      </Swiper>

      {/* Listing Details */}
      <div className='flex max-w-xl p-4 mx-auto text-center bg-white rounded-lg shadow-lg'>
        <div className='w-full '>
          <p className='mb-3 text-2xl font-bold text-blue-900'>{listing.name} - <span className="text-xl font-semibold"> &#8377;</span> {
            listing.offer ? listing.discountedprice.toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",") : listing.regularprice.toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          } {listing.type === "rent" && " / month"} 
          </p>
            <p className='flex items-center mt-6 mb-3 font-semibold '> <FaMapMarkerAlt className='mr-1 text-green-700'/>
              {listing.address}
            </p>
              <div className='flex justify-start items-center space-x-4 w-[75%]'>
                <p className='bg-red-800 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold shadow-md'> For { listing.type === "rent" ? "Rent" : "Sale" }
                </p>
                {
                  listing.offer && (
                    <p className='w-full max-w-[200px] bg-green-800 rounded-md p-1 text-white font-semibold shadow-md text-center '><span className="text-xl font-semibold"> &#8377;</span>{+listing.regularprice - +listing.discountedprice} discount
                    </p>
                  )
                }
              </div>
              <p className='mt-3 mb-3 '> <span className='font-semibold '>Description -</span> {listing.description}</p>

              <ul className='flex flex-wrap items-center space-x-2 text-sm font-semibold lg:space-x-10 '>
                <li className='flex items-center whitespace-nowrap'> 
                <FaBed className='mr-1 text-lg '/>
                  {
                    +listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : `${listing.bedrooms} Bedroom`
                  }
                </li>
                <li className='flex items-center whitespace-nowrap '> 
                <FaBath className='mr-1 text-lg '/>
                  {
                    +listing.bathrooms > 1 ? `${listing.bedrooms} Bathrooms` : `${listing.bedrooms} Bathroom`
                  }
                </li>
                <li className='flex items-center whitespace-nowrap'> 
                <FaParking className='mr-1 text-lg '/>
                  {
                    +listing.parking  ? "Parking Spot" : `NO Parking`
                  }
                </li>
                <li className='flex items-center whitespace-nowrap'> 
                <FaChair className='mr-1 text-lg '/>
                  {
                    +listing.furnished > 1 ? `Furnished` : `Not furnished`
                  }
                </li>
              </ul>
        </div>
      </div>
    </main>
  )
}

export default Listing
