import React, { useEffect, useRef, useState } from "react"
import Loader from "../../components/Loader"
import WhiteCard from "../../components/WhiteCard"
import ActivityCard from "../activities/ActivityCard"
import EmptyArray from "../../components/EmptyArray"
import GradientBorder from "../../components/GradientBorder"
import { ArrowRightIcon } from "lucide-react"
import Heading from "../../components/Heading"
import { useNavigate } from "react-router-dom"
import { getExploreActivities } from "../../apis/getExploreActivities"
import { useLoadingState } from "../../hooks/useLoader"
import ArrowLeft from "../../assets/icons/ArrowLeft"
import ArrowRight from "../../assets/icons/ArrowRight"
import { createPortal } from "react-dom"

// const TooltipWrapper = ({ condition = false, content, children }) => {
//   const ref = useRef(null)
//   const [hovered, setHovered] = useState(false)
//   const [position, setPosition] = useState({ top: 0, left: 0 })
//   const hideTimeout = useRef()

//   useEffect(() => {
//     if (hovered && ref.current) {
//       const rect = ref.current.getBoundingClientRect()
//       setPosition({
//         top: rect.bottom + window.scrollY + 6,
//         left: rect.left + window.scrollX + rect.width / 2 + 0,
//       })
//     }
//     // Cleanup timeout on unmount
//     return () => clearTimeout(hideTimeout.current)
//   }, [hovered])

//   const handleMouseEnter = () => {
//     clearTimeout(hideTimeout.current)
//     if (condition) setHovered(true)
//   }

//   const handleMouseLeave = () => {
//     hideTimeout.current = setTimeout(() => setHovered(false), 100)
//   }

//   return (
//     <>
//       <div
//         ref={ref}
//         onMouseEnter={handleMouseEnter}
//         onMouseLeave={handleMouseLeave}
//         className="inline-block"
//       >
//         {children}
//       </div>

//       {hovered &&
//         condition &&
//         createPortal(
//           <div
//             onMouseEnter={handleMouseEnter}
//             onMouseLeave={handleMouseLeave}
//             style={{
//               position: "absolute",
//               top: position.top,
//               left: position.left,
//               transform: "translateX(-50%)",
//               zIndex: 9999,
//             }}
//           >
//             <div className="relative w-[22.5rem] ">
//               <div className="absolute -top-1 left-[30%] w-0 h-0 border-l-[6px] border-r-[6px] border-b-[6px] border-l-transparent border-r-transparent border-b-[#4F4F4F]" />
//               <div className="bg-[#4F4F4F]  text-white text-xs rounded-lg py-2 px-3  shadow-md">
//                 {content}
//               </div>
//             </div>
//           </div>,
//           document.body
//         )}
//     </>
//   )
// }

const TooltipWrapper = ({ condition = false, content, children }) => {
  const ref = useRef(null)
  const [hovered, setHovered] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const hideTimeout = useRef()

  useEffect(() => {
    if (hovered && ref.current) {
      const rect = ref.current.getBoundingClientRect()
      setPosition({
        top: rect.bottom + window.scrollY - 80,
        left: rect.left + window.scrollX + rect.width / 2 - 8,
      })
    }
    // Cleanup timeout on unmount
    return () => clearTimeout(hideTimeout.current)
  }, [hovered])

  const handleMouseEnter = () => {
    clearTimeout(hideTimeout.current)
    if (condition) setHovered(true)
  }

  const handleMouseLeave = () => {
    hideTimeout.current = setTimeout(() => setHovered(false), 500)
  }

  return (
    <>
      <div
        ref={ref}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        {children}
      </div>

      {hovered &&
        condition &&
        createPortal(
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              position: "absolute",
              top: position.top,
              left: position.left,
              transform: "translateX(-50%)",
              zIndex: 9999,
            }}
          >
            <div className="relative w-[22.5rem] mb-5 ">
              <div className="absolute -top-1 left-[90%] w-0 h-0 border-l-[6px] border-r-[6px] border-b-[6px] border-l-transparent border-r-transparent border-b-[#4F4F4F]" />
              <div className="bg-[#4F4F4F]  text-white text-xs rounded-lg py-2 px-3  shadow-md">
                {content}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}

const ActivitiesYouCanFund = () => {
  const navigate = useNavigate()
  const scrollCards = useRef()
  const { loading, startLoading, stopLoading } = useLoadingState()
  const [exploreActivities, setExploreActivities] = useState([])
  const [truncatedMap, setTruncatedMap] = useState({})
  useEffect(() => {
    const fetchData = async () => {
      try {
        startLoading()
        const response1 = await getExploreActivities()
        console.log(response1, "response1 hhhhh")

        // setBountiesInCore(response1?.data?.[core]?.bountyCount)
        setExploreActivities(response1?.data)
      } catch (error) {
        console.error(error, "error")
      } finally {
        stopLoading()
      }
    }
    fetchData()
  }, [])

  function scrollR() {
    scrollCards.current.scrollBy({
      left: 334,
      behavior: "smooth",
    })
  }
  function scrollL() {
    scrollCards.current.scrollBy({
      left: -334,
      behavior: "smooth",
    })
  }

  const shouldDisplayBtns = true

  return (
    <div className="  ">
      <div className="relative">
        <div className="flex items-center justify-between cursor-pointer ">
          <Heading className={"text-secondaryText"} type={"medium"}>
            Activities you can fund
          </Heading>
          {exploreActivities?.length > 0 && (
            <p
              onClick={() => navigate("/activities")}
              className="text-subHeadingGrey flex items-center gap-1 font-semibold "
            >
              <>
                {" "}
                <span>View all</span>{" "}
                <ArrowRightIcon strokeWidth={4} size={14} />
              </>
            </p>
          )}
        </div>

        <GradientBorder
          radiusBorder=".4rem"
          color2="rgba(27, 27, 27, 1)"
          color1="rgba(80, 80, 80, 1)"
          isNoBottomRadius={false}
          width="w-full"
          bg="bg-background"
          upperPadding="py-6"
          borderThickness="1px"
          className="mt-3 relative"
        >
          <div className="h-full w-72 bg-right-box-gradient  absolute top-0 right-0 z-50 "></div>
          <WhiteCard bg={"bg-[#1B1B1B]"} verticalMargin="" className={`py-5 `}>
            <div
              ref={scrollCards}
              className={`px-5 flex items-center overflow-x-auto flex-nowrap scrollableCards ${
                exploreActivities?.length === 0 ? "" : "pr-72"
              } `}
            >
              {loading ? (
                <div className="h-52 w-full flex items-center justify-center">
                  <Loader color={"fill-[#326F58]"} />
                </div>
              ) : exploreActivities?.length > 0 ? (
                exploreActivities.map((bounty) => {
                  // const isTruncated = truncatedMap[bounty.bountyId]
                  return (
                    <ActivityCard
                      key={bounty?.bountyId}
                      bounty={bounty}
                      onNavigation={(id) => navigate(`/activities/${id}`)}
                      width="w-[22.5rem]"
                      className={"mr-5"}
                      setTruncated={(isTruncated) => {
                        setTruncatedMap((prev) => {
                          // Only update if value changed to avoid infinite loop
                          if (prev[bounty?.bountyId] !== isTruncated) {
                            return { ...prev, [bounty?.bountyId]: isTruncated }
                          }
                          return prev
                        })
                      }}
                    />
                  )
                })
              ) : (
                <div className="flex items-center bg-cardGrey rounded-md justify-center h-52 w-full">
                  <p>No Activities Available</p>
                </div>
              )}
            </div>
          </WhiteCard>
          <button
            onClick={scrollL}
            className={` ${
              shouldDisplayBtns ? "absolute" : "hidden"
            }  absolute bg-[#393939] left-0 translate-x-[-50%] top-[50%]   transform -translate-y-1/2 w-[2.375rem] h-[2.375rem] flex items-center justify-center text-white rounded-full`}
          >
            <ArrowLeft />
          </button>
          <button
            onClick={scrollR}
            className={`${
              shouldDisplayBtns ? "absolute z-[9999]" : "hidden"
            } bg-[#393939]  right-0 translate-x-[50%] top-[50%] transform -translate-y-1/2 w-[2.375rem] h-[2.375rem]  flex items-center justify-center text-white rounded-full`}
          >
            <ArrowRight />
          </button>
        </GradientBorder>
      </div>
    </div>
  )
}

export default ActivitiesYouCanFund
