import { ArrowRight } from "lucide-react"
import React, { useState } from "react"
import Loader from "./Loader"

const StatsCardTimer = ({
  label = "IP earned till now",
  stats = 0,
  symbol = "",
  applyHover = false,
  className,
  loading,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const handleHover = (state) => {
    setIsHovered(state)
  }

  return (
    <div
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      onClick={onClick}
      className={` px-6 py-4 bg-[#081B17] rounded-lg relative ${
        isHovered && applyHover ? "shadow-stats-shadow cursor-pointer" : ""
      }  ${className}  `}
      style={{
        position: "relative",
        borderRadius: "0.3125rem",
        background:
          "linear-gradient(to top right, rgba(105, 159, 132, 1), rgba(80, 108, 102, 0))", // Gradient for border
        padding: "1px", // Border thickness
        backgroundClip: "border-box", // Ensures gradient stays on the border
      }}
    >
      <div
        className="bg-[#081B17] w-full h-full rounded-[inherit] px "
        style={{
          borderRadius: "0.3125rem", // Matches parent border radius
        }}
      >
        <div className="flex flex-col px-3   md:px-5 py-3 ">
          {loading ? (
            <div className="flex flex-col px-3   md:px-5 py-3 md:py-4">
              <Loader color="fill-[#326F58]" />
            </div>
          ) : (
            <div className="flex items-center gap-1    ">
              <p className="text-textStats  text-4xl ">{stats}</p>
            </div>
          )}
          <p className="text-sm md:text-base flex items-center gap-3 text-textStatsLabel font-medium">
            <span>{label}</span>
            <span>{applyHover && isHovered && <ArrowRight size={14} />}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default StatsCardTimer
