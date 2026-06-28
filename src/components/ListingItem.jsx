import { Link } from "react-router-dom"
import { MdLocationOn, MdEdit } from "react-icons/md"
import { FaTrash, FaHeart, FaRegHeart, FaStar } from "react-icons/fa"
import { motion } from "framer-motion"
import { useAuth } from '../context/AuthContext'

const ListingItem = ({ listing, id, onEdit, onDelete, savedIds, toggleSave }) => {
  const { user } = useAuth()
  const isLoggedIn = !!user
  const isSaved = savedIds ? savedIds.has(id) : false

  return (
    <li className="lift relative bg-surface dark:bg-dark-surface flex flex-col justify-between items-center shadow-md rounded-xl overflow-hidden m-[10px]">
      <Link className="contents" to={`/category/${listing.type}/${id}`}>
        <div className="relative w-full">
          {listing.propertyType && (
            <span className="absolute top-2 left-2 z-10 bg-primary text-white text-xs font-semibold px-2 py-1 rounded-full capitalize">
              {listing.propertyType}
            </span>
          )}
          <motion.img
            className="h-[170px] w-full object-cover hover:scale-105 transition-transform duration-200 ease-in"
            loading="lazy"
            src={listing.imgUrls[0]}
            alt={listing.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="w-full p-[10px]">
          <div className="flex items-center space-x-1">
            <MdLocationOn className="w-4 h-4 text-green-600 flex-shrink-0" />
            <p className="font-semibold text-sm mb-[2px] text-content-secondary dark:text-content-muted truncate">
              {listing.address}
            </p>
          </div>

          <p className="m-0 text-xl font-semibold truncate text-content-primary dark:text-white">
            {listing.name}
          </p>

          <p className="text-primary mt-2 font-semibold font-Bellefair">
            <span className="text-xl font-semibold">&#8377;</span>
            {listing.offer
              ? listing.discountedprice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularprice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" && " / month"}
          </p>

          <div className="flex items-center mt-[10px] space-x-3 text-content-secondary dark:text-content-muted">
            <p className="text-xs font-bold">
              {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
            </p>
            <p className="text-xs font-bold">
              {listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : "1 Bath"}
            </p>
            {listing.area && (
              <p className="text-xs font-bold">{listing.area} sqft</p>
            )}
          </div>

          {listing.reviewCount > 0 && (
            <div className="flex items-center gap-1 mt-2">
              <FaStar className="text-yellow-400 text-xs" />
              <span className="text-xs font-bold text-content-primary dark:text-white">{listing.avgRating?.toFixed(1)}</span>
              <span className="text-xs text-content-muted">({listing.reviewCount})</span>
            </div>
          )}
        </div>
      </Link>

      {/* Heart / Save toggle */}
      {isLoggedIn && toggleSave && (
        <button
          onClick={(e) => { e.preventDefault(); toggleSave(id) }}
          className="absolute top-2 right-2 z-10 bg-white/80 dark:bg-dark-surface/80 rounded-full p-1.5 shadow hover:scale-110 transition-transform"
          aria-label={isSaved ? "Unsave listing" : "Save listing"}
        >
          {isSaved
            ? <FaHeart className="text-primary text-base" />
            : <FaRegHeart className="text-content-secondary text-base" />
          }
        </button>
      )}

      {onDelete && (
        <FaTrash
          className="absolute bottom-2 right-2 h-[14px] cursor-pointer text-red-500 hover:text-red-700 transition-colors"
          onClick={() => onDelete(listing.id)}
        />
      )}
      {onEdit && (
        <MdEdit
          className="absolute h-4 cursor-pointer bottom-2 right-7 text-content-secondary hover:text-content-primary dark:text-content-muted dark:hover:text-white transition-colors"
          onClick={() => onEdit(listing.id)}
        />
      )}
    </li>
  )
}

export default ListingItem
