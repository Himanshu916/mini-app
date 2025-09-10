import React, { useEffect, useRef, useState } from "react"
import metamaskImage from "../../assets/images/metamaskImage.png"
import GradientBorder from "../../components/GradientBorder"

const WalletDropdown = ({
  text,
  open,
  setOpen,
  onOpen,
  image,
  fn,
  width = "w-full",
}) => {
  const btnRef = useRef()
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (btnRef.current && !btnRef.current.contains(event.target)) {
  //       setOpen(null) // Close the dropdown if clicked outside
  //     }
  //   }

  //   document.addEventListener("mousedown", handleClickOutside)

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside)
  //   }
  // }, [setOpen])

  return (
    <div className="relative w-[10.5rem] md:w-[12.5rem]  " ref={btnRef}>
      <div className="flex items-center justify-center">
        <GradientBorder
          radiusBorder={".60rem"}
          color2={"rgba(80, 108, 102, 0)"}
          color1={"rgba(105, 159, 132, 1)"}
          isNoBottomRadius={open === text}
          width="w-full"
          bg="bg-[#1E3D36]"
        >
          <button
            onClick={() => {
              if (open && open === text) {
                setOpen("")
              } else setOpen(text)
            }}
            className=" px-4 py-2 flex items-center  gap-2 w-full  "
          >
            <div className="  rounded-full">
              <img className="w-[1.2rem] h[1.2rem] " src={image} alt="" />
            </div>

            <span className="text-xs flex-grow">
              {false ? (
                <span className="flex items-center justify-between gap-4">
                  <span>
                    {account?.slice(0, 4)}...{account?.slice(-4)}
                  </span>

                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="8"
                      viewBox="0 0 10 8"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0.412691 3.18382L4.02209 6.79322C4.56559 7.33672 5.44356 7.33672 5.98706 6.79322L9.59646 3.18382C10.4605 2.30586 9.8473 0.800781 8.60701 0.800781L1.40214 0.800781C0.147908 0.800781 -0.465272 2.30586 0.412691 3.18382Z"
                        fill="#969696"
                      />
                    </svg>
                  </span>
                </span>
              ) : (
                <span className="flex items-center justify-between w-full">
                  <span>Connect {text} </span>
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="8"
                      viewBox="0 0 10 8"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0.412691 3.18382L4.02209 6.79322C4.56559 7.33672 5.44356 7.33672 5.98706 6.79322L9.59646 3.18382C10.4605 2.30586 9.8473 0.800781 8.60701 0.800781L1.40214 0.800781C0.147908 0.800781 -0.465272 2.30586 0.412691 3.18382Z"
                        fill="#969696"
                      />
                    </svg>
                  </span>
                </span>
              )}
            </span>
          </button>
        </GradientBorder>
      </div>

      <div
        onClick={() => {
          if (typeof fn === "function") fn(text)
        }}
        className={`z-[2000]   ${
          open === text ? "absolute " : "hidden"
        } bg-[#1E3D36] w-full  main rounded-lg rounded-t-none  shadow `}
      >
        {onOpen}
      </div>
    </div>
  )
}

export default WalletDropdown
