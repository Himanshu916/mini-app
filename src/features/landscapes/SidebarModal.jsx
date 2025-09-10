import { useEffect, useState } from "react"
import LandscapeDetails from "./LandscapeDetails"
import YourNFTs from "./YourNFTs"
import LandscapeLeaderboard from "./LandscapeLeaderboard"
import { useHome } from "../../contexts/HomeContext"
import { getCoreWiseFundingInLandscape } from "../../apis/landscapes"
import { useLoadingState } from "../../hooks/useLoader"
import { getFundingLeaderboard, getLeaderboard } from "../../apis/leaderboard"
import { useGlobalState } from "../../contexts/GlobalState"
import Footer from "../../components/Footer"
import notUpdated from "../../assets/images/notupdated.png"
import GradientBorder from "../../components/GradientBorder"
import { useNavigate } from "react-router-dom"
import { getImage } from "../../constants/colors"
import { fetchGreenpillCountWithColor } from "../../blockchain/homepage/numberOfGreenPills"
import { formatNumberToK } from "../../helpers/convertIntoK"
import Loader from "../../components/Loader"
import { useAuth } from "../../contexts/AuthContext"
import useGreenPillCountInLandscape from "../../hooks/useGreenPillCountInLandscape"

const SidebarModal = ({ toggleSidebarPanel, isOpen }) => {
  const { state, loading: gettingNFTs } = useHome()
  const { greenPillNFTsCountInLandscape, gettingGreenpillCounts } =
    useGreenPillCountInLandscape(state?.activeCollection)
  const { state: landscapesState } = useGlobalState()
  const { state: authState } = useAuth()
  const {
    loading: gettingCores,
    startLoading: startGettingCores,
    stopLoading: stopGettingCores,
  } = useLoadingState()

  const [selectedNFT, setSelectedNFT] = useState(0)
  const {
    loading: gettingMyDetails,
    startLoading: startGettingMyDetails,
    stopLoading: stopGettingMyDetails,
  } = useLoadingState()

  const [myDetails, setMyDetails] = useState({})
  const { loading, startLoading, stopLoading } = useLoadingState()
  const [leaderboardData, setLeaderboardData] = useState([])
  const [coreWiseFunding, setCoreWiseFunding] = useState([])
  const navigate = useNavigate()

  const { greenPillNFTsCountInLandscapes } = state
  const activeLandScape = landscapesState?.landscapes.find(
    (landscape) => landscape.nftCollectionNumber === state?.activeCollection
  )
  const { greenPillNFTsHoldByWalletAddress } = state

  const filteredNFTs = greenPillNFTsHoldByWalletAddress?.filter(
    (nft) => nft?.collectionNo === state?.activeCollection
  )

  const landscapeSpecificCount = greenPillNFTsCountInLandscapes.find(
    (count) =>
      count?.landscapeCollection === activeLandScape?.nftCollectionNumber
  )
  const imageStates = activeLandScape?.stateImages?.activeStateImages

  const landscapeDetails = {
    name: activeLandScape?.name,
    region: activeLandScape?.region,
    description: activeLandScape?.description,
    mintOptions: activeLandScape?.mintOptions,
    pillImage:
      imageStates?.[
        getImage((greenPillNFTsCountInLandscape?.count / 400) * 100)
      ],
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        startGettingMyDetails()
        const response3 = await getFundingLeaderboard(
          state?.activeCollection,
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
  }, [state?.activeCollection])
  useEffect(() => {
    const fetchData = async () => {
      try {
        startLoading()

        const [response2] = await Promise.all([
          getFundingLeaderboard(
            state?.activeCollection,
            undefined,
            1,
            10,
            false
          ),
        ])

        setLeaderboardData(response2?.data)
      } catch (error) {
        console.error(error, "error")
      } finally {
        stopLoading()
      }
    }
    if (state?.activeCollection) fetchData()
  }, [state?.activeCollection])

  useEffect(() => {
    const fetchData = async () => {
      try {
        startGettingCores()

        const [response1] = await Promise.all([
          getCoreWiseFundingInLandscape(state?.activeCollection),
        ])

        setCoreWiseFunding(response1)
      } catch (error) {
        console.error(error, "error")
      } finally {
        stopGettingCores()
      }
    }
    if (state?.activeCollection) fetchData()
  }, [state?.activeCollection])

  const onSelectingNFT = (index) => {
    setSelectedNFT(index)
  }
  const actualSelectedNFT = filteredNFTs[selectedNFT]

  return (
    <div className="relative">
      {isOpen && (
        <div
          onClick={toggleSidebarPanel}
          className="fixed inset-0  bg-black opacity-75 z-[99]"
        ></div>
      )}

      <div
        className={`fixed z-[9999]  backdrop-blur-lg  min-h-screen pb-20  bg-[#272727] transition-transform duration-300 
        top-24
    w-full lg:mx-0
         lg:w-[60%] 
         xl:w-[43.6%]
          bottom-0 lg:top-16 lg:right-0
          transform 
          ${
            isOpen
              ? " translate-y-0 lg:translate-y-0 lg:translate-x-0 "
              : "translate-y-full lg:translate-y-0 lg:translate-x-full"
          }
        `}
      >
        <button
          className=" bg-[#393939] absolute z-[9999] top-4 right-4  rounded-full  "
          onClick={() => {
            toggleSidebarPanel()
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
          >
            <circle cx="15.5894" cy="15.5894" r="15.5894" fill="#353535" />
            <path
              d="M22.6211 9.22656L9.91269 21.935"
              stroke="#9B9B9B"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M21.8711 21.9336L9.16269 9.22519"
              stroke="#9B9B9B"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <div className=" lg:p-5 lg:pr-0 lg:pt-4 h-full  main overflow-auto">
          <LandscapeDetails
            actualSelectedNFT={actualSelectedNFT}
            greenPillNFTsCountInLandscape={greenPillNFTsCountInLandscape}
            gettingGreenpillCounts={gettingGreenpillCounts}
            leaderboardData={leaderboardData}
            details={landscapeDetails}
            coreWiseFunding={coreWiseFunding}
            gettingCores={gettingCores}
            loading={loading}
            gettingNFTs={gettingNFTs}
            isNFTPresent={filteredNFTs?.length > 0}
          />
          {filteredNFTs?.length > 0 && (
            <div className="pr-4">
              <YourNFTs
                onSelectingNFT={onSelectingNFT}
                gettingGreenpillCounts={gettingGreenpillCounts}
                contractDetails={activeLandScape?.contractAddresses}
              />
            </div>
          )}
          <div className="pr-4">
            <LandscapeLeaderboard
              leaderboardData={[myDetails, ...leaderboardData].filter(Boolean)}
              loading={loading}
              collectionNo={state?.activeCollection}
            />
          </div>
        </div>
      </div>
      {/* <div className="h-20 w-20  bg-black"></div> */}
      {isOpen && (
        <Footer>
          <GradientBorder
            radiusBorder={".60rem"}
            color2={"#506C6600"}
            color1={"#699F84"}
            bg="bg-[#1E3D36]"
            // shadow="shadow-button-shadow"
          >
            <button
              onClick={() => navigate("mintNew")}
              className=" px-4 py-2 flex items-center gap-2  "
            >
              <span>Mint a New NFT</span>
            </button>
          </GradientBorder>
          {filteredNFTs?.length > 0 && (
            <GradientBorder
              radiusBorder={".60rem"}
              color2={"#506C6600"}
              color1={"#699F84"}
              bg="bg-[#1E3D36]"
            >
              <button
                onClick={() => navigate("fund")}
                className=" px-4 py-2 flex items-center gap-2  "
              >
                <span>Fund Existing NFT</span>
              </button>
            </GradientBorder>
          )}
        </Footer>
      )}
    </div>
  )
}

export default SidebarModal
