import { useState } from "react"

const CreateListing = () => {
  const[formdata, setFormdata] =useState({
    type: 'rent',
    name: '',
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished : false,
    address: '',
    description: '',
    offer: true,
    regularprice: 0,
    discountedprice: 0,
  })
  const { type,name ,bedrooms ,bathrooms,parking,furnished ,address,description,offer,regularprice,discountedprice} = formdata
  function onChange(e) {
    console.log(e.target.value)   
  }
  return (
    <main className='max-w-md px-2 mx-auto'>
        <h1 className='mt-6 text-3xl font-bold text-center'>Create a Listing </h1>
        <form >
          <p className='mt-6 text-lg font-semibold '>Sell / Rent </p>
          <div className='flex '>
            <button type='button' id='type' value="sale" onClick={onChange} className={`px-7 py-3 mr-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-xl transition duration-100 ease-in-out w-full ${
              type === 'rent' ? 'bg-gray-200 text-gray-500' : 'bg-slate-600 text-gray-900'
            }`}>
              sell
            </button>
            <button type='button' id='type' value="sale" onClick={onChange} className={`px-7 py-3 ml-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-xl transition duration-100 ease-in-out w-full ${
              type === 'sale' ? 'bg-gray-200 text-gray-500' : 'bg-slate-600 text-gray-900'
            }`}>
              rent
            </button>
          </div>
          <div className='mt-6'>
            <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
              Name
            </label>
            <input type='text' name='name' id='name' value={name} onChange={onChange} className='block w-full mt-1 text-xl border-gray-300 rounded-md shadow-sm focus:ring-slate-600 focus:border-slate-600 sm:text-sm'placeholder="Name" maxLength="32"minLength="10" required />
          </div>
          <div className='flex mt-6 space-x-2'>
            {/* label for beds  */}
            <div>
              <label htmlFor='beds' className='block text-sm font-medium text-gray-700'>  
                Beds
              </label>
              <input type='number' name='beds' id='beds' value={bedrooms} onChange={onChange} className='block w-full mt-1 text-xl transition duration-150 ease-in-out border-gray-300 rounded-md shadow-sm focus:ring-slate-600 focus:border-slate-600 sm:text-sm'placeholder="Beds" maxLength="50"minLength="1" required />    
            </div>
            {/* label for baths  */}
            <div>
              <label htmlFor='bathrooms' className='block text-sm font-medium text-gray-700'>  
                Baths
                </label> 
              <input type='number' name='bathrooms' id='bathrooms' value={bathrooms} onChange={onChange} className='block w-full mt-1 text-xl transition duration-150 ease-in-out border-gray-300 rounded-md shadow-sm focus:ring-slate-600 focus:border-slate-600 sm:text-sm'placeholder="Beds" maxLength="50"minLength="1" required />    
            </div>
          </div>  

          <p className='mt-6 text-lg font-semibold '> Parking Spot </p>
          <div className='flex '>
            <button type='button' id='parking' value={true} onClick={onChange} className={`px-7 py-3 mr-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-xl transition duration-100 ease-in-out w-full ${
            !parking ? 'bg-gray-200 text-gray-500' : 'bg-slate-600 text-gray-900'
            }`}>
              Yes 
            </button>
            <button type='button' id='parking' value={false} onClick={onChange} className={`px-7 py-3 ml-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-xl transition duration-100 ease-in-out w-full ${
            parking ? 'bg-gray-200 text-gray-500' : 'bg-slate-600 text-gray-900'
            }`}>
              No
            </button>
          </div>

          <p className='mt-6 text-lg font-semibold '>Furnished </p>
          <div className='flex '>
            <button type='button' id='furnished' value={true} onClick={onChange} className={`px-7 py-3 mr-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-xl transition duration-100 ease-in-out w-full ${
            !furnished ? 'bg-gray-200 text-gray-500' : 'bg-slate-600 text-gray-900'
            }`}>
              Yes
            </button>
            <button type='button' id='furnished' value={false} onClick={onChange} className={`px-7 py-3 ml-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-xl transition duration-100 ease-in-out w-full ${
            furnished ? 'bg-gray-200 text-gray-500' : 'bg-slate-600 text-gray-900'
            }`}>
              No
            </button>
          </div>

          <div className='mt-6'>
            <label htmlFor='address' className='block text-xl font-medium text-gray-700'>
              Address
            </label>
            <textarea type='text' name='address' id='address' value={address} onChange={onChange} className='block w-full mt-1 text-xl transition duration-150 ease-in-out border-gray-300 rounded-md shadow-sm focus:ring-slate-600 focus:border-slate-600 sm:text-sm'placeholder="Address"  />

            <label htmlFor='description' className='block text-xl font-medium text-gray-700'>
            Description
            </label>
            <textarea type='text' name='description' id='description' value={description} onChange={onChange} className='block w-full mt-1 text-xl transition duration-150 ease-in-out border-gray-300 rounded-md shadow-sm focus:ring-slate-600 focus:border-slate-600 sm:text-sm'placeholder="Description"  />
          </div>
          
          <p className='mt-6 text-lg font-semibold '>Offer </p>
          <div className='flex '>
            <button type='button' id='offer' value={true} onClick={onChange} className={`px-7 py-3 mr-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-xl transition duration-100 ease-in-out w-full ${
            !offer ? 'bg-gray-200 text-gray-500' : 'bg-slate-600 text-gray-900'
            }`}>
              Yes
            </button>
            <button type='button' id='offer' value={false} onClick={onChange} className={`px-7 py-3 ml-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-xl transition duration-100 ease-in-out w-full ${
            offer ? 'bg-gray-200 text-gray-500' : 'bg-slate-600 text-gray-900'
            }`}>
              No
            </button>
          </div>
          <div className="flex flex-col items-start mt-3 mb-6">
            <label htmlFor='regularprice' className='block text-xl font-medium text-gray-700'>
                      Regular  Price
                    </label>
            <div className="flex items-center justify-center space-x-6">
              <input type='number' name='regularprice' id='regularprice' value={regularprice} onChange={onChange} className='block w-full mt-1 text-lg transition duration-150 ease-in-out border-gray-300 rounded-md shadow-sm focus:ring-slate-600 focus:border-slate-600 sm:text-sm'placeholder="Price" min="5000"
              max="100000" required />
              {
              type === 'rent' && (
                <div>
                  <p className="w-full text-md whitespace-nowrap "> Rs/Month</p>
                </div>
                ) }
            </div>
          </div>
          {
            offer && (
              <div className="flex flex-col items-start mt-3 mb-6">
              <label htmlFor='discountedprice' className='block text-xl font-medium text-gray-700'>
              Discounted Price
                      </label>
              <div className="flex items-center justify-center space-x-6">
                <input type='number' name='discountedprice' id='discountedprice' value={discountedprice} onChange={onChange} className='block w-full mt-1 text-lg transition duration-150 ease-in-out border-gray-300 rounded-md shadow-sm focus:ring-slate-600 focus:border-slate-600 sm:text-sm'placeholder="Price" min="5000"
                max="100000" required={offer} />
                {
                type === 'rent' && (
                  <div>
                    <p className="w-full text-md whitespace-nowrap "> Rs/Month</p>
                  </div>
                  ) }
              </div>
            </div>
            )
          }
          <div>
            <label htmlFor='images' className='block text-xl font-medium text-gray-700'>
              Images
            </label>
            <p className="text-gray-600">The first image will be cover (max 6)</p>
            <input type='file' name='images' id='images' onChange={onChange} className='block w-full px-3 py-2 mt-1 text-xl transition duration-150 ease-in-out border-gray-300 rounded-md shadow-sm focus:ring-slate-600 focus:border-slate-600 sm:text-sm'placeholder="Image" multiple required  accept=".jpg,.png,.jpeg"/>
          </div>
          <button type="submit" className="w-full py-3 mt-4 mb-6 text-sm font-medium text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded shadow-md px-7 hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg">
            Create Listing
          </button>
        </form>
    </main>
  )
}

export default CreateListing
