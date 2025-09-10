import React, { useState } from "react"
import { BountyDescriptionDetail } from "../BountyDescription"

const ExpandAndContractText = ({
  text,
  wordLimit,
  isActivity = false,
  textColor = "text-textSupportHeading",
}) => {
  const words = text?.split(" ")
  const needsTruncation = words?.length > wordLimit
  const [expanded, setExpanded] = useState(false)

  const displayText =
    expanded || !needsTruncation
      ? text
      : words?.slice(0, wordLimit)?.join(" ") + "..."

  const toggleExpanded = () => setExpanded(!expanded)
  return (
    <>
      {isActivity ? (
        <BountyDescriptionDetail html={displayText} />
      ) : (
        <p className={` ${textColor}  mt-2`}>{displayText}</p>
      )}

      {needsTruncation && (
        <button
          className="text-[#9B9B9B] flex items-center gap-1 font-medium cursor-pointer"
          onClick={(e) => {
            e?.stopPropagation()
            toggleExpanded()
          }}
        >
          <span> {expanded ? "Read less" : "Read more"}</span>
          <span className="relative top-[2px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="7"
              viewBox="0 0 12 7"
              fill="none"
              className={expanded ? "rotate-180 " : ""}
            >
              <path
                d="M1.062 9.07253e-07L-2.59966e-07 1.05268L6 7L12 1.05268L10.938 4.75559e-07L6 4.89465L1.062 9.07253e-07Z"
                fill="#9B9B9B"
              />
            </svg>
          </span>
        </button>
      )}
    </>
  )
}

export default ExpandAndContractText
