import { useRef, useState } from "react"

import { createPortal } from "react-dom"
import Heading from "./Heading"
import { InfoTooltipIcon } from "../assets/icons/InfoTooltipIcon"

function TextWithTooltip({
  infoColor = "#969696",
  hoverOverText = "",
  hoverOverTextColor = "text-[#CFCFC]",
  expandedClassName = "",
  className = "",
  heading = "",
  isCustomHover = false,
  expandedTextWidth = "w-[600px]",
  children,
}) {
  const [show, setShow] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const hoverRef = useRef(null)
  return (
    <div ref={hoverRef} className={`  flex items-center gap-1 w-fit    `}>
      {heading ? (
        heading
      ) : (
        <>
          {isCustomHover ? (
            <p
              className={` text-[#CFCFCF] text-lg font-semibold leading-6 tracking-wider  ${className}`}
            >
              {hoverOverText}
            </p>
          ) : hoverOverText ? (
            <div className="">{hoverOverText}</div>
          ) : null}
        </>
      )}

      <div
        className="relative  "
        onMouseLeave={() => {
          setShow(false)
        }}
      >
        <InfoTooltipIcon
          color={infoColor}
          hoverOver={() => {
            if (hoverRef.current) {
              const rect = hoverRef.current.getBoundingClientRect()
              setTooltipPosition({
                top: rect.top + window.scrollY + 32, // Adjust for scroll position
                left: rect.left + rect.width - 65, // Right side of the element + some margin
              })

              setShow(true)
            }
          }}
          className="cursor-pointer"
        />
        {show &&
          createPortal(
            <div
              style={{
                position: "absolute",
                top: tooltipPosition.top,
                left: tooltipPosition.left,
                zIndex: 9999, // High z-index to make sure it appears on top
              }}
              className="absolute   flex     "
            >
              <div className=" ">
                <div className="absolute -top-2 left-12 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[9px] border-l-transparent border-r-transparent border-b-[#4F4F4F]"></div>

                <div
                  className={`bg-[#4F4F4F]  ${expandedTextWidth} text-lightBlack text-xs rounded-lg  py-2 px-3 ${expandedClassName} `}
                >
                  {children}
                </div>
              </div>
            </div>,
            document.getElementById("portal-root")
          )}
      </div>
    </div>
  )
}

export default TextWithTooltip
