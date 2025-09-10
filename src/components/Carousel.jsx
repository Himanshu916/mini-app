import { useState } from "react"
import LandscapeLayout from "./LandscapeLayout"
import ArrowLeft from "../assets/icons/ArrowLeft"
import ArrowRight from "../assets/icons/ArrowRight"
// import ArrowLeft from "../assets/icons/ArrowLeft"
// import ArrowRight from "../assets/icons/ArrowRight"

const Carousel = ({
  landscapes,
  render,
  shouldDisplayBtns = true,
  className,
  initialIndex,
  left = "left-8 md:left-32",
  top = "top-1/3 md:top-1/2",
  right = "right-8 md:right-32",
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  const goToNext = (callback, num) => {
    setCurrentIndex((prevIndex) => {
      if (typeof callback === "function")
        callback((prevIndex + 1) % landscapes.length)
      return (prevIndex + 1) % landscapes.length
    })
  }

  const goToSpecific = (num) => {
    setCurrentIndex(num)
  }

  const goToPrev = (callback = () => {}, num) => {
    setCurrentIndex((prevIndex) => {
      if (typeof callback === "function")
        callback(prevIndex === 0 ? landscapes.length - 1 : prevIndex - 1)
      return prevIndex === 0 ? landscapes.length - 1 : prevIndex - 1
    })
  }

  const goToIndex = (index) => {
    setCurrentIndex(index)
  }

  return (
    <div className={`${className}`}>
      {render(landscapes, currentIndex, goToPrev, goToNext, goToSpecific)}

      <button
        onClick={goToPrev}
        className={` ${
          shouldDisplayBtns ? "absolute" : "hidden"
        }  absolute bg-[#393939] ${left} ${top}   transform -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white rounded-full`}
      >
        <ArrowLeft />
      </button>
      <button
        onClick={goToNext}
        className={`${
          shouldDisplayBtns ? "absolute" : "hidden"
        } bg-[#393939] ${right}  ${top} transform -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white rounded-full`}
      >
        <ArrowRight />
      </button>
    </div>
  )
}

export default Carousel
