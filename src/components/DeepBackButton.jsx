import React from "react"
import { useNavigate } from "react-router-dom"

const DeepBackButton = ({ className = "top-[50%] -left-14" }) => {
  const navigate = useNavigate()
  return (
    <button
      className={` bg-[#393939]  absolute z-[99999999]   translate-y-[-50%]  rounded-full ${className}  `}
      onClick={() => {
        navigate(-1)
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="38"
        height="38"
        viewBox="0 0 38 38"
        fill="none"
      >
        <circle cx="19" cy="19" r="19" fill="#262626" />
        <path
          d="M23 12.416L21.4962 11L13 19L21.4962 27L23 25.584L16.0076 19L23 12.416Z"
          fill="#F0F0F0"
        />
      </svg>
    </button>
  )
}

export default DeepBackButton
