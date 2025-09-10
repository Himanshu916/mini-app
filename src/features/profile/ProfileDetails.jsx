import { useNavigate } from "react-router-dom"
import ProfileBio from "./ProfileBio"
import ImpactCard from "../../components/ImpactCard"
import higherTrophy from "../../assets/images/higherTrophy.png"
import TextWithTooltip from "../../components/TextWithTooltip"

import Heading from "../../components/Heading"
import ImpactFields from "../../components/ImpactFields"
import WhiteCard from "../../components/WhiteCard"

import { useEffect, useRef, useState } from "react"

import { useHome } from "../../contexts/HomeContext"
import Loader from "../../components/Loader"
import { useAuth } from "../../contexts/AuthContext"
import { formatNumberToK } from "../../helpers/convertIntoK"
import ProgressBox from "../../components/ProgressBox"

import EmptyArray from "../../components/EmptyArray"
import { fundText, getColor } from "../../constants/colors"
import { getLeaderboard } from "../../apis/leaderboard"
import GradientBorder from "../../components/GradientBorder"
import MyCollection from "../home/MyCollection"
import { useLoadingState } from "../../hooks/useLoader"
import { getExtraIPs } from "../../apis/extraIps"
import {
  collectionNotifications,
  getNotificationNumber,
} from "../../helpers/ipsHelper"
import SelectPrimaryPillModal from "../home/SelectPrimaryPillModal"
import MintNFTFromMyCollection from "../NFTs/MintNFTFromMyCollection"
import RefferalLink from "./RefferalLink"
function ProfileDetails() {
  const scrollCards = useRef()
  const { state: homeState, dispatch, loading } = useHome()
  const [extraIPs, setExtraIPs] = useState(0)
  const {
    loading: gettingMyDetails,
    startLoading: startGettingMyDetails,
    stopLoading: stopGettingMyDetails,
  } = useLoadingState()
  const {
    loading: gettingExtraIPs,
    startLoading: startGettingExtraIPs,
    stopLoading: stopGettingExtraIPS,
  } = useLoadingState()
  const { state } = useAuth()
  const [isPrimarySelectionOpen, setIsPrimarySelectionOpen] = useState(false)
  const [myDetails, setMyDetails] = useState({})

  const navigate = useNavigate()

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

  useEffect(function () {
    const fetchData = async () => {
      try {
        startGettingMyDetails()
        const [response3] = await Promise.all([
          getLeaderboard(undefined, undefined, 1, 10, true),
        ])
        setMyDetails(response3?.data)
      } catch (error) {
        console.log(error)
      } finally {
        stopGettingMyDetails()
      }
    }
    fetchData()
  }, [])
  const togglePrimarySelection = () => {
    setIsPrimarySelectionOpen(!isPrimarySelectionOpen)
  }

  const { greenPillNFTsHoldByWalletAddress } = homeState

  return (
    <>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 pb-9 gap-6">
        <div className="pt-6">
          <ProfileBio />
          <GradientBorder
            radiusBorder=".4rem"
            color1="#666"
            color2="#292929"
            isNoBottomRadius={false}
            width="w-full"
            bg="bg-cardGrey"
            upperPadding="p-6"
            borderThickness="1px"
            className={"mt-3"}
          >
            <ImpactCard
              type="POINTS"
              typeColor="text-[#D9D9D9]"
              heading="Impact Points"
              img={higherTrophy}
              stats={formatNumberToK(state?.citizen?.impactPoints?.toFixed(2))}
              rank={myDetails?.[0]?.rank}
              loading={gettingMyDetails}
              brief={`More of the network you use, more impact points you earn. IPs are used for all loyalty and incentive programs within the network.`}
              btnText="View Leaderboard"
              mT="mt-6"
              mR="mr-3"
              tooltipText="The Impact Points (IP) are XP earned based on their applied skills and effort.
                      The Impact Points are used to rank citizens on the Global Impact Index, the higher you finish the more rewards you stand to unlock."
              navigateTo="leaderboard"
            />
          </GradientBorder>
        </div>
        <div className="pt-6">
          <div className=" h-full flex flex-col">
            <TextWithTooltip
              className="leading-10 flex-shrink-0"
              hoverOverText="Impact across Cores"
              expandedTextWidth="w-[332px]"
            >
              <p className="text-[#E8E8E8]">
                Visualise your impact through the lens of the 4 key impact cores
                at Atlantis. The breakup shows the impact you had in each
                category in impact points.
              </p>
            </TextWithTooltip>

            <GradientBorder
              radiusBorder=".4rem"
              color1="#666"
              color2="#292929"
              isNoBottomRadius={false}
              width="w-full"
              bg="bg-cardGrey"
              upperPadding="p-6"
              borderThickness="1px"
              className={"mt-3 flex-1 flex flex-col"}
            >
              <WhiteCard verticalMargin="" className="p-6 h-full ">
                <ImpactFields className="" />
              </WhiteCard>
            </GradientBorder>
          </div>
        </div>
      </div>
      <div className="mb-7">
        <RefferalLink />
      </div>

      <div>
        <MyCollection
          extraIPs={extraIPs}
          isPrimarySelectionOpen={isPrimarySelectionOpen}
          togglePrimarySelection={togglePrimarySelection}
          isGradient={false}
          isPadding={false}
        />
      </div>

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
    </>
  )
}

export default ProfileDetails
