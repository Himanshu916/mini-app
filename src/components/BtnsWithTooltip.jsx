import { useRef, useState } from "react"
import { createPortal } from "react-dom"

function BtnsWithTooltip({
  hoverOverText = "",
  expandedClassName = "",
  className = "",

  expandedTextWidth = "w-[600px]",
  children,
}) {
  const [show, setShow] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const hoverRef = useRef(null)
  return (
    <div ref={hoverRef} className={`  flex items-center gap-1 w-fit    `}>
      {hoverOverText && (
        <div
          className="relative  "
          onMouseLeave={() => {
            setShow(false)
          }}
          onMouseEnter={() => {
            if (hoverRef.current) {
              const rect = hoverRef.current.getBoundingClientRect()
              setTooltipPosition({
                top: rect.top + window.scrollY + 56, // Adjust for scroll position
                left: rect.left + rect.width - 150, // Right side of the element + some margin
              })

              setShow(true)
            }
          }}
        >
          {hoverOverText}
        </div>
      )}

      <div className="relative  ">
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

export default BtnsWithTooltip
