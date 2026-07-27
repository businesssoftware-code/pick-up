import React from 'react'
import Image from 'next/image'

const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="relative w-[179px] h-[179px]">
          <Image
            src="/gif/loading.gif"
            alt="loading"
            fill
            className="object-contain transform scale-[4]"
            priority
          />
        </div>
        <h1 className="text-neutralText mt-4 text-bodyRegular">Loading...</h1>
      </div>
    </div>
  )
}

export default Loading
