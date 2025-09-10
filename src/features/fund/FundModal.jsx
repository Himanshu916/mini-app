import React, { useEffect, useRef, useState } from "react"
import Overlay from "../../components/Overlay"

function FundModal({ onClose }) {
  const modalRef = useRef(null)

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose()
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <Overlay>
      <div
        ref={modalRef}
        className="absolute rounded-lg left-[50%] p-9 bg-white translate-x-[-50%] translate-y-[-50%] top-[50%]"
      >
        <div className="flex justify-end">
          <button onClick={onClose} className="text-black">
            Close
          </button>
        </div>
        <p className="text-black">Fund Now</p>
      </div>
    </Overlay>
  )
}

export default FundModal
