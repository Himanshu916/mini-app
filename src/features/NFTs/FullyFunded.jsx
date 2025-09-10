import React from "react"
import onboardingBg from "../../assets/onboardingBg.png"
import monkeyWithPill from "../../assets/gifs/monkeyWithPill.gif"
import { useNavigate } from "react-router-dom"
const FullyFunded = () => {
  const navigate = useNavigate()
  return (
    <div
      style={{
        backgroundImage: `url(${onboardingBg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
      className="bg-fixed w-screen    mx-auto h-full"
    >
      <div className="w-full h-full ">
        <div className="flex flex-col w-full h-full relative items-center justify-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <p className="text-3xl  md:text-5xl w-full text-center    font-semibold">
              NFT Fully Funded!
            </p>
            <button
              className="    rounded-full  "
              onClick={() => {
                navigate("/fund")
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
          </div>

          <div className=" w-[90%] lg:w-[54%] flex items-center justify-center ">
            <img
              className={` w-[90%] lg:w-[54%]  `}
              src={monkeyWithPill}
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FullyFunded
