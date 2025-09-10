import React, { useCallback } from "react"
import Chip from "../../components/Chip"

import ProgressBox from "../../components/ProgressBox"
import { fundText, getColor } from "../../constants/colors"
import {
  EarthIcon,
  FistIcon,
  MountainIcon,
  SunIcon,
  WaterIcon,
} from "../../assets/icons/ProgressBarIcons"
import { useNavigate } from "react-router-dom"
import { formatDate } from "../../helpers/dateFormatting"
import { activityType } from "../../constants/activityType"
import { BountyDescription } from "../../components/BountyDescription"

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
const ActivityCard = ({
  width = "w-full",
  className,
  onNavigation,
  bounty,
  setTruncated,
}) => {
  const descRef = useCallback(
    (node) => {
      if (node && setTruncated) {
        // Only update if truncated state changes
        const isTruncated = node.scrollHeight > node.clientHeight
        setTruncated(isTruncated)
      }
    },
    [setTruncated, bounty?.description]
  )
  const navigate = useNavigate()
  const checkBoxHandler = () => {}

  const IconToRender = activityType?.find((a) => a?.label === bounty?.type)
    ?.label
    ? activityType?.find((a) => a?.label === bounty?.type)?.Icon
    : null

  return (
    <div
      onClick={() => onNavigation(bounty?.bountyId)}
      className={` bg-[#2F2F2F]    cursor-pointer ${width} min-w-[22.32rem]  flex flex-col   p-4 rounded-lg ${className}     `}
    >
      <p className="capitalize text-headingGrey mb-[.375rem]  font-semibold">
        {bounty?.title}
      </p>
      <div className="flex items-center gap-1 mb-2  text-headingGrey text-sm  ">
        <img
          className="w-5 h-5 object-cover rounded-full"
          src={bounty?.organisationLogo}
          alt="org-logo"
        />
        <p>Initiated by</p>

        <p className="flex-1 truncate">{bounty?.organisationName}</p>
      </div>

      <div className="flex items-center gap-2">
        <Chip
          label={bounty?.landscapeName}
          icon={<MountainIcon padding="" width="w-5" height="h-5" />}
        />
        <Chip label={bounty?.cores[0]} icon={cores?.[bounty?.cores[0]]?.icon} />
        {IconToRender && (
          <Chip
            label={bounty?.type}
            icon={
              <IconToRender
                width="w-[1rem]"
                height="h-[1rem]"
                color="#9B9B9B"
              />
            }
          />
        )}
      </div>

      {/* <p
        ref={descRef}
        className="text-subHeadingGrey my-3  text-xs line-clamp-3 min-h-[3.75em]"
      >
        {bounty?.description}
      </p> */}

      <BountyDescription
        html={bounty?.description}
        className="prose text-subHeadingGrey my-3 prose    [&_p:empty]:before:content-['\00a0'] [&_p:empty]:inline-block  text-xs line-clamp-3   "
      />

      <div className="flex ">
        <ProgressBox
          name={`Funding Progress`}
          currentData={bounty?.amountFunded}
          outOfData={bounty?.amountRequested}
          percent={
            Number(bounty?.amountFunded / bounty?.amountRequested)?.toFixed(2) *
            100
          }
          color={fundText[getColor(Number(100)?.toFixed(2) * 100)]?.progress}
          nameClass={`font-medium text-sm ${
            fundText[getColor(Number(100)?.toFixed(2) * 100)]?.perFundText
          } `}
        />
      </div>
      <p className="text-[#D0A083] text-xs mt-3  ">
        Last date to fund- {formatDate(bounty?.fundingRequiredBy)}
      </p>
    </div>
  )
}

export default ActivityCard

// ${
//         selectedBounties.includes(index)
//           ? "border-2 border-[#264E41] bg-[#081B17]"
//           : "bg-[#3C3C3C] "
//       }
