import React, { useEffect, useState } from "react"
import worldMap from "../../assets/images/worldMap.png"

import defaultAvatar from "../../assets/images/defaultAvatar.png"
import HoverCard from "./HoverCard"
import notUpdated from "../../assets/images/notupdated.png"
import { useHome } from "../../contexts/HomeContext"
import { getLeaderboard } from "../../apis/leaderboard"
import { useLoadingState } from "../../hooks/useLoader"
import Loader from "../../components/Loader"
import { formatNumberToK } from "../../helpers/convertIntoK"
import useAccount from "../../hooks/useAccount"
import { useAuth } from "../../contexts/AuthContext"
import { fundText, getColor, getImage } from "../../constants/colors"
import ProgressBox from "../../components/ProgressBox"
import { markerData } from "../../constants/markerData"

function getLeaderboardView(data, loggedInEvmAddress, chainName) {
  if (!data || data?.length === 0) {
    return []
  }
  const rank1User = data?.find((user) => user.rank === 1)

  const loggedInUser = data?.find(
    (user) =>
      user?.evmAddress?.toLowerCase() === loggedInEvmAddress?.toLowerCase() ||
      user?.walletAddress?.toLowerCase() === loggedInEvmAddress?.toLowerCase()
  )

  if (!loggedInUser) {
    const mockUserReturn = {
      evmAddress: loggedInEvmAddress,
      username: "You",
      rank: null,
      impactPointsEarned: 0,
      profileImage: null,
      walletAddress: null,
    }
    return [rank1User, mockUserReturn]
  }

  if (
    rank1User.evmAddress?.toLowerCase() === loggedInEvmAddress?.toLowerCase() ||
    rank1User?.walletAddress?.toLowerCase() ===
      loggedInEvmAddress?.toLowerCase()
  ) {
    // If logged-in user is rank 1, return rank 1 and rank 2
    const rank2User = data.find((user) => user.rank === 2)
    return [rank1User, rank2User]
  } else {
    // Otherwise return rank 1 and logged-in user
    return [rank1User, loggedInUser]
  }
}

function PillsMap({ landscapes, toggleSidebarPanel, from }) {
  const { state, dispatch, gettingHoverData } = useHome()
  const [leaderboardData, setLeaderboardData] = useState([])

  const { state: authState } = useAuth()
  const { account } = useAccount()
  const { loading, startLoading, stopLoading } = useLoadingState()
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
      } else {
        setScreenSize("small")
        setWidth("78rem")
      }
    }

    updateScreenSize()
    window.addEventListener("resize", updateScreenSize)

    return () => {
      window.removeEventListener("resize", updateScreenSize)
    }
  }, [])

  const handleMouseEnter = (event, content, top, left, count) => {
    const rect = event.target.getBoundingClientRect()
    setHoverCard({
      visible: true,
      position: { top: top, left: left },
      content,
      count,
    })
  }

  const handleMouseLeave = () => {
    setHoverCard({ visible: false, position: { top: 0, left: 0 }, content: "" })
  }

  const onContextMenu = (e) => {
    e.preventDefault()
    // alert("onContextMenu: Show info about marker")
  }
  const fetchImageURL = async (url) => {
    try {
      const response = await fetch(url)
      const data = await response.json()
      return data.image
    } catch (error) {
      console.error("Error fetching image URL:", error)
      return null
    }
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
          {...(from === "onboarding"
            ? {
                onMouseEnter: (e) =>
                  handleMouseEnter(
                    e,
                    marker?.nftCollectionNumber,
                    topH,
                    leftH,
                    landscapeSpecificCount?.count / 400
                  ),
                onMouseLeave: handleMouseLeave,
              }
            : window.innerWidth >= 1024 && {
                onMouseEnter: (e) =>
                  handleMouseEnter(
                    e,
                    marker?.nftCollectionNumber,
                    topH,
                    leftH,
                    landscapeSpecificCount?.count === undefined
                      ? 0
                      : landscapeSpecificCount?.count / 400
                  ),
                onMouseLeave: handleMouseLeave,
              })}
        >
          <div
            onClick={(e) => {
              dispatch({
                type: "home/setActiveCollection",
                payload: marker?.nftCollectionNumber,
              })
              toggleSidebarPanel()
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

  const dataHover = getLeaderboardView(
    leaderboardData,
    authState?.chainType === "Solana"
      ? authState?.citizen?.walletAddress
      : authState?.citizen?.evmAddress,
    authState?.chainType
  )

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
        {hoverCard.visible && (
          <HoverCard
            onClick={toggleSidebarPanel}
            position={hoverCard.position}
            content={hoverCard?.content}
            onMouseEnter={() => setHoverCard({ ...hoverCard, visible: true })}
            onMouseLeave={handleMouseLeave}
            progress={
              <ProgressBox
                name={`${Number(hoverCard?.count * 100)?.toFixed(2)}% Funded`}
                percent={Number(hoverCard?.count * 100)?.toFixed(2)}
                color={
                  fundText[getColor(Number(hoverCard?.count * 100)?.toFixed(2))]
                    ?.progress
                }
                nameClass={`font-bold ${
                  fundText[getColor(Number(hoverCard?.count * 100)?.toFixed(2))]
                    ?.perFundText
                } `}
              />
            }
            userFundDetails={
              gettingHoverData ? (
                <Loader color="fill-[#326F58]" />
              ) : authState?.loginAccount ? (
                leaderboardData?.length > 0 ? (
                  dataHover?.map((user, index) => {
                    return (
                      <div className="flex items-center gap-4 ">
                        <p
                          className={`font-bold ${
                            user?.rank === 1
                              ? "text-landscapeYellowLight"
                              : "text-white"
                          }`}
                        >
                          #{user?.rank || "-"}
                        </p>
                        <div className="flex flex-grow items-center gap-1">
                          <img
                            className="w-5 h-5 rounded-full"
                            src={user?.profileImage || notUpdated}
                            alt="user image"
                          />
                          <p
                            className={`font-bold truncate ${
                              user?.rank === 1
                                ? "text-landscapeYellowLight"
                                : "text-white"
                            } `}
                          >
                            {user?.username === authState?.citizen?.userName
                              ? "You"
                              : user?.username || ""}
                          </p>
                        </div>
                        <p
                          className={` ${
                            user?.rank === 1
                              ? "text-landscapeYellowLight"
                              : "text-white"
                          }  font-bold`}
                        >
                          $
                          {user?.fundingImpactPoints
                            ? formatNumberToK(
                                Number(
                                  user?.fundingImpactPoints / 14.4
                                )?.toFixed(2)
                              )
                            : 0}
                        </p>
                      </div>
                    )
                  })
                ) : (
                  [{}, authState?.citizen].map((user, index) => {
                    return (
                      <div className="flex items-center gap-4 ">
                        <p
                          className={`font-bold ${
                            index === 0
                              ? "text-landscapeYellowLight"
                              : "text-white"
                          }`}
                        >
                          #{index + 1}
                        </p>
                        <div className="flex flex-grow items-center gap-1">
                          <img
                            className="w-5 h-5 rounded-full"
                            src={user?.profileImage || notUpdated}
                            alt="user image"
                          />
                          <p
                            className={`font-bold ${
                              index === 0
                                ? "text-landscapeYellowLight"
                                : "text-white"
                            } `}
                          >
                            {index === 0 ? "-" : "You"}
                          </p>
                        </div>
                        <p
                          className={` ${
                            index === 0
                              ? "text-landscapeYellowLight"
                              : "text-white"
                          }  font-bold`}
                        >
                          $0
                        </p>
                      </div>
                    )
                  })
                )
              ) : undefined
            }
          />
        )}
      </div>
    </div>
  )
}

export default PillsMap
