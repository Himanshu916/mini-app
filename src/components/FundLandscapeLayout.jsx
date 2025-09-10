import React, { useEffect, useState } from "react"
import RedirectIcon from "../assets/icons/RedirectIcon"
import GradientBorder from "./GradientBorder"
import DottedPills from "./DottedPills"
import openSea from "../assets/images/openSea.png"

import ProgressBox from "./ProgressBox"
import { LeaderboardTable } from "../LeaderboardTable"

import PrecisionIcon from "../assets/icons/PrecisionIcon"
import {
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom"
import Footer from "./Footer"
import BoltIcon from "../assets/icons/BoltIcon"
import { useLoadingState } from "../hooks/useLoader"
import {
  getEntryCount,
  getFundingEntryCount,
  getFundingLeaderboard,
  getLeaderboard,
} from "../apis/leaderboard"
import YourNFTs from "../features/landscapes/YourNFTs"
import Carousel from "./Carousel"
import { useHome } from "../contexts/HomeContext"
import ArrowLeft from "../assets/icons/ArrowLeft"
import ArrowRight from "../assets/icons/ArrowRight"
import Modal from "./Modal"
import ModalToFund from "../features/precisionFunding/ModalToFund"
import Loader from "./Loader"
import { useAuth } from "../contexts/AuthContext"
import Upperpaging from "./UpperPaging"
import DeepBackButton from "./DeepBackButton"
import TextWithTooltip from "./TextWithTooltip"
import BtnsWithTooltip from "./BtnsWithTooltip"
import { IPsToDollar } from "../constants/IPsToDollar"
import { LeaderboardTableFunding } from "../LeaderboardTableFunding"

const FundLandscapeLayout = ({
  name,
  image,
  region,
  collection,
  contractAddresses,
  onSelectingNFT,
  landscape,
  recieverWalletAddressSolana,
  greenPills,
  recieverWalletAddress,
  pillImage,

  greyPills,
}) => {
  const navigate = useNavigate()
  const [initial, setInitial] = useState(0)
  const { state: authState } = useAuth()
  const [leaderboardData, setLeaderboardData] = useState([])
  // const [currentPage, setCurrentPage] = useState(collection)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalEntries, setTotalEntries] = useState(0)
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [myDetails, setMyDetails] = useState({})
  const {
    loading: gettingMyDetails,
    startLoading: startGettingMyDetails,
    stopLoading: stopGettingMyDetails,
  } = useLoadingState()
  const { loading, startLoading, stopLoading } = useLoadingState()
  const [searchParams] = useSearchParams() // Fetch query params
  const { state, loading: gettingNfts } = useHome()
  const {
    activeCollection,
    selectedNFT,
    actualSelectedNFT,
    setActive,
    setCompletedSteps,
  } = useOutletContext()
  const from = searchParams.get("from")
  const specificNFT = searchParams.get("nft")
  const { greenPillNFTsHoldByWalletAddress } = state
  const filteredNFTs = greenPillNFTsHoldByWalletAddress?.filter(
    (nft) => nft?.collectionNo === state?.activeCollection
  )

  const entriesHandler = (val) => {
    setEntriesPerPage(val)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        startGettingMyDetails()
        const response3 = await getFundingLeaderboard(
          collection,
          undefined,
          1,
          10,
          true
        )

        setMyDetails(response3?.data[0])
      } catch (error) {
        console.error(error, "error")
      } finally {
        stopGettingMyDetails()
      }
    }
    fetchData()
  }, [authState?.loginAccount, authState?.chainType])

  useEffect(
    function () {
      const fetchData = async () => {
        try {
          startLoading()

          const [response1, response3] = await Promise.all([
            getFundingLeaderboard(
              collection,
              undefined,
              currentPage,
              entriesPerPage,
              false
            ),
            getFundingEntryCount(collection),
          ])

          setLeaderboardData(response1?.data)
          setTotalEntries(response3?.data)
        } catch (error) {
          console.error(error, "erroe")
        } finally {
          stopLoading()
        }
      }
      fetchData()
    },
    [collection, currentPage, entriesPerPage]
  )

  useEffect(
    function () {
      if (from === "minting" && filteredNFTs?.length > 0) {
        onSelectingNFT(filteredNFTs?.length - 1)
        setInitial(filteredNFTs?.length - 1)
      }
    },
    [from, filteredNFTs]
  )

  const myLeaderDetails =
    leaderboardData?.find(
      (leader) => leader?.evmAddress === authState?.citizen?.evmAddress
    ) || authState?.citizen

  const specificNFTIndex = filteredNFTs?.findIndex(
    (nft) =>
      // nft?.chainId?.toString() +
      nft?.collectionNo?.toString() + nft?.tokenId?.toString() === specificNFT
  )
  console.log(recieverWalletAddressSolana, "soll")

  return (
    <div className="w-full ">
      {/* <Upperpaging
        currentPage={currentPage}
        totalPages={100 / 10}
        onPageChange={setCurrentPage}
        goToPrev={goToPrev}
        goToNext={goToNext}
        goToSpecific={goToSpecific}
        isTotal={false}
        className="md:block"
      /> */}
      <div className=" flex relative  w-full flex-col-reverse  pb-16 md:pb-0  md:grid md:grid-cols-carouselLayout     md:gap-24">
        <div className="md:pt-9 w-full  flex flex-col bg-[#272727] md:bg-inherit p-4 md:p-0 rounded-lg  gap-6 ">
          <div>
            <div className="relative ">
              <div className="hidden md:block">
                <DeepBackButton />
              </div>

              <h1
                className=" text-2xl md:text-5xl font-bold text-textHeading "
                style={{
                  textShadow: "0px 0px 11.8px rgba(255, 255, 255, 0.59)",
                }}
              >
                {name}
              </h1>
            </div>

            <h3 className="text-textSupportHeading flex items-center gap-3  lg:mt-3">
              <span>{region}</span>
              <span className=" w-2 h-2 inline-block rounded-full   bg-textSupportHeading"></span>{" "}
              <span>Collection #{collection}</span>
            </h3>
          </div>
          <p className="text-sm">
            This landscape is a symbolic representation of regenerative work
            happening around the region of the {name}, {region}{" "}
          </p>

          {/* <div className="bg-cardGrey  rounded-lg py-3 px-4 ">
              <h2 className="text-textSupportHeading font-bold mb-4">
                Your NFTs progress
              </h2>

              <div className="flex items-center justify-between mb-[.375rem]">
                <p className="text-[#D1EFE0] font-bold">90% progress</p>
                <p className="text-[#D1EFE0]">$225/250</p>
              </div>
              <div className="">
                <ProgressBox
                  h="h-[1.25rem]"
                  percent={90}
                  color={"bg-[#287950]"}
                />
              </div>
            </div> */}
          <div className="hidden md:block">
            {gettingNfts ? (
              <div className="h-24 flex items-center justify-center">
                <Loader color={"fill-[#326F58]"} />
              </div>
            ) : (
              <Carousel
                shouldDisplayBtns={false}
                landscapes={filteredNFTs}
                initialIndex={specificNFT ? specificNFTIndex : initial}
                render={(data, currentIndex, goToPrev, goToNext) => {
                  return (
                    <>
                      {/* <div>upper</div> */}
                      {data?.length > 1 && (
                        <button
                          onClick={() => {
                            goToPrev(onSelectingNFT)
                          }}
                          className=" bg-[#393939] absolute -left-32 top-1/3 transform -translate-y-1/2  w-10 h-10 flex items-center justify-center text-white rounded-full"
                        >
                          <ArrowLeft />
                        </button>
                      )}
                      {filteredNFTs?.length > 0 && (
                        <div
                          className={`w-full px-6 py-4 bg-background rounded-lg relative  `}
                          style={{
                            position: "relative",
                            borderRadius: "0.75rem",
                            background: `linear-gradient(to top right, ${"#838383"}, ${"#282828"}`, // Gradient for border
                            padding: "2px", // Border thickness
                            backgroundClip: "border-box", // Ensures gradient stays on the border
                          }}
                        >
                          <div
                            className={`${"bg-background"}  w-full h-full rounded-[inherit]`}
                            style={{
                              borderRadius: "0.75rem", // Matches parent border radius
                            }}
                          >
                            <div className="bg-cardGrey  rounded-lg py-3 px-4 ">
                              <div className="flex items-center justify-between">
                                <h2 className="text-textSupportHeading font-bold mb-4">
                                  Your NFTs progress
                                </h2>
                                <p className="text-textSupportHeading font-medium">
                                  {currentIndex + 1} of {data.length}
                                </p>
                              </div>

                              <div className="flex-grow">
                                <div>
                                  <div className="flex items-center justify-between mb-[.375rem]">
                                    <p className="text-[#D1EFE0] font-bold">
                                      {(
                                        ((data[currentIndex]?.totalIPs *
                                          IPsToDollar) /
                                          (data[currentIndex]?.maxIPs *
                                            IPsToDollar)) *
                                        100
                                      )?.toFixed(2)}
                                      % progress
                                    </p>
                                    <p className="text-[#D1EFE0]">
                                      $
                                      {(
                                        data[currentIndex]?.totalIPs *
                                        IPsToDollar
                                      )?.toFixed(2)}
                                      /
                                      {data[currentIndex]?.maxIPs * IPsToDollar}
                                    </p>
                                  </div>

                                  <ProgressBox
                                    h="h-[1.25rem]"
                                    percent={
                                      ((data[currentIndex]?.totalIPs *
                                        IPsToDollar) /
                                        (data[currentIndex]?.maxIPs *
                                          IPsToDollar)) *
                                        100 >=
                                      100
                                        ? 100
                                        : ((data[currentIndex]?.totalIPs *
                                            IPsToDollar) /
                                            (data[currentIndex]?.maxIPs *
                                              IPsToDollar)) *
                                          100
                                    }
                                    color={"bg-[#287950]"}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {filteredNFTs?.length > 0 && (
                        <div className="mt-2 flex gap-1 items-center text-textSupportHeading">
                          <span>Minted On</span>
                          <img
                            className="w-[.9rem] h-[.9rem]  "
                            src={data[currentIndex]?.chainImage}
                            alt="chain-image"
                          />
                          <span className="capitalize">
                            {data[currentIndex]?.chainName}
                          </span>
                        </div>
                      )}
                      {data?.length > 1 && (
                        <button
                          onClick={() => {
                            goToNext(onSelectingNFT)
                          }}
                          className="bg-[#393939] absolute top-1/3  -right-32 transform -translate-y-1/2  w-10 h-10 flex items-center justify-center text-white rounded-full"
                        >
                          <ArrowRight />
                        </button>
                      )}
                    </>
                  )
                }}
              />
            )}
          </div>

          <div className="md:hidden">
            {filteredNFTs?.length > 0 && (
              <YourNFTs
                nftIndex={specificNFT ? specificNFTIndex : initial}
                onSelectingNFT={onSelectingNFT}
                gettingGreenpillCounts={loading}
                marginTop=""
              />
            )}
          </div>

          {filteredNFTs.length > 0 && (
            <div className="hidden md:block">
              <div className="flex items-center gap-3">
                <Modal>
                  <Modal.Button opens={"fund"}>
                    {/* <GradientBorder
                      radiusBorder={".60rem"}
                      color2={"#506C6600"}
                      color1={"#699F84"}
                      bg="bg-[#1E3D36]"
                      shadow="shadow-button-shadow"
                    >
                      <button
                        disabled={actualSelectedNFT?.nftFund >= 250}
                        className={` px-4 py-2 flex items-center gap-2  ${
                          actualSelectedNFT?.nftFund >= 250
                            ? "cursor-not-allowed"
                            : ""
                        } `}
                      >
                        <span>Instant Funding</span>
                        <BoltIcon />
                      </button>
                    </GradientBorder> */}

                    <BtnsWithTooltip
                      className="leading-10"
                      hoverOverText={
                        <GradientBorder
                          radiusBorder={".60rem"}
                          color2={"#506C6600"}
                          color1={"#699F84"}
                          bg="bg-[#1E3D36]"
                          shadow="shadow-button-shadow"
                        >
                          <button
                            disabled={
                              actualSelectedNFT?.totalIPs * IPsToDollar >=
                              actualSelectedNFT?.maxIPs * IPsToDollar
                            }
                            className={` px-4 py-2 flex items-center gap-2  ${
                              actualSelectedNFT?.totalIPs * IPsToDollar >=
                              actualSelectedNFT?.maxIPs * IPsToDollar
                                ? "cursor-not-allowed"
                                : ""
                            } `}
                          >
                            <span>Instant Funding</span>
                            <BoltIcon />
                          </button>
                        </GradientBorder>
                      }
                      expandedTextWidth="w-[272px]"
                    >
                      {actualSelectedNFT?.totalIPs * IPsToDollar >=
                      actualSelectedNFT?.maxIPs * IPsToDollar ? (
                        <div>
                          <p className="text-[#E8E8E8] ">
                            This NFT is fully funded. Please mint a new NFT to
                            continue.
                          </p>
                        </div>
                      ) : (
                        <p className="text-[#E8E8E8] ">
                          Fund activities in the selected landscape in just one
                          step
                        </p>
                      )}
                    </BtnsWithTooltip>
                  </Modal.Button>
                  <Modal.Window name={"fund"}>
                    <ModalToFund
                      recieverWalletAddress={recieverWalletAddress}
                      recieverWalletAddressSolana={recieverWalletAddressSolana}
                      actualSelectedNFT={actualSelectedNFT}
                      activeCollection={activeCollection}
                      landscape={landscape}
                    />
                  </Modal.Window>
                </Modal>

                <BtnsWithTooltip
                  className="leading-10"
                  hoverOverText={
                    <GradientBorder
                      radiusBorder={".60rem"}
                      color2={"rgba(80, 108, 102, 0)"}
                      color1={"rgba(105, 159, 132, 1)"}
                      bg="bg-[#2B5A67]"
                    >
                      <button
                        disabled={
                          actualSelectedNFT?.totalIPs * IPsToDollar >=
                          actualSelectedNFT?.maxIPs * IPsToDollar
                        }
                        onClick={() => {
                          setActive(1)
                          setCompletedSteps([])
                          navigate(`precision/${collection}`)
                        }}
                        className={` px-4 py-2 flex items-center gap-2  ${
                          actualSelectedNFT?.totalIPs * IPsToDollar >=
                          actualSelectedNFT?.maxIPs * IPsToDollar
                            ? "cursor-not-allowed"
                            : ""
                        } `}
                      >
                        <span>Precision Funding</span>
                        <PrecisionIcon />
                      </button>
                    </GradientBorder>
                  }
                  expandedTextWidth="w-[272px]"
                >
                  {actualSelectedNFT?.totalIPs * IPsToDollar >=
                  actualSelectedNFT?.maxIPs * IPsToDollar ? (
                    <div>
                      <p className="text-[#E8E8E8] ">
                        This NFT is fully funded. Please mint a new NFT to
                        continue.
                      </p>
                    </div>
                  ) : (
                    <p className="text-[#E8E8E8] ">
                      Choose and fund specific activities you care about within
                      the selected landscape
                    </p>
                  )}
                </BtnsWithTooltip>
              </div>
            </div>
          )}
          <div className=" w-full">
            <LeaderboardTableFunding
              leaderboardData={[myDetails, ...leaderboardData]}
              myLeaderDetails={myLeaderDetails}
              className="w-full"
              selectedLandscapes={[activeCollection]}
              loading={loading}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalEntries={totalEntries}
              entriesPerPage={entriesPerPage}
              entriesHandler={entriesHandler}
              color="fill-[#326F58]"
            />
          </div>
        </div>
        <div className="bg-fund-mobile-gradient md:bg-bg-lg w-full flex rounded-lg lg:rounded-none  flex-col items-center self-start justify-center   ">
          <img
            className="h-[16.56rem] md:h-[32.625rem] object-cover"
            src={actualSelectedNFT?.imageURI}
            alt=""
          />
        </div>
        {/* <div className="flex w-10 h-10 md:hidden items-center justify-between"></div> */}
        <div className="relative  block md:hidden py-10">
          <DeepBackButton className="top-[50%] left-0" />
        </div>
      </div>
      {filteredNFTs.length > 0 && (
        <Footer>
          <Modal>
            <Modal.Button opens={"fund"}>
              <GradientBorder
                radiusBorder={".60rem"}
                color2={"#506C6600"}
                color1={"#699F84"}
                bg="bg-[#1E3D36]"
                shadow="shadow-button-shadow"
              >
                <button
                  type="button"
                  className=" px-4 py-2 flex items-center gap-2  "
                >
                  <span>Instant Funding</span>
                  <BoltIcon color="#919191" />
                </button>
              </GradientBorder>
            </Modal.Button>
            <Modal.Window name={"fund"}>
              <ModalToFund
                recieverWalletAddress={recieverWalletAddress}
                actualSelectedNFT={actualSelectedNFT}
                activeCollection={activeCollection}
                landscape={landscape}
              />
            </Modal.Window>
          </Modal>

          {/* <GradientBorder
            radiusBorder={".60rem"}
            color2={"#506C6600"}
            color1={"#699F84"}
            bg="bg-[#1E3D36]"
            shadow="shadow-button-shadow"
          >









            <button className=" px-4 py-2 flex items-center gap-2  ">
              <span>Instant Funding</span>
              <BoltIcon />
            </button>
          </GradientBorder> */}
          <GradientBorder
            radiusBorder={".60rem"}
            color2={"rgba(80, 108, 102, 0)"}
            color1={"rgba(105, 159, 132, 1)"}
            bg="bg-[#2B5A67]"
          >
            <button
              onClick={() => {
                setActive(1)
                setCompletedSteps([])
                navigate(`precision/${collection}`)
              }}
              className=" px-4 py-2 flex items-center gap-2  "
            >
              <span>Precision Funding</span>
              <PrecisionIcon />
            </button>
          </GradientBorder>
        </Footer>
      )}
    </div>
  )
}

export default FundLandscapeLayout
