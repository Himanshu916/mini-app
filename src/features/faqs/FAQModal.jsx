import { useEffect, useRef } from "react"
import Overlay from "../../components/Overlay"
import FAQs from "./FAQs"

function FAQModal({ close }) {
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
    <Overlay isBlur={false}>
      <div
        style={{
          borderRadius: "8px",
          background: "rgba(96, 96, 96, 0.44)",
          backdropFilter: "blur(62.79999923706055px)",
        }}
        className="absolute rounded-lg left-[50%] p-6 w-[90%] max-h-[90vh] overflow-auto main   md:w-[40%]    border border-[#2a2a2a]    translate-x-[-50%] translate-y-[-50%] top-[50%]"
      >
        <div ref={myRef} className="relative w-full h-full">
          <button
            className="  absolute z-[99999] top-0 right-0  rounded-full  "
            onClick={() => {
              close()
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
            >
              <circle cx="15" cy="15" r="15" fill="#393939" />
              <path
                d="M20.5918 10L10.5914 20.0004"
                stroke="#F0F0F0"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M20 20L9.99964 9.99964"
                stroke="#F0F0F0"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <h1
            className="text-3xl mb-4 font-bold text-textHeading "
            style={{
              textShadow: "0px 0px 11.8px rgba(255, 255, 255, 0.59)",
            }}
          >
            Frequently Asked Questions
          </h1>
          <FAQs />
        </div>
      </div>
    </Overlay>
  )
}

export default FAQModal
