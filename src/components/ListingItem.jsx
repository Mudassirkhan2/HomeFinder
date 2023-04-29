import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
const  ListingItem =({ listing, id, onEdit, onDelete }) => {
  return (
    <li className="relative bg-white flex flex-col justify-between items-center shadow-md hover:shadow-xl rounded-md overflow-hidden transition-shadow duration-150 m-[10px]">
      <Link className="contents" to={`/category/${listing.type}/${id}`}>
        <img
          className="h-[170px] w-full object-cover hover:scale-105 transition-scale duration-200 ease-in"
          loading="lazy"
          src={listing.imgUrls[0]}
          alt="img" 
        />
        
        <div className="w-full p-[10px]">
          <div className="flex items-center space-x-1">
            <MdLocationOn className="w-4 h-4 text-green-600" />
            <p className="font-semibold text-sm mb-[2px] text-gray-600 truncate">
              {listing.address}
            </p>
          </div>
          <p className="m-0 text-xl font-semibold truncate">{listing.name}</p>
          <p className="text-[#457b9d] mt-2 font-semibold">
          <span className="text-xl font-semibold"> &#8377;</span>
            {
                // if offer is true then show discounted price else show regular price
                // and convert the price to indian currency format
            listing.offer
              ? listing.discountedprice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularprice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" && " / month"}
          </p>
          <div className="flex items-center mt-[10px] space-x-3">
            <div className="flex items-center space-x-1">
              <p className="text-xs font-bold">
                {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <p className="text-xs font-bold">
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} Baths`
                  : "1 Bath"}
              </p>
            </div>
          </div>
        </div>
      </Link>
      {onDelete && (
        <FaTrash
          className="absolute bottom-2 right-2 h-[14px] cursor-pointer text-red-500"
          onClick={() => onDelete(listing.id)}
        />
      )}
      {onEdit && (
        <MdEdit
          className="absolute h-4 cursor-pointer bottom-2 right-7 "
          onClick={() => onEdit(listing.id)}
        />
      )}
    </li>
  );
}
export default ListingItem