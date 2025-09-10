import React from "react"
import { fundText, getColor, getImage } from "../../constants/colors"
import { useGlobalState } from "../../contexts/GlobalState"
import { useHome } from "../../contexts/HomeContext"
import ProgressBox from "../../components/ProgressBox"
import GradientBorder from "../../components/GradientBorder"
import { ArrowRight } from "lucide-react"
import Chip from "../../components/Chip"
import {
  EarthIcon,
  FistIcon,
  MountainIcon,
  SunIcon,
  WaterIcon,
} from "../../assets/icons/ProgressBarIcons"
import Share from "../sharing/Share"
import ModalToFundActivity from "./ModalToFundActivity"
import Modal from "../../components/Modal"
import { useNavigate } from "react-router-dom"
import { formatDate } from "../../helpers/dateFormatting"
import { activityType } from "../../constants/activityType"
import ConnectWalletModal from "../authentication/ConnectWalletModal"
import { useAuth } from "../../contexts/AuthContext"
import ExpandAndContractText from "../../components/ui/ExpandAndContractText"

const collection = 5

export const cores = {
  Water: {
    icon: (
      <WaterIcon
        fillColor="#9B9B9B"
        color=""
        bg=""
        padding=""
        width="w-[.755rem]"
        height="h-[.755rem]"
      />
    ),
    label: "Water",
    bg: "bg-[#22A8DD26]",
    borderColor: "",
  },
  Earth: {
    icon: (
      <EarthIcon
        fillColor="#9B9B9B"
        color=""
        bg=""
        padding=""
        width="w-[.755rem]"
        height="h-[.755rem]"
      />
    ),
    label: "Earth",
    bg: "bg-[#36B67A26]",
    borderColor: "",
  },
  Energy: {
    icon: (
      <SunIcon
        fillColor="#9B9B9B"
        color=""
        bg=""
        padding=""
        width="w-[.755rem]"
        height="h-[.755rem]"
      />
    ),
    label: "Energy",
    bg: "bg-[#EFAA0E26]",
    borderColor: "",
  },
  Social: {
    icon: (
      <FistIcon
        fillColor="#9B9B9B"
        color=""
        bg=""
        padding=""
        width="w-[.755rem]"
        height="h-[.755rem]"
      />
    ),
    label: "Social",
    bg: "bg-[#ED1F1F26]",
    borderColor: "",
  },
}

const ActivityDetail = ({
  bounty,
  afterFunding,
  isFunded,
  setIsFunded,
  bountyId,
}) => {
  const { state: landscapesState } = useGlobalState()
  const { dispatch, state: authState, handleLogout } = useAuth()
  const navigate = useNavigate()
  const { state, gettingGreenpillCounts, loading: gettingNFTs } = useHome()
  const { greenPillNFTsCountInLandscapes } = state

  const activeLandScape = landscapesState?.landscapes.find(
    (landscape) => landscape.nftCollectionNumber === collection
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
      imageStates?.[getImage((landscapeSpecificCount?.count / 400) * 100)],
  }

  const IconToRender = activityType.find(
    (a) => a?.label === bounty?.bountyType
  )?.Icon

  return (
    <div className="flex w-full ">
      {/* LEFT SECTION */}
      <div className="flex-grow rounded-t-3xl lg:rounded-none md:bg-inherit p-4 md:p-0 flex flex-col justify-between">
        <div className="flex flex-col gap-7">
          <div>
            <div className="flex items-center justify-between relative">
              <button
                className="absolute top-[50%] translate-y-[-50%] -left-12 rounded-full"
                onClick={() => {
                  navigate(-1)
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  viewBox="0 0 30 30"
                  fill="none"
                >
                  <circle
                    cx="14.5713"
                    cy="15.4287"
                    r="14.5713"
                    fill="#353535"
                  />
                  <path
                    d="M17.6378 10.3794L16.4846 9.29346L9.96875 15.4287L16.4846 21.564L17.6378 20.4781L12.2753 15.4287L17.6378 10.3794Z"
                    fill="#fff"
                  />
                </svg>
              </button>
              <h1
                className="text-[2.65rem] font-bold text-textHeading"
                style={{
                  textShadow: "0px 0px 11.8px rgba(255, 255, 255, 0.59)",
                }}
              >
                {bounty?.bountyTitle}
              </h1>
              <Share bountyId={bountyId} />
            </div>

            <h3 className="text-textSupportHeading flex items-center gap-3 lg:mt-3">
              <span>{bounty?.landscapeName}</span>
              <span className="w-2 h-2 inline-block rounded-full bg-textSupportHeading"></span>
              <span>Collection #{bounty?.nftCollectionNumber}</span>
            </h3>
          </div>

          <div>
            <ProgressBox
              name={`Funding Progress`}
              h="h-5"
              currentData={
                bounty?.amountFunded > bounty?.amountRequested
                  ? bounty?.amountRequested
                  : bounty?.amountFunded
              }
              outOfData={bounty?.amountRequested}
              percent={
                Number(bounty?.amountFunded / bounty?.amountRequested)?.toFixed(
                  2
                ) * 100
              }
              color={
                fundText[getColor(Number(100)?.toFixed(2) * 100)]?.progress
              }
              nameClass={`font-medium text-sm ${
                fundText[getColor(Number(100)?.toFixed(2) * 100)]?.perFundText
              } `}
            />
            <p className="text-[#D0A083] text-sm mt-4">
              Funding deadline is {formatDate(bounty?.fundingRequiredBy)}
            </p>
          </div>

          <Modal>
            <Modal.Button
              opens={`${authState?.isAuthenticated ? "fund" : "connect"}`}
            >
              <GradientBorder
                radiusBorder={".313rem"}
                color1={"rgba(105, 159, 132, 1)"}
                color2={"rgba(80, 108, 102, 0)"}
                bg="bg-[#426A61]"
                width="w-full"
              >
                <button className="px-4 py-2 flex items-center gap-2 justify-center w-full">
                  <span>Fund Now</span>
                  <ArrowRight size={14} />
                </button>
              </GradientBorder>
            </Modal.Button>
            <Modal.Window name={"fund"}>
              <ModalToFundActivity
                isFunded={isFunded}
                setIsFunded={setIsFunded}
                afterFunding={afterFunding}
                bounty={bounty}
              />
            </Modal.Window>
            <Modal.Window name={"connect"}>
              <ConnectWalletModal isFromActivityPage={true} />
            </Modal.Window>
          </Modal>

          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-1 text-headingGrey text-sm">
              <img
                className="w-5 h-5 object-cover rounded-full"
                src={bounty?.organisationLogo}
                alt="org-logo"
              />
              <p>Initiated by</p>
              <p>{bounty?.organisationName}</p>
            </div>

            <div className="flex items-center gap-2">
              {bounty?.bountyCores?.[0] && (
                <Chip
                  label={bounty?.bountyCores?.[0]}
                  icon={cores?.[bounty?.bountyCores?.[0]]?.icon}
                />
              )}
              {bounty?.bountyType && (
                <Chip
                  label={bounty?.bountyType}
                  icon={<IconToRender color="#9B9B9B" />}
                />
              )}
            </div>

            <ExpandAndContractText
              isActivity={true}
              textColor="text-subHeadingGrey"
              text={bounty?.bountyDescription}
              wordLimit={70}
            />
          </div>
        </div>
      </div>

      {/* RIGHT SECTION - fixed width 14.625rem */}
      <div className="w-[24.625rem] shrink-0 h-full flex items-center justify-center rounded-t-3xl lg:rounded-t-none md:bg-none">
        <img
          className="object-cover h-full w-full"
          src={bounty?.landscapeImage}
          alt="Red NFT"
        />
      </div>
    </div>
  )
}

export default ActivityDetail
