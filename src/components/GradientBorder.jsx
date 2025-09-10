import React from "react"

const GradientBorder = ({
  children,
  radiusBorder = "1000px",
  color1,
  color2,
  upperPadding = "px-6 py-4",
  isNoBottomRadius = false,
  borderThickness = "2px",
  width = "w-fit",
  bg = "bg-background",
  className = "",
  shadow,
}) => {
  return (
    <div
      className={`${width} ${upperPadding} bg-background rounded-lg relative ${shadow} ${className} `}
      style={{
        position: "relative",
        borderRadius: radiusBorder,
        ...(isNoBottomRadius && {
          borderBottomRightRadius: "0px",
          borderBottomLeftRadius: "0px",
        }),
        background: `linear-gradient(to top right, ${color1}, ${color2}`, // Gradient for border
        padding: borderThickness, // Border thickness
        backgroundClip: "border-box", // Ensures gradient stays on the border
      }}
    >
      <div
        className={`${bg}  w-full h-full rounded-[inherit]`}
        style={{
          borderRadius: radiusBorder, // Matches parent border radius
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default GradientBorder
