import React from "react"
import GradientBorder from "./GradientBorder"
import BoltIcon from "../assets/icons/BoltIcon"

const Footer = ({ children }) => {
  return (
    <div className="    fixed bottom-0  left-0 right-0 z-[9999999999] lg:hidden   bg-footerBg backdrop-blur-fund-footer py-4">
      <div className=" w-[90%] mx-auto ">
        <div className=" gap-28">
          <div className="flex items-center justify-center gap-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
