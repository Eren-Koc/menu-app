import React from 'react'
import { IoMdArrowRoundBack } from "react-icons/io";
export default function notFound() {
  return (
    <div className='w-full h-screen flex justify-center gap-3 flex-col items-center '>
      <span className='text-lg'>Bu sayfa bulunamadı.</span>
     <a href={"/"}><button className='p-2 bg-blue-600 text-white rounded-md flex gap-2 items-center justify-center'>
        <IoMdArrowRoundBack/>
        <span>Geri dön</span>
      </button></a> 
      
    </div>
  )
}
