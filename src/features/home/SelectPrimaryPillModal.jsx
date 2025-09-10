import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import Overlay from "../../components/Overlay"
import GradientBorder from "../../components/GradientBorder"
import { useHome } from "../../contexts/HomeContext"
import Loader from "../../components/Loader"
import ProgressBox from "../../components/ProgressBox"
import EmptyArray from "../../components/EmptyArray"
import { fundText, getColor } from "../../constants/colors"
import { ArrowRightIcon } from "lucide-react"
import { allocateIPs } from "../../apis/extraIps"
import { useLoadingState } from "../../hooks/useLoader"
import { toast } from "sonner"

function SelectPrimaryPillModal({
  close,
  togglePrimarySelection,
  extraIPs,
  setExtraIPs,
  text,
}) {
  const myRef = useRef({ close })
  const { state: homeState, dispatch, loading } = useHome()
  const [selectedNFT, setSelectedNFT] = useState(null)
  const {
    loading: tokenizing,
    startLoading: startTokenizing,
    stopLoading: stopTokenizing,
  } = useLoadingState()

  const { greenPillNFTsHoldByWalletAddress } = homeState
  const navigate = useNavigate()

  useEffect(
    function () {
      function handleClick(e) {
        if (myRef.current && !myRef.current.contains(e.target)) {
          close()
        }
      }

      document.addEventListener("click", handleClick, true)

      return () => document.removeEventListener("click", handleClick, true)
    },
    [close]
  )

  const nftSelectHandler = (nft) => {
    setSelectedNFT(nft)
  }

  const tokenize = async () => {
    const selectedNFTData = greenPillNFTsHoldByWalletAddress[selectedNFT]

    const allocatePayload =
      selectedNFTData?.chainName?.toLowerCase() === "solana"
        ? {
            chainName: selectedNFTData?.chainName,
            collectionAddress: selectedNFTData?.collectionAddress,
            assetId: selectedNFTData?.tokenId,
          }
        : {
            chainName: selectedNFTData?.chainName,
            chainId: selectedNFTData?.chainId,
            contractAddress: selectedNFTData?.contractAddress,
            tokenId: selectedNFTData?.tokenId,
          }

    try {
      startTokenizing()
      const response = await allocateIPs(allocatePayload)
      const afterTokenizePayload = {
        id:
          selectedNFTData?.chainName +
          selectedNFTData?.contractAddress +
          selectedNFTData?.tokenId,
        allocateIPs: response?.data,
      }

      setExtraIPs((prev) => prev - response?.data)
      dispatch({
        type: "home/allocateIPs",
        payload: afterTokenizePayload,
      })
      toast.success("IPs allocated successfully!")
      if (extraIPs - response?.data === 0) {
        close()
      }
    } catch (error) {
      console.log(error)
    } finally {
      stopTokenizing()
    }
  }

  const selectedNFTDataForTokenization =
    greenPillNFTsHoldByWalletAddress[selectedNFT]

  return (
    <Overlay>
      <div className="absolute rounded-lg left-[50%] p-6   bg-[#60606070] backdrop-blur-[62.5px]  z-[9999]  translate-x-[-50%] translate-y-[-50%] top-[50%]">
        <div ref={myRef} className="relative w-full h-full">
          <button
            className="  absolute z-[9999] top-0 right-0  rounded-full  "
            onClick={() => {
              togglePrimarySelection()
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
            >
              <circle cx="15" cy="15" r="15" fill="#393939" />
              <path
                d="M20.5918 10L10.5914 20.0004"
                stroke="#F0F0F0"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M20 20L9.99964 9.99964"
                stroke="#F0F0F0"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <p className="cursor-pointer">
            {
              <span className="flex items-center gap-2">
                <span className="text-white text-xl font-semibold">
                  You have collected {extraIPs?.toFixed(2)} extra Impact points!{" "}
                </span>
              </span>
            }

            <span className="text-subHeadingGrey mt-2 block ">{text}</span>
          </p>

          <div className="grid grid-cols-4 gap-6 max-h-[30rem] overflow-auto main mt-4  ">
            {loading ? (
              <div className="h-52 w-full flex items-center justify-center">
                <Loader color={"fill-[#326F58]"} />
              </div>
            ) : greenPillNFTsHoldByWalletAddress.length > 0 ? (
              greenPillNFTsHoldByWalletAddress.map((nft, i) => {
                return (
                  <div
                    onClick={() => {
                      if (nft?.totalIPs >= nft?.maxIPs) return
                      else nftSelectHandler(i)
                      //   navigate(
                      //     `fund?nft=${
                      //       nft?.collectionNo?.toString() +
                      //       nft?.tokenId?.toString()
                      //     }`
                      //   )
                      //   dispatch({
                      //     type: "home/setActiveCollection",
                      //     payload: nft?.collectionNo,
                      //   })
                    }}
                    key={nft?.collectionNo + Math.random()}
                    className={` ${
                      nft?.totalIPs >= nft?.maxIPs
                        ? "cursor-not-allowed"
                        : "cursor-pointer"
                    }    container  flex flex-col gap-[.375rem] rounded-lg  ${
                      selectedNFT === i
                        ? "bg-[#081B17] border border-[#264E41]"
                        : "bg-[#262727]"
                    }         py-4`}
                  >
                    <div className="flex items-center relative justify-center">
                      <img
                        className="w-[1.6rem] h-[1.6rem] absolute top-0 right-3"
                        src={nft?.chainImage}
                        alt="chain-image"
                      />
                      <img
                        className="w-full"
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
                            getColor((nft?.totalIPs / nft?.maxIPs) * 100)
                          ]?.progress
                        }
                        textColor={
                          fundText[
                            getColor((nft?.totalIPs / nft?.maxIPs) * 100)
                          ]?.text
                        }
                        nameClass={`font-bold text-white truncate ${
                          fundText[
                            getColor((nft?.totalIPs / nft?.maxIPs) * 100)
                          ]?.perFundText
                        }  `}
                      />
                    </div>
                  </div>
                )
              })
            ) : (
              <EmptyArray />
            )}
          </div>
          <div className="pt-4">
            <GradientBorder
              radiusBorder={".25rem"}
              color2={"rgba(80, 108, 102, 0)"}
              color1={"rgba(105, 159, 132, 1)"}
              bg="bg-[#1E3D36]"
              shadow="shadow-button-shadow"
              width={"w-full"}
            >
              <button
                disabled={
                  selectedNFT === null ||
                  selectedNFTDataForTokenization?.totalIPs >=
                    selectedNFTDataForTokenization?.maxIPs ||
                  extraIPs === 0
                }
                onClick={tokenize}
                type="button"
                className={` ${
                  selectedNFT === null ||
                  selectedNFTDataForTokenization?.totalIPs >=
                    selectedNFTDataForTokenization?.maxIPs ||
                  extraIPs === 0
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                } px-4 py-2 flex items-center gap-2 w-full  justify-center`}
              >
                {tokenizing ? (
                  <Loader color="fill-[#326F58]" />
                ) : (
                  <span className="text-sm font-medium">Tokenize Impact</span>
                )}
              </button>
            </GradientBorder>
          </div>
        </div>
      </div>
    </Overlay>
  )
}

export default SelectPrimaryPillModal
