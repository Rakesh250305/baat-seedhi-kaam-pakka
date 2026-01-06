import React from 'react'

export default function Button({ name, subtitle }) {
  return (
    <button className="
      bg-blue-600 hover:bg-blue-700 
      text-white 
      rounded-xl 
      m-2 p-2
      w-full sm:w-[20rem] lg:w-[28rem]
      h-[6rem] sm:h-[8rem] lg:h-[12rem]
      flex flex-col justify-center items-center
      transition duration-300 ease-in-out
      shadow-lg hover:scale-105
    ">
      <span className="text-lg sm:text-2xl lg:text-4xl font-bold">
        {name}
      </span>
      <span className="text-sm sm:text-lg lg:text-xl opacity-80">
        {subtitle}
      </span>
    </button>
  )
}
