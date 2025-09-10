import React, { useEffect, useState } from "react"
import ProgressBox from "../../components/ProgressBox"
import GradientBorder from "../../components/GradientBorder"
import BoltIcon from "../../assets/icons/BoltIcon"
import PrecisionIcon from "../../assets/icons/PrecisionIcon"
import water from "../../assets/images/water.png"
import sun from "../../assets/images/sun.png"
import earth from "../../assets/images/earth.png"
import heart from "../../assets/images/heart.png"
import { activityType } from "../../constants/activityType"
import Footer from "../../components/Footer"
import { ArrowLeft, ArrowRight, ArrowRightIcon } from "lucide-react"
import Modal from "../../components/Modal"
import ModalToFund from "./ModalToFund"
import { colors, fundText, getColor } from "../../constants/colors"
import { useNavigate, useOutletContext } from "react-router-dom"
import { getFundableBounties } from "../../apis/getFundableBounties"
import { useLoadingState } from "../../hooks/useLoader"
import Loader from "../../components/Loader"
import DeepBackButton from "../../components/DeepBackButton"

const StepTwo = ({
  name,
  image,
  onSelection,
  activity,
  core,
  region,
  collection,
  increaseActive,
  decreaseActive,
  recieverWalletAddress,
  recieverWalletAddressSolana,
  greenPills,
  greyPills,
}) => {
  const navigate = useNavigate()
  const [selectedActivity, setSelectedActivity] = useState(0)
  const { loading, startLoading, stopLoading } = useLoadingState()
  const { activeCollection, handleStepClick, actualSelectedNFT } =
    useOutletContext()
  const [bountiesCountInCore, setBountiesInCore] = useState([])
  const [activityTypes, setActivityTpes] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        startLoading()
        const response1 = await getFundableBounties(activeCollection)
        // setBountiesInCore(response1?.data?.[core]?.bountyCount)
        setActivityTpes(response1?.data?.[core]?.distribution)
      } catch (error) {
        console.error(error, "error")
      } finally {
        stopLoading()
      }
    }
    if (activeCollection) fetchData()
  }, [activeCollection])

  const activitiesToRender = Object?.keys(activityTypes)

  return (
    <>
      <div className="flex w-full flex-col-reverse  pb-16 md:pb-0  md:grid md:grid-cols-carouselLayout md:gap-28">
        <div className="md:pt-9 w-full flex flex-col bg-[#272727] md:bg-inherit p-4 md:p-0 rounded-lg  gap-6      ">
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
              Choose the activity type under{" "}
              <span className={`${colors[core]?.text}`}>'{core}'</span>
            </p>
            <p className="text-sm text-textSupportHeading ">
              What kind of activities under water do you want to fund
            </p>
          </div>
          <div>
            {loading ? (
              <Loader color={"fill-[#326F58]"} />
            ) : (
              <>
                {true ? (
                  <>
                    <div className="">
                      <div className="flex items-center flex-wrap gap-2">
                        {activityType
                          ?.filter((type) =>
                            activitiesToRender?.includes(type?.label)
                          )
                          .map((type, index) => {
                            const I = type.Icon
                            return (
                              <div
                                key={type?.label}
                                onClick={() => {
                                  if (activityTypes?.[type?.label] === 0) return
                                  setSelectedActivity(index)
                                  onSelection("activity", type?.label)
                                }}
                                className={` ${
                                  activityTypes?.[type?.label] === 0
                                    ? "hidden"
                                    : "cursor-pointer"
                                } ${
                                  activity === type?.label
                                    ? " bg-[#E9E9E9] text-[#1C1C1C] font-medium "
                                    : "bg-[#3C3C3C]"
                                }   py-[.375rem] flex items-center  gap-2 px-[.6rem] rounded-lg`}
                              >
                                <span>
                                  {
                                    <I
                                      color={
                                        activity === type?.label
                                          ? "#1C1C1C"
                                          : "#9B9B9B"
                                      }
                                    />
                                  }
                                </span>
                                <span>
                                  {type?.label} {"("}
                                  {activityTypes?.[type?.label]}
                                  {")"}
                                </span>
                              </div>
                            )
                          })}
                      </div>
                    </div>
                    <p
                      onClick={() => navigate("/activities")}
                      className="text-[#D1EFE0] cursor-pointer text-sm mt-4 flex items-center gap-1 border-b border-[#D1EFE0] w-fit pb-[2px]"
                    >
                      <span>
                        or explore activities across all landscapes you can fund
                        →
                      </span>
                      {/* <ArrowRightIcon strokeWidth={4} size={14} /> */}
                    </p>
                    <div className="mt-10">
                      <div className=" hidden md:flex items-center justify-between gap-3 ">
                        <Modal>
                          <Modal.Button opens={"fund"}>
                            <GradientBorder
                              radiusBorder={".60rem"}
                              color2={"rgba(80, 108, 102, 0)"}
                              color1={"rgba(105, 159, 132, 1)"}
                            >
                              <button
                                type="button"
                                disabled={
                                  actualSelectedNFT?.totalIPs >=
                                  actualSelectedNFT?.maxIPs
                                }
                                className={` px-4 py-2 flex items-center gap-2  ${
                                  actualSelectedNFT?.totalIPs >=
                                  actualSelectedNFT?.maxIPs
                                    ? "cursor-not-allowed"
                                    : ""
                                } `}
                              >
                                <span>Instant Funding</span>
                                <BoltIcon color="#919191" />
                              </button>
                            </GradientBorder>
                          </Modal.Button>
                          <Modal.Window name={"fund"}>
                            <ModalToFund
                              recieverWalletAddress={recieverWalletAddress}
                              recieverWalletAddressSolana={
                                recieverWalletAddressSolana
                              }
                              actualSelectedNFT={actualSelectedNFT}
                              activeCollection={activeCollection}
                              core={core}
                              activity={activity}
                            />
                          </Modal.Window>
                        </Modal>

                        <div className="flex items-center ">
                          <button
                            onClick={() => {
                              decreaseActive()
                              handleStepClick(1)
                            }}
                            className=" px-4 py-2 flex items-center gap-2  "
                          >
                            <ArrowLeft size={14} />
                            Back
                            {/* <PrecisionIcon /> */}
                          </button>
                          <button
                            disabled={activityTypes[activity] === 0}
                            onClick={() => {
                              increaseActive()
                              handleStepClick(3)
                            }}
                            className={` px-4 py-2 flex items-center gap-2 ${
                              activityTypes[activity] === 0
                                ? "cursor-not-allowed"
                                : "cursor-pointer"
                            }  `}
                          >
                            Proceed
                            <ArrowRight size={14} />
                            {/* <PrecisionIcon /> */}
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center py-3 px-4 bg-white rounded-lg gap-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        viewBox="0 0 30 30"
                        fill="none"
                      >
                        <path
                          d="M13.75 8.75H16.25V11.25H13.75V8.75ZM13.75 13.75H16.25V21.25H13.75V13.75ZM15 2.5C8.1 2.5 2.5 8.1 2.5 15C2.5 21.9 8.1 27.5 15 27.5C21.9 27.5 27.5 21.9 27.5 15C27.5 8.1 21.9 2.5 15 2.5ZM15 25C9.4875 25 5 20.5125 5 15C5 9.4875 9.4875 5 15 5C20.5125 5 25 9.4875 25 15C25 20.5125 20.5125 25 15 25Z"
                          fill="#171717"
                        />
                      </svg>
                      <p className="text-[#212121]  font-medium ">
                        We don’t have activities under this core right now.
                        However, you can proceed with{" "}
                        <span className="font-bold">‘Instant Funding’</span> .
                      </p>
                    </div>
                    <div className="mt-10">
                      <div className=" hidden md:flex items-center justify-between gap-3 ">
                        <Modal>
                          <Modal.Button opens={"fund"}>
                            <GradientBorder
                              radiusBorder={".60rem"}
                              color2={"rgba(80, 108, 102, 0)"}
                              color1={"rgba(105, 159, 132, 1)"}
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
                            />
                          </Modal.Window>
                        </Modal>

                        <div className="flex items-center ">
                          <button
                            onClick={() => {
                              decreaseActive()
                              handleStepClick(1)
                            }}
                            className=" px-4 py-2 flex items-center gap-2  "
                          >
                            <ArrowLeft size={14} />
                            Back
                            {/* <PrecisionIcon /> */}
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
        <div className="bg-fund-mobile-gradient md:bg-bg-lg w-full flex rounded-lg lg:rounded-none  flex-col items-center self-start justify-center  ">
          <img
            className=" h-[16.56rem] md:h-[32.625rem] object-cover"
            src={actualSelectedNFT?.imageURI}
            alt=""
          />
          <ProgressBox
            name={`Your progress ${((actualSelectedNFT?.totalIPs /
              actualSelectedNFT?.maxIPs) *
              100 >=
            100
              ? 100
              : Number(
                  actualSelectedNFT?.totalIPs / actualSelectedNFT?.maxIPs
                ) * 100
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
          />
        </div>
      </div>

      <Footer>
        <Modal>
          <Modal.Button opens={"fund"}>
            <GradientBorder
              radiusBorder={".60rem"}
              color2={"rgba(80, 108, 102, 0)"}
              color1={"rgba(105, 159, 132, 1)"}
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
              core={core}
              activity={activity}
            />
          </Modal.Window>
        </Modal>

        <div className="flex items-center ">
          <button
            onClick={() => {
              decreaseActive()
              handleStepClick(1)
            }}
            className=" px-4 py-2 flex items-center gap-2  "
          >
            <ArrowLeft size={14} />
            Back
          </button>
          {bountiesCountInCore > 0 && (
            <button
              onClick={() => {
                increaseActive()
                handleStepClick(3)
              }}
              className=" px-4 py-2 flex items-center gap-2  "
            >
              Proceed
              <ArrowRight size={14} />
              {/* <PrecisionIcon /> */}
            </button>
          )}
        </div>
      </Footer>
    </>
  )
}

export default StepTwo
