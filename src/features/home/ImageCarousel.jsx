import modalOne from "../../assets/images/modalOne.png"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import ModalHeadingAndSubHeading from "./ModalHeadingAndSubHeading"
import modalThree from "../../assets/images/modalThree.png"
import modalThreeMobile from "../../assets/images/modalThreeMobile.png"
import modThree from "../../assets/images/modThree.png"
import monkeyWithPill from "../../assets/gifs/monkeyWithPill.gif"
const images = [
  {
    image: modalOne,
    imageClass: "w-full h-full object-cover ",
    imageMobile: modalOne,
    imageClassMobile: "w-full h-full object-cover ",
    heading: " 1. Choose a Landscape to Impact",
    subheading:
      " We have 10 collections spread across the world, each representing a region that needs regeneration",
  },
  {
    image: monkeyWithPill,
    imageClass: "w-full h-full object-contain pt-20 ",
    imageMobile: monkeyWithPill,
    imageClassMobile: "w-full h-full object-contain pt-20 ",
    heading: "2. Mint a Red Pill, fund to transform it to Green",
    subheading:
      "immortalize your impact with these evolving NFTs, visualize your impact real time. ",
  },
  {
    image: modalThree,
    imageMobile: modalThreeMobile,
    imageClass: "w-[100%]  h-full object-cover  mx-auto ",
    imageClassMobile: "w-[100%] pl-3 pr-3 h-full object-contain  mx-auto ",
    heading: "3. Rise to the top and unlock exclusive rewards",
    subheading: "Rise to the top, be your favourite chain’s flagbearer! ",
  },
]

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="relative w-full h-full  mx-auto overflow-hidden rounded-lg">
      {/* Image Container */}
      <div className="relative w-full h-full">
        {images.map(
          (
            {
              image,
              imageMobile,
              imageClass,
              imageClassMobile,
              heading,
              subheading,
            },
            index
          ) => (
            <div>
              <div
                className={`w-full flex flex-col items-end justify-end absolute top-0 left-0 z-[10]   h-full transition-opacity duration-500 ease-in-out ${
                  index === currentIndex ? "opacity-100" : "hidden"
                }`}
              >
                <ModalHeadingAndSubHeading
                  heading={heading}
                  subheading={subheading}
                />
              </div>

              {window.innerWidth >= 1024 ? (
                <img
                  key={index}
                  src={image}
                  alt={`Slide ${index + 1}`}
                  className={`absolute ${imageClass} transition-opacity duration-500 z-[9] ease-in-out ${
                    index === currentIndex ? "opacity-100" : "hidden"
                  }`}
                />
              ) : (
                <img
                  key={index}
                  src={imageMobile}
                  alt={`Slide ${index + 1}`}
                  className={`absolute ${imageClassMobile} transition-opacity duration-500 z-[9] ease-in-out ${
                    index === currentIndex ? "opacity-100" : "hidden"
                  }`}
                />
              )}
            </div>
          )
        )}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#393939] p-2 rounded-full z-[999] text-white hover:bg-[#333]"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#393939] p-2 rounded-full z-[999] text-white hover:bg-[#333]"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[999] flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-white scale-125" : "bg-gray-500"
            }`}
          ></button>
        ))}
      </div>
    </div>
  )
}
