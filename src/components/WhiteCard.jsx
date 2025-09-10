import { forwardRef } from "react"

const WhiteCard = forwardRef(function WhiteCard(
  {
    children,
    verticalMargin = "my-6",
    shadow = "shadow-md",
    bg = "bg-[#1C1C1C]",
    className,
    ...props
  },
  ref
) {
  return (
    <div
      {...props}
      ref={ref}
      className={`${bg} ${shadow}  ${verticalMargin}  rounded-md ${className} `}
    >
      {children}
    </div>
  )
})

export default WhiteCard
