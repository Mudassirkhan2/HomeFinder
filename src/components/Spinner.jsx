import React from 'react'
import spinner from '../assets/spinner.svg'
const Spinner = () => {
  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <img src={spinner} alt="Loading..."  className='h-24 mix-blend-color-burn'/>
    </div>
  )
}

export default Spinner
