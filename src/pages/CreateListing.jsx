import { useState } from "react"
import Spinner from "../components/Spinner"
import { toast } from "react-toastify"
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage"
import { getAuth } from "firebase/auth"
import{v4 as uuidv4} from "uuid"
import { serverTimestamp ,addDoc ,collection} from "firebase/firestore"
import { db } from "../firebase"
import { useNavigate } from "react-router-dom"

const CreateListing = () => {
  const navigate = useNavigate()
  const auth = getAuth()
  const [loading, setLoading] = useState(false)  
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
    images:{}
  })
  const { type,
    name ,
    bedrooms ,
    bathrooms,
    parking,
    furnished ,
    address,
    description,
    offer,
    regularprice,
    discountedprice,
    images
  } = formdata
async  function onChange(e) {
    let boolean =null;
    
    if(e.target.value==="true"){
      boolean=true
    }
    else if(e.target.value==="false"){
      boolean=false
    }
    // for images
    if (e.target.files){
      setFormdata((prevState)=>({
        ...prevState,
        images:e.target.files
      }))
    }
    // for other inputs
    if(!e.target.files){
      setFormdata((prevState)=>({
        ...prevState,
        [e.target.id]:boolean ?? e.target.value
      }))
    }
  }
async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    // + is used to convert string to number
    if(+discountedprice >= +regularprice){
      setLoading(false)
      toast.error("Discounted price cannot be greater than regular price")
      return 
    }
    if(offer && discountedprice === 0){
      setLoading(false)
      toast.error("Discounted price cannot be zero")
      return 
    }
    if(images.length > 6){
      setLoading(false)
      toast.error("You can upload maximum 6 images")
      return
    }
    // function to store images in firebase storage
    async function storeImage(image){
      return new Promise((resolve, reject) => {
          const storage = getStorage()
          // filename = uid-imageName-uuid
          // uuid is used to make filename unique if user uploads same image
          const filename =`$(auth.currentUser.uid)-${image.name}-${uuidv4()}`
          // store image in firebase storage
          const storageRef = ref(storage, `images/${filename}`)
          // upload image
          const uploadTask = uploadBytesResumable(storageRef, image)
          // snapshot is used to get progress of image upload
          uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          }
          ,(error) => {
            reject(error)
          }
          // download url is used to get url of image stored in firebase storage
          ,() => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL)
            })
          }
          )
      });
    }
    // imgageUrls is array of urls of images stored in firebase storage
    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      setLoading(false);
      toast.error("Images not uploaded");
      return;
    });
  
    // formdatacopy to store data in firestore
    const formDatacopy = {
      ...formdata,
      imgUrls,
      timeStamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
    };
    delete formDatacopy.images;
    // if offer is false then delete discounted price
    !formDatacopy.offer && delete formDatacopy.discountedprice;

    // add listing to firestore
      const docRef = await addDoc(collection(db, "listings"), formDatacopy);
      setLoading(false)
      toast.success("Listing created successfully")
      navigate(`/category/${formDatacopy.type}/${docRef.id}`)
  }

  if(loading){
    return <Spinner/>
  }
  return (
    <main className='max-w-md px-2 mx-auto'>
        <h1 className='mt-6 text-3xl font-bold text-center'>Create a Listing </h1>
        <form onSubmit={onSubmit} >
          <p className='mt-6 text-lg font-semibold '>Sell / Rent </p>
          <div className='flex '>
            <button type='button' id='type' value="sale" onClick={onChange} className={`px-7 py-3 mr-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-xl transition duration-100 ease-in-out w-full ${
              type === 'rent' ? 'bg-gray-200 text-gray-500' : 'bg-slate-600 text-gray-900'
            }`}>
              sell
            </button>
            <button type='button' id='type' value="rent" onClick={onChange} className={`px-7 py-3 ml-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-xl transition duration-100 ease-in-out w-full ${
              type === 'sale' ? 'bg-gray-200 text-gray-500' : 'bg-slate-600 text-gray-900'
            }`}>
              rent
            </button>
          </div>
          <div className='mt-6'>
            <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
              Name
            </label>
            <input type='text' name='name' id='name' value={name} onChange={onChange} className='block w-full mt-1 text-xl border-gray-300 rounded-md shadow-sm focus:ring-slate-600 focus:border-slate-600 sm:text-sm'placeholder="Name of the House" maxLength="32"minLength="10" required />
          </div>
          <div className='flex mt-6 space-x-2'>
            {/* label for beds  */}
            <div>
              <label htmlFor='bedrooms' className='block text-sm font-medium text-gray-700'>  
                Beds
              </label>
              <input type='number' name='bedrooms' id='bedrooms' value={bedrooms} onChange={onChange} className='block w-full mt-1 text-xl transition duration-150 ease-in-out border-gray-300 rounded-md shadow-sm focus:ring-slate-600 focus:border-slate-600 sm:text-sm'placeholder="Beds" maxLength="50" minLength="1" required />    
            </div>
            {/* label for baths  */}
            <div>
              <label htmlFor='bathrooms' className='block text-sm font-medium text-gray-700'>  
                Baths
                </label> 
              <input type='number' name='bathrooms' id='bathrooms' value={bathrooms} onChange={onChange} className='block w-full mt-1 text-xl transition duration-150 ease-in-out border-gray-300 rounded-md shadow-sm focus:ring-slate-600 focus:border-slate-600 sm:text-sm'placeholder="Beds" maxLength="50" minLength="1" required />    
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
          
          <p className='mt-3 text-lg font-semibold '>Offer </p>
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
          <div className="flex flex-col items-start mt-3 mb-2">
            <label htmlFor='regularprice' className='block text-xl font-medium text-gray-700'>
                      Regular  Price
                    </label>
            <div className="flex items-center justify-center space-x-6">
              <input type='number' name='regularprice' id='regularprice' value={regularprice} onChange={onChange} className='block w-full mt-1 text-lg transition duration-150 ease-in-out border-gray-300 rounded-md shadow-sm focus:ring-slate-600 focus:border-slate-600 sm:text-sm'placeholder="Price" min="5000"
              max="100000" required />
              {
              type === 'rent' && (
                <div>
                  <p className="w-full text-md whitespace-nowrap ">  <span className="text-xl font-semibold"> &#8377;</span>/Month</p>
                </div>
                ) }
            </div>
          </div>
          {
            offer && (
              <div className="flex flex-col items-start mt-3 mb-2">
              <label htmlFor='discountedprice' className='block text-xl font-medium text-gray-700'>
              Discounted Price
                      </label>
              <div className="flex items-center justify-center space-x-6">
                <input type='number' name='discountedprice' id='discountedprice' value={discountedprice} onChange={onChange} className='block w-full mt-1 text-lg transition duration-150 ease-in-out border-gray-300 rounded-md shadow-sm focus:ring-slate-600 focus:border-slate-600 sm:text-sm'placeholder="Price" min="5000"
                max="100000" required={offer} />
                {
                type === 'rent' && (
                  <div>
                    <p className="w-full text-md whitespace-nowrap "><span className="text-xl font-semibold"> &#8377;</span> /Month</p>
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