import React, { useEffect, useState } from "react"
import ProgressBox from "../../components/ProgressBox"
import GradientBorder from "../../components/GradientBorder"
import BoltIcon from "../../assets/icons/BoltIcon"
import PrecisionIcon from "../../assets/icons/PrecisionIcon"
import water from "../../assets/images/water.png"
import sun from "../../assets/images/sun.png"
import earth from "../../assets/images/earth.png"
import heart from "../../assets/images/heart.png"
import CheckboxIcon from "../../assets/icons/CheckboxIcon"
import Modal from "../../components/Modal"
import FundModal from "../fund/FundModal"
import { getBounties } from "../../apis/precisionFunding"
import ModalToFund from "./ModalToFund"
import { colors, fundText, getColor } from "../../constants/colors"
import dollarSign from "../../assets/images/dollarSign.png"
import { useOutletContext } from "react-router-dom"

import { useLoadingState } from "../../hooks/useLoader"
import Loader from "../../components/Loader"
import { formatNumberToK } from "../../helpers/convertIntoK"
import { ArrowRight } from "lucide-react"

import ModalToFundStep3 from "./ModalToFundStep3"
import DeepBackButton from "../../components/DeepBackButton"
import { formatDate } from "../../helpers/dateFormatting"
import ExpandAndContractText from "../../components/ui/ExpandAndContractText"

const StepThree = ({
  name,
  region,
  collection,
  image,
  activity,
  core,
  bounties,
  onSelection,
  increaseActive,
  decreaseActive,
  recieverWalletAddress,
  recieverWalletAddressSolana,
  greenPills,
  greyPills,
}) => {
  const [selectedBounties, setSelectedBounties] = useState([0])
  const { loading, startLoading, stopLoading } = useLoadingState()
  const { activeCollection, actualSelectedNFT, handleStepClick } =
    useOutletContext()
  const checkBoxHandler = (index) => {
    if (selectedBounties.includes(index))
      setSelectedBounties((initial) => initial.filter((i) => i !== index))
    else setSelectedBounties((initial) => [...initial, index])
  }

  useEffect(
    function () {
      const fetchBounties = async () => {
        try {
          startLoading()
          const response = await getBounties(collection, core, activity)
          onSelection("bounties", response?.data)

          return response
        } catch (error) {
          return null
        } finally {
          stopLoading()
        }
      }
      fetchBounties()
    },
    [core, activity, collection]
  )

  const bountiesExtracted = selectedBounties?.map((selected) => {
    return bounties?.[selected]
  })

  return (
    <div className=" flex w-full flex-col-reverse items-center md:items-start pb-16 md:pb-0 md:h-full  md:grid md:grid-cols-carouselLayout md:gap-28">
      <div className="md:pt-9 w-full flex flex-col bg-[#272727] md:bg-inherit md:h-full   p-4   md:p-0 rounded-lg  gap-6 ">
        <div>
          <div className="relative">
            <div className="hidden md:block">
              <DeepBackButton />
            </div>
            <h1
              className=" text-2xl md:text-6xl font-bold text-textHeading "
              style={{
                textShadow: "0px 0px 11.8px rgba(255, 255, 255, 0.59)",
              }}
            >
              {name}
            </h1>
          </div>

          <h3 className="text-textSupportHeading  mt-3">
            {region || ""}
            <span className=" w-2 h-2 inline-block rounded-full mx-1  bg-textSupportHeading"></span>{" "}
            Collection #{collection}
          </h3>
        </div>
        <div>
          <p className="text-lg font-semibold">
            Select from a list of activities under{" "}
            <span className={`${colors[core]?.text}`}>
              ' {core} + {activity} '
            </span>
          </p>
          <p className="text-sm text-textSupportHeading">
            Select from a list of activities
          </p>
        </div>
        <div className="flex  flex-col bounties flex-grow overflow-y-auto items-center gap-5 main md:pr-4 pb-6 md:pb-24">
          {loading ? (
            <Loader color="fill-[#326F58]" />
          ) : bounties?.length > 0 ? (
            bounties.map((bounty, index) => (
              <div
                onClick={() => checkBoxHandler(index)}
                key={index}
                className={`  cursor-pointer  w-full flex flex-col gap-3 rounded-lg px-5 py-4  ${
                  selectedBounties.includes(index)
                    ? "border-2 border-[#264E41] bg-[#081B17]"
                    : "bg-[#3C3C3C] "
                }     `}
              >
                <div>
                  <div className="flex items-center gap-1">
                    <CheckboxIcon
                      onSelection={() => checkBoxHandler(index)}
                      checked={selectedBounties.includes(index)}
                    />
                    <p className="capitalize font-semibold">{bounty?.title}</p>
                  </div>
                  <div className="flex items-center gap-1 text-headingGrey mt-1 text-sm">
                    <img
                      className="w-5 h-5 object-cover rounded-full"
                      src={bounty?.organisationLogo}
                      alt="org-logo"
                    />
                    <p>Initiated by</p>
                    <p>{bounty?.organisationName}</p>
                  </div>
                </div>

                <ExpandAndContractText
                  isActivity={true}
                  textColor={"text-cardGreyBounty"}
                  text={bounty?.description}
                  wordLimit={20}
                />

                <div>
                  <ProgressBox
                    name={`Funding Progress`}
                    currentData={bounty?.amountFunded}
                    outOfData={bounty?.amountRequested}
                    percent={
                      Number(
                        bounty?.amountFunded / bounty?.amountRequested
                      )?.toFixed(2) * 100
                    }
                    color={
                      fundText[getColor(Number(100)?.toFixed(2) * 100)]
                        ?.progress
                    }
                    nameClass={`font-medium ${
                      fundText[getColor(Number(100)?.toFixed(2) * 100)]
                        ?.perFundText
                    } `}
                  />
                  <p className="text-[#D0A083] text-sm mt-3  ">
                    Last date to fund- {formatDate(bounty?.fundingRequiredBy)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="">No bounties available</p>
          )}
        </div>
      </div>
      <div className="bg-fund-mobile-gradient md:bg-bg-lg w-full flex rounded-lg lg:rounded-none  flex-col items-center self-start justify-center ">
        <img
          className="  h-[16.56rem] md:h-[32.625rem] object-cover"
          src={actualSelectedNFT?.imageURI}
          alt=""
        />

        {/* <ProgressBox
          name={`Your progress ${((actualSelectedNFT?.totalIPs /
            actualSelectedNFT?.maxIPs) *
            100 >=
          100
            ? 100
            : Number(actualSelectedNFT?.totalIPs / actualSelectedNFT?.maxIPs) *
              100
          ).toFixed(2)}%`}
          percent={
            (actualSelectedNFT?.totalIPs / actualSelectedNFT?.maxIPs) * 100 >=
            100
              ? 100
              : Number(
                  actualSelectedNFT?.totalIPs / actualSelectedNFT?.maxIPs
                ) * 100
          }
          nameClass={`${
            fundText[
              getColor(
                ((actualSelectedNFT?.totalIPs / actualSelectedNFT?.maxIPs) *
                  100 >=
                100
                  ? 100
                  : Number(
                      actualSelectedNFT?.totalIPs / actualSelectedNFT?.maxIPs
                    ) * 100
                )?.toFixed(2)
              )
            ]?.perFundText
          }`}
          color={`${
            fundText[
              getColor(
                ((actualSelectedNFT?.totalIPs / actualSelectedNFT?.maxIPs) *
                  100 >=
                100
                  ? 100
                  : Number(
                      actualSelectedNFT?.totalIPs / actualSelectedNFT?.maxIPs
                    ) * 100
                )?.toFixed(2)
              )
            ]?.progress
          }`}
        /> */}
      </div>
      {bounties?.length > 0 && (
        <div className="footer fixed bottom-0 left-0 right-0 bg-[#98D9CA17]  backdrop-blur-fund-footer py-4">
          <div className="w-[90%] md:w-[67%] mx-auto ">
            <div className=" gap-28">
              <div className="flex items-center justify-between">
                <Modal>
                  <Modal.Button opens={"fund"}>
                    <GradientBorder
                      radiusBorder={".60rem"}
                      color2={"#506C6600"}
                      color1={"#699F84"}
                      bg="bg-[#426A61]"
                    >
                      <button
                        disabled={selectedBounties?.length === 0}
                        className={`px-4  py-2 flex items-center gap-2  ${
                          selectedBounties?.length === 0
                            ? "cursor-not-allowed"
                            : ""
                        } `}
                      >
                        <span>Fund Now</span>
                        <ArrowRight size={14} />
                      </button>
                    </GradientBorder>
                  </Modal.Button>
                  <Modal.Window name={"fund"}>
                    <ModalToFundStep3
                      bounties={bountiesExtracted}
                      recieverWalletAddress={recieverWalletAddress}
                      recieverWalletAddressSolana={recieverWalletAddressSolana}
                      actualSelectedNFT={actualSelectedNFT}
                      activeCollection={collection}
                      core={core}
                      activity={activity}
                      bountyIds={bounties
                        ?.map((bounty) => bounty?.bountyId)
                        .filter((_, index) => selectedBounties.includes(index))}
                    />
                  </Modal.Window>
                </Modal>
              </div>
              <div></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StepThree
