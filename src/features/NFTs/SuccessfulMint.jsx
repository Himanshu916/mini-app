import React, { useEffect, useRef } from "react"
import mintedAnimation from "../../assets/gifs/mintedAnimation.gif"
import Overlay from "../../components/Overlay"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { isMobile } from "../../helpers/isMobile"

const SuccessfulMint = () => {
  const myRef = useRef()
  const navigate = useNavigate()
  useEffect(function () {
    // setTimeout(function () {
    //   setIsMinted(false)
    //   setIsOpen(false)
    //   navigate("/miner")
    // }, 5000)
    const timeoutId = setTimeout(() => {
      //   close()

      if (isMobile) {
        navigate("/")
      } else {
        navigate("/fund?from=minting")
      }
    }, 5000)
    return () => clearTimeout(timeoutId)
  }, [])
  return (
    <Overlay>
      <div
        className={`absolute rounded-lg left-[50%] p-6 w-[90%]   md:w-[40%] ${
          true ? " bg-[rgba(52,53,52)] backdrop-blur-3xl" : "bg-[#1C1C1C] "
        }  border border-[#2a2a2a]   translate-x-[-50%] translate-y-[-50%] top-[50%]`}
      >
        <div ref={myRef} className="relative w-full ">
          <button
            className="  absolute z-[9999] top-0 right-0  rounded-full  "
            onClick={() => {
              navigate("/fund?from=minting")
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

          <div className="flex flex-col relative items-center    justify-center">
            <div className="relative w-full h-[32.3125rem] ">
              {/* Background layer with opacity */}
              <div className="absolute inset-0 bg-nft-gradient opacity-15 pointer-events-none z-0"></div>

              {/* Content layer */}
              <div className="absolute top-[50%] w-full left-[50%]  translate-x-[-50%] translate-y-[-50%] z-10 text-center">
                <div className="relative w-full">
                  <div className="flex flex-col items-center">
                    <p className="text-3xl absolute w-full top-0 left-[50%] translate-x-[-50%] md:text-5xl   font-semibold">
                      New NFT Minted
                    </p>
                    <img
                      className="w-[23.375rem]"
                      src={mintedAnimation}
                      alt="minted-animation"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Overlay>
  )
}

export default SuccessfulMint
