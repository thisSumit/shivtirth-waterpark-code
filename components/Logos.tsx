import React from 'react'

const Logos = () => {
  return (
    <div className="w-full bg-white">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-4 px-4 py-4">
        <p className="text-xs uppercase tracking-[0.2em] text-black">Approved & Certified by</p>
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-10">
          <img
            src="/mah.png"
            alt="Maharashtra Tourism"
            className="h-12 md:h-18 w-auto object-contain"
          />
          <img
            src="/lokmat.png"
            alt="ISO Certification"
            className="h-12 md:h-18 w-auto object-contain"
          />
          <img
            src="/iso1.png"
            alt="ISO Certification"
            className="h-12 md:h-18 w-auto object-contain"
          />
          <img
            src="/sakal.png"
            alt="ISO Certification"
            className="h-12 md:h-18 w-auto object-contain"
          />
          <img
            src="/mart.png"
            alt="ISO Certification"
            className="h-12 md:h-18 w-auto object-contain"
          />
        </div>
      </div>
    </div>
  )
}

export default Logos