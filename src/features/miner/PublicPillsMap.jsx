import React, { useEffect, useState } from "react"
import worldMap from "../../assets/images/worldMap.png"

import { useHome } from "../../contexts/HomeContext"

import { useAuth } from "../../contexts/AuthContext"
import { getImage } from "../../constants/colors"
import { markerData } from "../../constants/markerData"

function PublicPillsMap({ landscapes, toggleSidebarPanel, from }) {
  const { state, dispatch, gettingHoverData } = useHome()
  const [leaderboardData, setLeaderboardData] = useState([])

  const { state: authState } = useAuth()

  const [screenSize, setScreenSize] = useState("medium")
  const [width, setWidth] = useState("78rem")
  const [hoverCard, setHoverCard] = useState({
    visible: false,
    position: { top: 0, left: 0 },
    content: null,
    count: 0,
  })

  const { greenPillNFTsCountInLandscapes, hoverData } = state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataToSet = hoverData?.find(
          (x) => x?.nftCollectionNumber === hoverCard?.content
        )

        setLeaderboardData(dataToSet?.data)
      } catch (error) {
        console.error(error, "error")
      }
    }
    fetchData()
  }, [hoverCard?.content, hoverData])

  useEffect(() => {
    const updateScreenSize = () => {
      // const width = window.innerWidth
      const width = document.documentElement.clientWidth

      if (width >= 1920) {
        setScreenSize("medium")
        setWidth("78rem")
      } else if (width >= 1620) {
        setScreenSize("medium")
        setWidth("78rem")
        // set here to large
      } else if (width >= 980) {
        setScreenSize("medium")
        setWidth("78rem")
      } else if (width >= 390) {
        setScreenSize("small")
        setWidth("78rem")
      } else {
        setScreenSize("xsmall")
        setWidth("78rem")
      }
    }

    updateScreenSize()
    window.addEventListener("resize", updateScreenSize)

    return () => {
      window.removeEventListener("resize", updateScreenSize)
    }
  }, [])

  const handleMouseLeave = () => {
    setHoverCard({ visible: false, position: { top: 0, left: 0 }, content: "" })
  }

  const onContextMenu = (e) => {
    e.preventDefault()
    alert("onContextMenu: Show info about marker")
  }

  const renderMarkers = () => {
    return landscapes.map((marker) => {
      const markerAdditional = markerData.find(
        (m) => m.collection === marker?.nftCollectionNumber
      )
      const images = marker?.stateImages?.activeStateImages
      const landscapeSpecificCount = greenPillNFTsCountInLandscapes.find(
        (count) => count?.landscapeCollection === marker?.nftCollectionNumber
      )

      if (!markerAdditional) return null
      const { top, left, topH, leftH } = markerAdditional.positions[screenSize]
      return (
        <div
          key={marker._id}
          className="absolute cursor-pointer"
          style={{
            top: top,
            left: left,
            transform: "translate(-50%, -50%)", // Centers the marker
          }}
        >
          <div
            onClick={(e) => {
              dispatch({
                type: "home/setActiveCollection",
                payload: marker?.nftCollectionNumber,
              })
              toggleSidebarPanel(marker?.nftCollectionNumber)
            }}
            className={`flex ${
              markerAdditional?.direction
            } items-center justify-center  ${
              markerAdditional?.direction === "flex-col" ? "gap-5" : "gap-1"
            }    `}
          >
            <div className="flex items-center justify-center relative flex-col">
              <div className="rounded-3xl  overflow-hidden  ">
                <img
                  onContextMenu={onContextMenu}
                  src={
                    images[
                      getImage((landscapeSpecificCount?.count / 400) * 100)
                    ]
                  }
                  alt={`Marker ${marker?._id}`}
                  className="w-[2.15rem] h-[5.25rem]   object-contain "
                />
              </div>
              <div className="w-[5rem] absolute -bottom-3 z-[-999] h-[2.73rem]">
                <img
                  src={markerAdditional.ring}
                  alt={`Marker ${marker.id} ring`}
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
            <div
              className={`bg-[#270505] box-border  ${
                hoverCard.content === marker?.nftCollectionNumber &&
                "shadow-[inset_0_0_0_1px_#793939]"
              }      py-1 px-2 rounded-lg`}
            >
              <p
                style={{
                  textShadow: "0px 0px 5.5px #EFD4D1",
                }}
                className={`text-[#EFD4D1] tracking-widest  text-xs font-semibold flex flex-col leading-4  `}
              >
                <span> {marker?.name.split(" ")[0]}</span>
                <span> {marker?.name.split(" ")[1]}</span>
                {/* <span>{marker?.nftCollectionNumber}</span> */}
              </p>
            </div>
          </div>
        </div>
      )
    })
  }

  return (
    <div className="h-[115vh] w-full main  overflow-x-auto">
      <div
        style={{
          width: width,
          height: "100%",
        }}
        className="relative main mx-auto my-auto overflow-hidden"
      >
        <img
          style={{
            width: width,
            height: "100%",
            objectFit: "cover", // Ensures image covers the container without overflow
          }}
          className="absolute top-2 left-0"
          src={worldMap}
          alt="World Map"
        />

        {renderMarkers()}
      </div>
    </div>
  )
}

export default PublicPillsMap
