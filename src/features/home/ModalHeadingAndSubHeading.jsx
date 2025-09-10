import React from "react"

const ModalHeadingAndSubHeading = ({ heading, subheading, className }) => {
  return (
    <div
      className={` absolute  pt-8 px-2 md:px-0  top-0 left-0 right-0 ${className} `}
    >
      <h1
        className=" text-2xl md:text-4xl mt-4 md:mt-0 font-bold text-textHeading  text-center"
        style={{
          textShadow: "0px 0px 11.8px rgba(255, 255, 255, 0.59)",
        }}
      >
        {heading}
      </h1>
      <h6 className="text-sm text-textSupportHeading mt-1 text-center ">
        {subheading}
      </h6>
    </div>
  )
}

export default ModalHeadingAndSubHeading
