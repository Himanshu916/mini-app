import { useEffect, useRef } from "react"
import Overlay from "../../components/Overlay"

import modalOne from "../../assets/images/modalOne.png"
import modalThree from "../../assets/images/modalThree.png"

import monkeyWithPill from "../../assets/gifs/monkeyWithPill.gif"

import ImageCarousel from "./ImageCarousel"
const images = [
  {
    image: modalOne,
    imageClass: "w-full h-full object-cover ",
    heading: " 1. Choose a Landscape to Impact",
    subheading:
      " We have 10 collections spread across the world, each representing a region that needs regeneration",
  },
  {
    image: monkeyWithPill,
    imageClass: "w-full h-full object-contain pt-20 ",
    heading: "2. Mint a Red Pill, fund to transform it to Green",
    subheading:
      "immortalize your impact with these evolving NFTs, visualize your impact real time. ",
  },
  {
    image: modalThree,
    imageClass: "w-[80%] h-full object-cover mx-auto ",
    heading: "3. Rise to the top and unlock exclusive rewards",
    subheading: "Rise to the top, be your favourite chain’s flagbearer! ",
  },
]
function HomeModal({ close }) {
  const myRef = useRef({ close })

  useEffect(() => {
    function handleClickOutside(e) {
      // Close the modal if the click is outside the modal content
      if (myRef.current && !myRef.current.contains(e.target)) {
        close()
      }
    }

    // Add the event listener to close modal on outside click
    document.addEventListener("mousedown", handleClickOutside, true)

    // Clean up the event listener when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true)
    }
  }, [close])

  return (
    <Overlay>
      <div className="absolute rounded-lg left-[50%]     w-[90%] h-[80vh] bg-[#000] border border-[#2a2a2a]   translate-x-[-50%] translate-y-[-50%] top-[50%]">
        <div ref={myRef} className="relative w-full h-full">
          <button
            className=" bg-[#393939] absolute z-[9999] top-3 md:top-4 right-4  rounded-full  "
            onClick={() => {
              close()
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
            >
              <circle cx="15.5894" cy="15.5894" r="15.5894" fill="#353535" />
              <path
                d="M22.6211 9.22656L9.91269 21.935"
                stroke="#9B9B9B"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M21.8711 21.9336L9.16269 9.22519"
                stroke="#9B9B9B"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <ImageCarousel />
        </div>
      </div>
    </Overlay>
  )
}

export default HomeModal
