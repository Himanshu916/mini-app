import { ArrowRightIcon } from "lucide-react"
import { useState } from "react"

const CustomToaster = ({
  isTop,
  isRight,
  points,
  text,
  className = "",
  onClick,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleSidebarPanel = () => {
    setIsOpen(!isOpen)
  }

  if (points === 0)
    return (
      <div className={`relative ${className} `}>
        {isRight && (
          <div className="absolute top-[50%] translate-y-[-50%] -right-2 w-0 h-0 border-t-[10px] border-b-[10px] border-l-[9px] border-t-transparent border-b-transparent border-l-[#BCD3CE]"></div>
        )}
        {isTop && (
          <div className="absolute -top-2 left-12 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[9px] border-l-transparent border-r-transparent border-b-[#BCD3CE]"></div>
        )}

        <div
          className={`bg-[#36544D] rounded-[.25rem] py-[.65rem] px-3  flex ${
            isRight ? "flex-row-reverse" : ""
          } items-center gap-3  `}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="31"
            viewBox="0 0 30 31"
            fill="none"
          >
            <path
              d="M13.748 9.25H16.248V11.75H13.748V9.25ZM13.748 14.25H16.248V21.75H13.748V14.25ZM14.998 3C8.09805 3 2.49805 8.6 2.49805 15.5C2.49805 22.4 8.09805 28 14.998 28C21.898 28 27.498 22.4 27.498 15.5C27.498 8.6 21.898 3 14.998 3ZM14.998 25.5C9.48555 25.5 4.99805 21.0125 4.99805 15.5C4.99805 9.9875 9.48555 5.5 14.998 5.5C20.5105 5.5 24.998 9.9875 24.998 15.5C24.998 21.0125 20.5105 25.5 14.998 25.5Z"
              fill="#A7AFAD"
            />
          </svg>
          <p className="">
            {
              <span className="flex items-center gap-2">
                <span className="text-white text-xl font-semibold">
                  Take Action, Fund Now!
                </span>
              </span>
            }

            <span className="text-subHeadingGrey  ">
              Click on any of your NFTs below to fund and gain points, tokenize
              your real world impact
            </span>
          </p>
        </div>
      </div>
    )

  return (
    <div className={`relative ${className} `}>
      {isRight && (
        <div className="absolute top-[50%] translate-y-[-50%] -right-2 w-0 h-0 border-t-[10px] border-b-[10px] border-l-[9px] border-t-transparent border-b-transparent border-l-[#BCD3CE]"></div>
      )}
      {isTop && (
        <div className="absolute -top-2 left-12 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[9px] border-l-transparent border-r-transparent border-b-[#BCD3CE]"></div>
      )}

      <div
        className={`bg-[#36544D] rounded-[.25rem] py-[.65rem] px-3  flex ${
          isRight ? "flex-row-reverse" : ""
        } items-center gap-3  `}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="31"
          viewBox="0 0 30 31"
          fill="none"
        >
          <path
            d="M13.748 9.25H16.248V11.75H13.748V9.25ZM13.748 14.25H16.248V21.75H13.748V14.25ZM14.998 3C8.09805 3 2.49805 8.6 2.49805 15.5C2.49805 22.4 8.09805 28 14.998 28C21.898 28 27.498 22.4 27.498 15.5C27.498 8.6 21.898 3 14.998 3ZM14.998 25.5C9.48555 25.5 4.99805 21.0125 4.99805 15.5C4.99805 9.9875 9.48555 5.5 14.998 5.5C20.5105 5.5 24.998 9.9875 24.998 15.5C24.998 21.0125 20.5105 25.5 14.998 25.5Z"
            fill="#A7AFAD"
          />
        </svg>
        <p onClick={onClick} className="cursor-pointer">
          {
            <span className="flex items-center gap-2">
              <span className="text-white text-xl font-semibold">
                You have collected {points?.toFixed(2)} extra Impact points!{" "}
              </span>
              <span>
                <ArrowRightIcon strokeWidth={4} size={14} />
              </span>
            </span>
          }

          <span className="text-subHeadingGrey  ">{text}</span>
        </p>
      </div>
    </div>
  )
}

export default CustomToaster
