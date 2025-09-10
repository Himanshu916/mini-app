import React from "react"

const DottedPills = ({ numberGreen, numberGrey }) => {
  return (
    <div className="flex items-center gap-1   flex-wrap">
      {Array.from({ length: numberGreen }, (v, i) => (
        <div className={`w-2 h-2  rounded-full bg-[#287950]`}></div>
      ))}
      {Array.from({ length: numberGrey }, (v, i) => (
        <div className={`w-2 h-2  rounded-full bg-[#848484]`}></div>
      ))}
    </div>
  )
}

export default DottedPills
