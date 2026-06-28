import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import Spinner from '../components/Spinner'
import api from '../utils/api'

const LABEL_CLASS = "block text-sm font-semibold text-content-secondary dark:text-content-muted mb-1"
const INPUT_CLASS = "block w-full mt-1 text-lg text-content-primary dark:text-white bg-surface dark:bg-dark-surface border border-surface-border dark:border-dark-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-150"
const TOGGLE_ACTIVE = "px-7 py-3 font-semibold text-sm uppercase shadow-md rounded-lg transition duration-100 ease-in-out w-full bg-primary text-white"
const TOGGLE_INACTIVE = "px-7 py-3 font-semibold text-sm uppercase shadow-md rounded-lg transition duration-100 ease-in-out w-full bg-surface dark:bg-dark-surface border border-surface-border dark:border-dark-border text-content-secondary dark:text-content-muted hover:bg-surface-secondary"
const PROPERTY_TYPES = ['house', 'apartment', 'villa', 'plot', 'pg']

const CreateListing = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState(null)
  const [formdata, setFormdata] = useState({
    type: 'rent', propertyType: 'house', name: '',
    bedrooms: 1, bathrooms: 1, area: '',
    parking: false, furnished: false,
    address: '', description: '', phone: '',
    offer: true, regularprice: 0, discountedprice: 0,
  })

  const { type, propertyType, name, bedrooms, bathrooms, area, parking, furnished, address, description, phone, offer, regularprice, discountedprice } = formdata

  function onChange(e) {
    let boolean = null
    if (e.target.value === 'true') boolean = true
    else if (e.target.value === 'false') boolean = false

    if (e.target.files) {
      setImages(e.target.files)
    } else {
      setFormdata((prev) => ({ ...prev, [e.target.id]: boolean ?? e.target.value }))
    }
  }

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)

    if (offer && +discountedprice >= +regularprice) {
      setLoading(false)
      toast.error('Discounted price must be less than regular price')
      return
    }
    if (!images || images.length === 0) {
      setLoading(false)
      toast.error('Please select at least one image')
      return
    }
    if (images.length > 6) {
      setLoading(false)
      toast.error('Maximum 6 images allowed')
      return
    }
    for (let i = 0; i < images.length; i++) {
      if (images[i].size > 2 * 1024 * 1024) {
        setLoading(false)
        toast.error('Each image must be under 2MB')
        return
      }
    }

    try {
      const fd = new FormData()
      Object.entries(formdata).forEach(([k, v]) => fd.append(k, v))
      if (!offer) fd.delete('discountedprice')
      for (let i = 0; i < images.length; i++) fd.append('images', images[i])

      const res = await api.post('/listings', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Listing created!')
      navigate(`/category/${res.data.listing.type}/${res.data.listing._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create listing')
    }
    setLoading(false)
  }

  if (loading) return <Spinner />

  return (
    <main className="max-w-md px-2 mx-auto pb-10">
      <motion.h1 className="mt-6 text-3xl font-bold text-center text-content-primary dark:text-white" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        Create a Listing
      </motion.h1>

      <form onSubmit={onSubmit} className="mt-6 space-y-5">
        <div>
          <p className={LABEL_CLASS}>Sell / Rent</p>
          <div className="flex gap-3">
            <button type="button" id="type" value="sale" onClick={onChange} className={type === 'sale' ? TOGGLE_ACTIVE : TOGGLE_INACTIVE}>Sell</button>
            <button type="button" id="type" value="rent" onClick={onChange} className={type === 'rent' ? TOGGLE_ACTIVE : TOGGLE_INACTIVE}>Rent</button>
          </div>
        </div>

        <div>
          <p className={LABEL_CLASS}>Property Type</p>
          <div className="flex flex-wrap gap-2">
            {PROPERTY_TYPES.map((pt) => (
              <button key={pt} type="button" id="propertyType" value={pt} onClick={onChange}
                className={`px-4 py-2 text-sm font-semibold uppercase rounded-lg border transition duration-100 ${propertyType === pt ? 'bg-primary text-white border-primary' : 'bg-surface dark:bg-dark-surface border-surface-border dark:border-dark-border text-content-secondary dark:text-content-muted hover:bg-surface-secondary'}`}>
                {pt === 'pg' ? 'PG' : pt.charAt(0).toUpperCase() + pt.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="name" className={LABEL_CLASS}>Name</label>
          <input type="text" id="name" value={name} onChange={onChange} className={INPUT_CLASS} placeholder="Name of the property" maxLength="32" minLength="10" required />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="bedrooms" className={LABEL_CLASS}>Beds</label>
            <input type="number" id="bedrooms" value={bedrooms} onChange={onChange} className={INPUT_CLASS} min="1" max="50" required />
          </div>
          <div className="flex-1">
            <label htmlFor="bathrooms" className={LABEL_CLASS}>Baths</label>
            <input type="number" id="bathrooms" value={bathrooms} onChange={onChange} className={INPUT_CLASS} min="1" max="50" required />
          </div>
        </div>

        <div>
          <label htmlFor="area" className={LABEL_CLASS}>Area (sqft)</label>
          <input type="number" id="area" value={area} onChange={onChange} className={INPUT_CLASS} placeholder="e.g. 1200" min="100" required />
        </div>

        <div>
          <p className={LABEL_CLASS}>Parking Spot</p>
          <div className="flex gap-3">
            <button type="button" id="parking" value="true" onClick={onChange} className={parking ? TOGGLE_ACTIVE : TOGGLE_INACTIVE}>Yes</button>
            <button type="button" id="parking" value="false" onClick={onChange} className={!parking ? TOGGLE_ACTIVE : TOGGLE_INACTIVE}>No</button>
          </div>
        </div>

        <div>
          <p className={LABEL_CLASS}>Furnished</p>
          <div className="flex gap-3">
            <button type="button" id="furnished" value="true" onClick={onChange} className={furnished ? TOGGLE_ACTIVE : TOGGLE_INACTIVE}>Yes</button>
            <button type="button" id="furnished" value="false" onClick={onChange} className={!furnished ? TOGGLE_ACTIVE : TOGGLE_INACTIVE}>No</button>
          </div>
        </div>

        <div>
          <label htmlFor="address" className={LABEL_CLASS}>Address</label>
          <textarea id="address" value={address} onChange={onChange} className={INPUT_CLASS} placeholder="Full property address" rows={2} required />
        </div>

        <div>
          <label htmlFor="description" className={LABEL_CLASS}>Description</label>
          <textarea id="description" value={description} onChange={onChange} className={INPUT_CLASS} placeholder="Describe the property" rows={3} required />
        </div>

        <div>
          <label htmlFor="phone" className={LABEL_CLASS}>Contact Phone (WhatsApp)</label>
          <input type="tel" id="phone" value={phone} onChange={onChange} className={INPUT_CLASS} placeholder="10-digit mobile number" maxLength="10" minLength="10" required />
        </div>

        <div>
          <p className={LABEL_CLASS}>Offer / Discount</p>
          <div className="flex gap-3">
            <button type="button" id="offer" value="true" onClick={onChange} className={offer ? TOGGLE_ACTIVE : TOGGLE_INACTIVE}>Yes</button>
            <button type="button" id="offer" value="false" onClick={onChange} className={!offer ? TOGGLE_ACTIVE : TOGGLE_INACTIVE}>No</button>
          </div>
        </div>

        <div>
          <label htmlFor="regularprice" className={LABEL_CLASS}>Regular Price</label>
          <div className="flex items-center gap-3">
            <input type="number" id="regularprice" value={regularprice} onChange={onChange} className={INPUT_CLASS} placeholder="Price in ₹" min="5000" max="100000000" required />
            {type === 'rent' && <span className="whitespace-nowrap text-content-secondary dark:text-content-muted font-semibold">₹ / Month</span>}
          </div>
        </div>

        {offer && (
          <div>
            <label htmlFor="discountedprice" className={LABEL_CLASS}>Discounted Price</label>
            <div className="flex items-center gap-3">
              <input type="number" id="discountedprice" value={discountedprice} onChange={onChange} className={INPUT_CLASS} placeholder="Discounted price in ₹" min="5000" max="100000000" required />
              {type === 'rent' && <span className="whitespace-nowrap text-content-secondary dark:text-content-muted font-semibold">₹ / Month</span>}
            </div>
          </div>
        )}

        <div>
          <label htmlFor="images" className={LABEL_CLASS}>Images</label>
          <p className="text-xs text-content-muted mb-1">First image will be the cover. Max 6 images, each under 2MB.</p>
          <input type="file" id="images" onChange={onChange} className={INPUT_CLASS} multiple required accept=".jpg,.png,.jpeg,.webp" />
        </div>

        <button type="submit" className="w-full py-3 text-sm font-semibold text-white uppercase bg-primary hover:bg-primary-hover rounded-lg shadow-md transition duration-150">
          Create Listing
        </button>
      </form>
    </main>
  )
}

export default CreateListing
