import { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { FaMapMarkerAlt, FaBed, FaBath } from 'react-icons/fa'
import { MdSquareFoot } from 'react-icons/md'
import { EditListingFormSkeleton } from '../components/ListingCardSkeleton'
import api from '../utils/api'

const PROPERTY_TYPES = ['house', 'apartment', 'villa', 'plot', 'pg']

const INPUT_CLASS =
  'w-full border border-surface-border dark:border-dark-border rounded-xl px-4 py-2.5 text-sm text-content-primary dark:text-white dark:bg-dark-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition placeholder:text-content-muted'
const LABEL_CLASS = 'block text-sm font-semibold text-content-secondary dark:text-content-muted mb-1.5'

const SectionCard = ({ children }) => (
  <div className="bg-surface dark:bg-dark-surface rounded-2xl border border-surface-border dark:border-dark-border p-6">
    {children}
  </div>
)

const SectionHeader = ({ number, title }) => (
  <div className="flex items-center gap-3 mb-5">
    <span className="w-7 h-7 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
      {number}
    </span>
    <h2 className="text-base font-bold text-content-primary dark:text-white">{title}</h2>
  </div>
)

const EditListing = () => {
  const navigate = useNavigate()
  const params = useParams()
  const fileInputRef = useRef(null)

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formdata, setFormdata] = useState(null)

  const [existingImgs, setExistingImgs] = useState([])
  const [newFiles, setNewFiles] = useState([])
  const [newPreviews, setNewPreviews] = useState([])
  const [deletingUrl, setDeletingUrl] = useState(null)

  useEffect(() => {
    api.get(`/listings/${params.listingId}`)
      .then((res) => {
        const listing = res.data.listing
        setFormdata(listing)
        setExistingImgs(listing.imgUrls || [])
      })
      .catch(() => { toast.error('Listing not found'); navigate('/') })
      .finally(() => setLoading(false))
  }, [params.listingId])

  function setField(id, value) {
    setFormdata((prev) => ({ ...prev, [id]: value }))
  }

  function onChange(e) {
    let val = e.target.value
    if (val === 'true') val = true
    else if (val === 'false') val = false
    setFormdata((prev) => ({ ...prev, [e.target.id]: val }))
  }

  async function handleDeleteExisting(url) {
    setDeletingUrl(url)
    try {
      await api.delete(`/listings/${params.listingId}/images`, { data: { imageUrl: url } })
      setExistingImgs((prev) => prev.filter((u) => u !== url))
    } catch {
      toast.error('Could not delete image')
    } finally {
      setDeletingUrl(null)
    }
  }

  function handleImageAdd(e) {
    const files = Array.from(e.target.files)
    const total = existingImgs.length + newFiles.length
    if (total + files.length > 6) {
      toast.error('Maximum 6 images allowed')
      e.target.value = ''
      return
    }
    const tooLarge = files.find((f) => f.size > 2 * 1024 * 1024)
    if (tooLarge) { toast.error('Each image must be under 2 MB'); e.target.value = ''; return }

    setNewFiles((prev) => [...prev, ...files])
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (ev) => setNewPreviews((prev) => [...prev, ev.target.result])
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  function removeNewImage(i) {
    setNewFiles((prev) => prev.filter((_, idx) => idx !== i))
    setNewPreviews((prev) => prev.filter((_, idx) => idx !== i))
  }

  async function onSubmit(e) {
    e.preventDefault()
    const { offer, discountedprice, regularprice } = formdata

    if (offer && +discountedprice >= +regularprice) {
      toast.error('Discounted price must be less than regular price')
      return
    }
    if (existingImgs.length + newFiles.length === 0) {
      toast.error('At least one photo is required')
      return
    }

    setSubmitting(true)
    try {
      const fd = new FormData()
      const { _id, owner, __v, avgRating, reviewCount, createdAt, updatedAt, imgUrls, ...fields } = formdata
      Object.entries(fields).forEach(([k, v]) => {
        if (v !== undefined && v !== null) fd.append(k, v)
      })
      if (!formdata.offer) fd.delete('discountedprice')
      newFiles.forEach((f) => fd.append('images', f))

      const res = await api.put(`/listings/${params.listingId}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      toast.success('Listing updated!')
      navigate(`/category/${res.data.listing.type}/${res.data.listing._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update listing')
    }
    setSubmitting(false)
  }

  if (loading || !formdata) return <EditListingFormSkeleton />

  const {
    type, propertyType, name, bedrooms, bathrooms, area,
    parking, furnished, address, description, phone, offer, regularprice, discountedprice,
  } = formdata

  const totalImgs = existingImgs.length + newFiles.length
  const coverSrc = existingImgs[0] ?? newPreviews[0]
  const previewPrice = regularprice
    ? `₹${Number(regularprice).toLocaleString('en-IN')}${type === 'rent' ? '/mo' : ''}`
    : '₹ —'

  return (
    <main className="min-h-screen bg-surface-secondary dark:bg-dark-bg pb-16">
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-content-primary dark:text-white">Edit listing</h1>
          <p className="text-sm text-content-secondary dark:text-content-muted mt-1">
            Update your property details. Photo deletions take effect immediately.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_268px] gap-6 items-start">

          {/* ── Form ── */}
          <motion.form
            onSubmit={onSubmit}
            className="space-y-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* 1 · Photos */}
            <SectionCard>
              <SectionHeader number="1" title="Photos" />
              <p className="text-xs text-content-muted mb-4">
                Click × to delete a photo from Cloudinary immediately. Add new photos with the + button. Max 6 total.
              </p>
              <div className="flex flex-wrap gap-3">

                {existingImgs.map((url, i) => {
                  const isDeleting = deletingUrl === url
                  return (
                    <div
                      key={url}
                      className={`relative w-24 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-opacity ${
                        isDeleting
                          ? 'border-red-400 opacity-50'
                          : 'border-surface-border dark:border-dark-border'
                      }`}
                    >
                      <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                      {i === 0 && !isDeleting && (
                        <span className="absolute top-1 left-1 bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          COVER
                        </span>
                      )}
                      {isDeleting ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleDeleteExisting(url)}
                          className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center text-xs leading-none hover:bg-red-600 transition"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  )
                })}

                {newPreviews.map((src, i) => (
                  <div
                    key={`new-${i}`}
                    className="relative w-24 h-20 rounded-xl overflow-hidden border-2 border-dashed border-primary flex-shrink-0"
                  >
                    <img src={src} alt={`New photo ${i + 1}`} className="w-full h-full object-cover" />
                    <span className="absolute top-1 left-1 bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      NEW
                    </span>
                    <button
                      type="button"
                      onClick={() => removeNewImage(i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center text-xs leading-none hover:bg-black/80 transition"
                    >
                      ×
                    </button>
                  </div>
                ))}

                {totalImgs < 6 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-24 h-20 rounded-xl border-2 border-dashed border-surface-border dark:border-dark-border flex flex-col items-center justify-center gap-1 text-content-muted hover:border-primary hover:text-primary transition-colors flex-shrink-0"
                  >
                    <span className="text-2xl leading-none font-light">+</span>
                    <span className="text-xs font-medium">Add photo</span>
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  multiple
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={handleImageAdd}
                />
              </div>
              <p className="text-xs text-content-muted mt-3">{totalImgs} of 6 photos</p>
            </SectionCard>

            {/* 2 · Property details */}
            <SectionCard>
              <SectionHeader number="2" title="Property details" />
              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className={LABEL_CLASS}>Listing title</label>
                  <input
                    type="text"
                    id="name"
                    value={name || ''}
                    onChange={onChange}
                    placeholder="e.g. Spacious 3 BHK with sea view"
                    maxLength="32"
                    minLength="10"
                    required
                    className={INPUT_CLASS}
                  />
                </div>

                <div>
                  <p className={LABEL_CLASS}>Property type</p>
                  <div className="flex flex-wrap gap-2">
                    {PROPERTY_TYPES.map((pt) => (
                      <button
                        key={pt}
                        type="button"
                        id="propertyType"
                        value={pt}
                        onClick={onChange}
                        className={`px-4 py-2 text-sm font-semibold rounded-xl border transition ${
                          propertyType === pt
                            ? 'bg-primary text-white border-primary'
                            : 'bg-surface dark:bg-dark-surface border-surface-border dark:border-dark-border text-content-secondary dark:text-content-muted hover:bg-surface-secondary'
                        }`}
                      >
                        {pt === 'pg' ? 'PG' : pt.charAt(0).toUpperCase() + pt.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className={LABEL_CLASS}>Listing for</p>
                  <div className="flex w-fit rounded-xl border border-surface-border dark:border-dark-border overflow-hidden">
                    {[['sale', 'For Sale'], ['rent', 'For Rent']].map(([val, label], i) => (
                      <button
                        key={val}
                        type="button"
                        id="type"
                        value={val}
                        onClick={onChange}
                        className={`px-6 py-2.5 text-sm font-semibold transition ${i > 0 ? 'border-l border-surface-border dark:border-dark-border' : ''} ${
                          type === val
                            ? 'bg-primary text-white'
                            : 'bg-surface dark:bg-dark-surface text-content-secondary dark:text-content-muted hover:bg-surface-secondary'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: 'bedrooms', label: 'Bedrooms', value: bedrooms },
                    { id: 'bathrooms', label: 'Bathrooms', value: bathrooms },
                  ].map(({ id, label, value }) => (
                    <div key={id}>
                      <label htmlFor={id} className={LABEL_CLASS}>{label}</label>
                      <input
                        type="number"
                        id={id}
                        value={value ?? 1}
                        onChange={onChange}
                        min="1"
                        max="50"
                        required
                        className={INPUT_CLASS}
                      />
                    </div>
                  ))}
                  <div>
                    <label htmlFor="area" className={LABEL_CLASS}>Area (sqft)</label>
                    <input
                      type="number"
                      id="area"
                      value={area || ''}
                      onChange={onChange}
                      placeholder="1450"
                      min="100"
                      required
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className={LABEL_CLASS}>Address</label>
                  <input
                    type="text"
                    id="address"
                    value={address || ''}
                    onChange={onChange}
                    placeholder="Society, area, city, PIN"
                    required
                    className={INPUT_CLASS}
                  />
                </div>

                <div>
                  <label htmlFor="description" className={LABEL_CLASS}>Description</label>
                  <textarea
                    id="description"
                    value={description || ''}
                    onChange={onChange}
                    placeholder="Describe the property…"
                    rows={4}
                    required
                    className={`${INPUT_CLASS} resize-none`}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className={LABEL_CLASS}>Contact phone (WhatsApp)</label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone || ''}
                    onChange={onChange}
                    placeholder="10-digit mobile number"
                    maxLength="10"
                    minLength="10"
                    required
                    className={INPUT_CLASS}
                  />
                </div>
              </div>
            </SectionCard>

            {/* 3 · Pricing */}
            <SectionCard>
              <SectionHeader number="3" title="Pricing" />
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="regularprice" className={LABEL_CLASS}>
                      {type === 'rent' ? 'Rent / month (₹)' : 'Sale price (₹)'}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-content-muted text-sm select-none">₹</span>
                      <input
                        type="number"
                        id="regularprice"
                        value={regularprice || ''}
                        onChange={onChange}
                        min="5000"
                        max="100000000"
                        required
                        className={`${INPUT_CLASS} pl-7`}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="discountedprice" className="text-sm font-semibold text-content-secondary dark:text-content-muted">
                        Offer price (₹)
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={!!offer}
                          onChange={(e) => setField('offer', e.target.checked)}
                          className="accent-primary w-4 h-4 rounded"
                        />
                        <span className="text-xs text-content-muted">Enable</span>
                      </label>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-content-muted text-sm select-none">₹</span>
                      <input
                        type="number"
                        id="discountedprice"
                        value={discountedprice || ''}
                        onChange={onChange}
                        placeholder="Discounted price"
                        min="5000"
                        disabled={!offer}
                        className={`${INPUT_CLASS} pl-7 ${!offer ? 'opacity-50 cursor-not-allowed' : ''}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-5">
                  {[
                    { id: 'parking', checked: !!parking, label: 'Parking available' },
                    { id: 'furnished', checked: !!furnished, label: 'Furnished' },
                  ].map(({ id, checked, label }) => (
                    <label key={id} className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => setField(id, e.target.checked)}
                        className="accent-primary w-4 h-4 rounded"
                      />
                      <span className="text-sm font-semibold text-content-secondary dark:text-content-muted">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </SectionCard>

            {/* Submit */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3.5 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl shadow-btn hover:shadow-btn-hover transition text-sm disabled:opacity-60"
              >
                {submitting ? 'Saving…' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3.5 border border-surface-border dark:border-dark-border text-content-secondary dark:text-content-muted hover:bg-surface-secondary dark:hover:bg-dark-bg font-semibold rounded-xl transition text-sm"
              >
                Cancel
              </button>
            </div>
          </motion.form>

          {/* ── Live preview sidebar ── */}
          <motion.div
            className="lg:sticky lg:top-6 space-y-3"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.12 }}
          >
            <p className="text-xs font-bold text-content-muted uppercase tracking-widest">Live Preview</p>

            <div className="bg-surface dark:bg-dark-surface rounded-2xl border border-surface-border dark:border-dark-border overflow-hidden shadow-lift">
              <div className="relative h-44 bg-surface-secondary dark:bg-dark-bg">
                {coverSrc ? (
                  <img src={coverSrc} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-content-muted text-xs">
                    No photos
                  </div>
                )}
                <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                  <span className="bg-accent text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                    For {type === 'rent' ? 'Rent' : 'Sale'}
                  </span>
                  <span className="bg-primary text-white text-[10px] font-bold px-2.5 py-1 rounded-full capitalize">
                    {propertyType === 'pg' ? 'PG' : propertyType}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <p className="font-bold text-content-primary dark:text-white text-sm leading-snug mb-1 line-clamp-2">
                  {name || 'Listing title'}
                </p>
                <p className="flex items-center gap-1 text-xs text-content-secondary dark:text-content-muted mb-2 truncate">
                  <FaMapMarkerAlt className="text-green-500 text-xs flex-shrink-0" />
                  {address || 'Property address, city'}
                </p>
                <p className="text-base font-bold text-accent mb-3 font-Bellefair">{previewPrice}</p>
                <div className="flex items-center gap-3 text-xs text-content-secondary dark:text-content-muted border-t border-surface-border dark:border-dark-border pt-3">
                  <span className="flex items-center gap-1"><FaBed className="text-content-muted" /> {bedrooms || '—'} Beds</span>
                  <span className="flex items-center gap-1"><FaBath className="text-content-muted" /> {bathrooms || '—'} Baths</span>
                  {area && <span className="flex items-center gap-1"><MdSquareFoot className="text-content-muted" /> {area} sqft</span>}
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </main>
  )
}

export default EditListing
