import { useEffect, useRef, useState } from "react"
import Heading from "../../components/Heading"
import GradientBorder from "../../components/GradientBorder"
import WhiteCard from "../../components/WhiteCard"
import ProgressBox from "../../components/ProgressBox"
import { fundText, getColor } from "../../constants/colors"
import EmptyArray from "../../components/EmptyArray"
import { useHome } from "../../contexts/HomeContext"
import { useNavigate } from "react-router-dom"
import CustomToaster from "../../components/CustomToaster"
import blockchain from "../../assets/images/blockchain.gif"
import ArrowLeft from "../../assets/icons/ArrowLeft"
import ArrowRight from "../../assets/icons/ArrowRight"

import { createPortal } from "react-dom"
import {
  collectionNotifications,
  getNotificationNumber,
} from "../../helpers/ipsHelper"

const TooltipWrapper = ({ condition = false, content, children }) => {
  const ref = useRef(null)
  const [hovered, setHovered] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    if (hovered && ref.current) {
      const rect = ref.current.getBoundingClientRect()
      setPosition({
        top: rect.bottom + window.scrollY + 6,
        left: rect.left + window.scrollX + rect.width / 2 + 50,
      })
    }
  }, [hovered])

  return (
    <>
      <div
        ref={ref}
        onMouseEnter={() => condition && setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="inline-block"
      >
        {children}
      </div>

      {hovered &&
        condition &&
        createPortal(
          <div
            style={{
              position: "absolute",
              top: position.top,
              left: position.left,
              transform: "translateX(-50%)",
              zIndex: 9999,
            }}
          >
            <div className="relative">
              <div className="absolute -top-1 left-[20%] w-0 h-0 border-l-[6px] border-r-[6px] border-b-[6px] border-l-transparent border-r-transparent border-b-[#4F4F4F]" />
              <div className="bg-[#4F4F4F] text-white text-xs rounded-lg py-2 px-3 text-center shadow-md w-max">
                {content}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}

const MyCollection = ({
  isPrimarySelectionOpen,
  togglePrimarySelection,
  extraIPs,
  isGradient = true,
  isPadding = true,
}) => {
  const { state: homeState, dispatch, loading } = useHome()

  const scrollCards = useRef()

  const navigate = useNavigate()
  const { greenPillNFTsHoldByWalletAddress } = homeState

  const notificationText =
    collectionNotifications[
      getNotificationNumber(greenPillNFTsHoldByWalletAddress)
    ]?.text

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
    <div className="bg-pillsMap-downwardGradient w-full z-50">
      <div className={` relative ${isPadding ? "px-11 pt-16" : ""}  pb-8`}>
        {isGradient && (
          <div className="w-full h-36 absolute -top-6 left-0 right-0 bg-pillsMap-downwardGradient"></div>
        )}
        <div className="relative ">
          <Heading className={"text-secondaryText  "} type={"medium"}>
            My collection
          </Heading>

          <GradientBorder
            radiusBorder=".4rem"
            color1="rgba(105, 159, 132, 1)"
            color2="rgba(80, 108, 102, 0)"
            isNoBottomRadius={false}
            width="w-full"
            bg="bg-background"
            upperPadding="p-6"
            borderThickness="1px"
            className="mt-3 relative"
          >
            <WhiteCard bg={"bg-[#081B17]"} verticalMargin="" className="py-5">
              <div
                className={`h-full w-72 
                bg-right-box-green-gradient   absolute top-0 right-0 z-50 `}
              ></div>
              {!loading && (
                <div className="px-5 hidden md:block ">
                  <CustomToaster
                    onClick={() => togglePrimarySelection()}
                    points={extraIPs}
                    className="mb-4"
                    text={notificationText}
                  />
                </div>
              )}

              <div className="relative">
                <div
                  ref={scrollCards}
                  className={` flex px-5 items-center overflow-x-auto flex-nowrap scrollableCards ${
                    loading || greenPillNFTsHoldByWalletAddress.length === 0
                      ? ""
                      : "pr-72"
                  }   `}
                >
                  {loading ? (
                    <div className="h-52 w-full relative flex items-center justify-center">
                      <div className="">
                        <img
                          className="w-[12.4375rem] h-[13rem] "
                          src={blockchain}
                          alt=""
                        />
                        <p className="absolute bottom-0 left-[50%] translate-x-[-50%]">
                          Please hold on, communicating with Blockchain
                        </p>
                      </div>
                    </div>
                  ) : greenPillNFTsHoldByWalletAddress.length > 0 ? (
                    greenPillNFTsHoldByWalletAddress.map((nft) => {
                      return (
                        <TooltipWrapper
                          condition={nft?.totalIPs >= nft?.maxIPs}
                          content="You can’t fund this greenpill since it’s fully transformed"
                        >
                          <div
                            onClick={() => {
                              if (nft?.totalIPs >= nft?.maxIPs) {
                                return
                              } else {
                                navigate(
                                  `/fund?nft=${
                                    nft?.collectionNo?.toString() +
                                    nft?.tokenId?.toString()
                                  }`
                                )
                                dispatch({
                                  type: "home/setActiveCollection",
                                  payload: nft?.collectionNo,
                                })
                              }
                            }}
                            key={nft?.collectionNo + Math.random()}
                            className={` ${
                              nft?.totalIPs >= nft?.maxIPs
                                ? "cursor-not-allowed"
                                : "cursor-pointer"
                            }  container  flex flex-col gap-[.375rem] rounded-lg w-48 bg-[#0E2822] py-4 mr-5`}
                          >
                            <div className="flex items-center w-48 relative justify-center">
                              <img
                                className="w-[1.6rem] h-[1.6rem] absolute top-0 right-3"
                                src={nft?.chainImage}
                                alt="chain-image"
                              />
                              <img
                                className="w-full "
                                src={nft?.imageURI}
                                alt="greenpill-card"
                              />
                            </div>

                            <div className="w-[80%] mx-auto">
                              <ProgressBox
                                h="h-4"
                                name={nft?.name}
                                isShowPercent={true}
                                percent={(nft?.totalIPs / nft?.maxIPs) * 100}
                                color={
                                  fundText[
                                    getColor(
                                      (nft?.totalIPs / nft?.maxIPs) * 100
                                    )
                                  ]?.progress
                                }
                                textColor={
                                  fundText[
                                    getColor(
                                      (nft?.totalIPs / nft?.maxIPs) * 100
                                    )
                                  ]?.text
                                }
                                nameClass={`font-bold text-white truncate ${
                                  fundText[
                                    getColor(
                                      (nft?.totalIPs / nft?.maxIPs) * 100
                                    )
                                  ]?.perFundText
                                }  `}
                              />
                            </div>
                          </div>
                        </TooltipWrapper>
                      )
                    })
                  ) : (
                    <EmptyArray />
                  )}
                </div>

                <button
                  onClick={scrollL}
                  className={` ${
                    shouldDisplayBtns ? "absolute" : "hidden"
                  }  absolute bg-[#1E3D36] left-0 translate-x-[-50%] top-[50%]   transform -translate-y-1/2 w-[2.375rem] h-[2.375rem] flex items-center justify-center text-white rounded-full`}
                >
                  <ArrowLeft />
                </button>
                <button
                  onClick={scrollR}
                  className={`${
                    shouldDisplayBtns ? "absolute z-[9999]" : "hidden"
                  } bg-[#1E3D36]  right-0 translate-x-[50%] top-[50%] transform -translate-y-1/2 w-[2.375rem] h-[2.375rem]  flex items-center justify-center text-white rounded-full`}
                >
                  <ArrowRight />
                </button>
              </div>
            </WhiteCard>
          </GradientBorder>
        </div>
      </div>
    </div>
  )
}

export default MyCollection
