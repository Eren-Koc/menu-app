import React from 'react'

const Loading = ({props}) => {
  return (
    <div id='loading-screen' className='w-full h-full bg-black/60 fixed top-0 left-0 flex flex-col gap-6 justify-center items-center'>
    <span className='text-white text-lg font-medium'>{props}</span>
    <div className="loader"></div>
 </div>
  )
}

export default Loading