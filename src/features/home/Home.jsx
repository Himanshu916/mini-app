import { useEffect, useState } from "react"
import PillsMap from "./PillsMap"
import SidebarModal from "../landscapes/SidebarModal"
import { useGlobalState } from "../../contexts/GlobalState"
import Animation from "../onboarding/Animation"
import HomeModal from "./HomeModal"
import { useAuth } from "../../contexts/AuthContext"
import StatsCard from "../../components/StatsCard"
import Trophy from "../../assets/icons/Trophy"
import { getFundingLeaderboard, getLeaderboard } from "../../apis/leaderboard"
import { useLoadingState } from "../../hooks/useLoader"
import { formatNumberToK } from "../../helpers/convertIntoK"
import { useNavigate } from "react-router-dom"
import MyCollection from "./MyCollection"
import ActivitiesYouCanFund from "./ActivitiesYouCanFund"
import SelectPrimaryPillModal from "./SelectPrimaryPillModal"
import { getExtraIPs } from "../../apis/extraIps"
import {
  collectionNotifications,
  getNotificationNumber,
} from "../../helpers/ipsHelper"
import { useHome } from "../../contexts/HomeContext"
import MintNFTModal from "../NFTs/MintNFTModal"
import MintNFTFromMyCollection from "../NFTs/MintNFTFromMyCollection"
import CountdownTimer from "../onboarding/CountdownTimer"
import { ArrowRightIcon } from "lucide-react"

const Home = () => {
  const { showAnimation, setShowAnimation } = useGlobalState()
  const [extraIPs, setExtraIPs] = useState(0)
  const {
    loading: gettingExtraIPs,
    startLoading: startGettingExtraIPs,
    stopLoading: stopGettingExtraIPS,
  } = useLoadingState()
  const navigate = useNavigate()
  const {
    loading: loadingLeaderboard,
    startLoading,
    stopLoading,
  } = useLoadingState()
  const [isOpen, setIsOpen] = useState(false)
  const [isPrimarySelectionOpen, setIsPrimarySelectionOpen] = useState(false)
  const [leaderboardData, setLeaderboardData] = useState({})
  const [showContent, setShowContent] = useState(false)
  const { state, dispatch: authDispatch } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const { state: homeState } = useHome()
  const { state: landscapesState } = useGlobalState()

  const { firstTime } = state

  useEffect(() => {
    if (showAnimation) {
      const timer = setTimeout(() => {
        setShowAnimation(false)
        setShowContent(true)
      }, 2200)
      return () => clearTimeout(timer)
    }
  }, [showAnimation, setShowAnimation])

  useEffect(() => {
    const fetchData = async () => {
      try {
        startLoading()

        const [response1, response2] = await Promise.all([
          getLeaderboard(undefined, undefined, 1, 10, true),
          getFundingLeaderboard(undefined, undefined, 1, 10, true, "heree"),
        ])

        setLeaderboardData(response1?.data[0])
      } catch (error) {
        console.error(error, "error")
      } finally {
        stopLoading()
      }
    }
    fetchData()
  }, [])
  useEffect(() => {
    if (firstTime) {
      const modalTimer = setTimeout(() => {
        setShowModal(true)

        authDispatch({ type: "offFirstTime" })
      }, 3000)
      return () => clearTimeout(modalTimer)
    }
  }, [firstTime])

  useEffect(() => {
    const fetchData = async () => {
      try {
        startGettingExtraIPs()
        const response1 = await getExtraIPs()

        setExtraIPs(response1?.data?.unusedImpactPoints)
        // setBountiesInCore(response1?.data?.[core]?.bountyCount)
        // setExploreActivities(response1?.data)
      } catch (error) {
        console.error(error, "error")
      } finally {
        stopGettingExtraIPS()
      }
    }
    fetchData()
  }, [])

  const handleOpenModal = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }
  const toggleSidebarPanel = () => {
    setIsOpen(!isOpen)
  }
  const togglePrimarySelection = () => {
    setIsPrimarySelectionOpen(!isPrimarySelectionOpen)
  }

  const { greenPillNFTsHoldByWalletAddress } = homeState

  return (
    <div>
      {showAnimation ? (
        <Animation />
      ) : (
        <div
          className={`mt-16 min-w-[100vw] ${
            showModal
              ? "h-[90vh]  overflow-y-hidden"
              : "overflow-y-auto h-[100vh]"
          }  transition-opacity duration-3000 ${
            showContent ? "opacity-100" : ""
          }`}
        >
          {showModal && <HomeModal close={handleCloseModal} />}

          <div className="mt-8">
            <h1
              className="text-4xl lg:text-5xl px-4 md:px-0  text-center font-semibold text-textHeading"
              style={{
                textShadow: "0px 0px 11.8px rgba(255, 255, 255, 0.59)",
              }}
            >
              Greenpill Landscapes
            </h1>
          </div>
          <div className="mt-4">
            <p className="text-[#BFBFBF] text-2xl font-medium text-center mb-3 ">
              Time left to Greenpill the World:
            </p>
            <CountdownTimer />
          </div>
          <div className="bg-fixed h-[calc(100vh)] relative flex items-center justify-center">
            <div className="absolute pb-5 left-0 right-0 top-0 z-50 bg-pillsMap-upperGradient">
              <div className="flex mt-5 items-center justify-center ">
                <button
                  onClick={() => navigate("/profile/leaderboard")}
                  className="bg-[#1E3D36] font-medium text-white flex items-center gap-2 cursor-pointer py-2 px-3 rounded-[.313rem] "
                >
                  <span>View Leaderboard</span>{" "}
                  <ArrowRightIcon fontWeight={600} size={14} />
                </button>
              </div>
            </div>

            <div className="mt-16   overflow-auto">
              <PillsMap
                landscapes={landscapesState?.landscapes}
                toggleSidebarPanel={toggleSidebarPanel}
              />
            </div>
          </div>
          <div className="-mt-24">
            <MyCollection
              extraIPs={extraIPs}
              isPrimarySelectionOpen={isPrimarySelectionOpen}
              togglePrimarySelection={togglePrimarySelection}
              isGradient={true}
            />
          </div>
          <div className="p-11 pb-8 hidden md:block">
            <ActivitiesYouCanFund />
          </div>

          <SidebarModal
            isOpen={isOpen}
            toggleSidebarPanel={toggleSidebarPanel}
          />
          {isPrimarySelectionOpen &&
            (collectionNotifications[
              getNotificationNumber(greenPillNFTsHoldByWalletAddress)
            ]?.operation === "tokenize" ? (
              <SelectPrimaryPillModal
                extraIPs={extraIPs}
                setExtraIPs={setExtraIPs}
                text={
                  collectionNotifications[
                    getNotificationNumber(greenPillNFTsHoldByWalletAddress)
                  ]?.text
                }
                close={togglePrimarySelection}
                isPrimarySelectionOpen={isPrimarySelectionOpen}
                togglePrimarySelection={togglePrimarySelection}
              />
            ) : (
              <MintNFTFromMyCollection close={togglePrimarySelection} />
            ))}
        </div>
      )}
    </div>
  )
}

export default Home
