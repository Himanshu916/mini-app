import React, { useEffect, useState } from "react"
import ProgressBox from "../../components/ProgressBox"
import GradientBorder from "../../components/GradientBorder"
import BoltIcon from "../../assets/icons/BoltIcon"
import PrecisionIcon from "../../assets/icons/PrecisionIcon"
import water from "../../assets/images/water.png"
import sun from "../../assets/images/sun.png"
import earth from "../../assets/images/earth.png"
import heart from "../../assets/images/heart.png"
import Footer from "../../components/Footer"
import { ArrowRight } from "lucide-react"
import Modal from "../../components/Modal"
import ModalToFund from "./ModalToFund"
import { useOutletContext } from "react-router-dom"
import DeepBackButton from "../../components/DeepBackButton"
import { fundText, getColor } from "../../constants/colors"
import { getFundableBounties } from "../../apis/getFundableBounties"
import { useLoadingState } from "../../hooks/useLoader"

export const cores = [
  {
    image: water,
    label: "Water",
    bg: "bg-[#22A8DD26]",
    borderColor: "",
  },
  {
    image: earth,
    label: "Earth",
    bg: "bg-[#36B67A26]",
    borderColor: "",
  },
  {
    image: sun,
    label: "Energy",
    bg: "bg-[#EFAA0E26]",
    borderColor: "",
  },
  {
    image: heart,
    label: "Social",
    bg: "bg-[#ED1F1F26]",
    borderColor: "",
  },
]

const StepOne = ({
  name,
  image,
  region,
  collection,
  increaseActive,
  onSelection,
  recieverWalletAddress,
  recieverWalletAddressSolana,
  core,
  decreaseActive,
  greenPills,
  greyPills,
}) => {
  const [selectedCore, setSelectedCore] = useState(0)
  const { loading, startLoading, stopLoading } = useLoadingState()

  const {
    landscapesData,
    activeCollection,
    greenPillNFTsCountInLandscapes,
    activitiesCount,
    selectedNFT,
    actualSelectedNFT,
    handleStepClick,
  } = useOutletContext()

  return (
    <>
      <div className="flex w-full flex-col-reverse  pb-16 md:pb-0  md:grid md:grid-cols-carouselLayout md:gap-28">
        <div className=" w-full flex flex-col bg-[#272727] md:bg-inherit p-4 md:p-0 rounded-lg  gap-6                ">
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
              {region || "hddh"}
              <span className=" w-2 h-2 inline-block rounded-full mx-1  bg-textSupportHeading"></span>{" "}
              Collection #{collection}
            </h3>
          </div>
          <div>
            <p className="text-lg font-semibold">
              Choose the impact core you prefer
            </p>
            <p className="text-sm text-textSupportHeading ">
              Funding activities are based on impact cores
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4  gap-5">
            {cores.map((core, index) => (
              <div
                onClick={() => {
                  setSelectedCore(index)
                  onSelection("core", cores[index]?.label)
                }}
                className="flex flex-col  w-full items-center gap-2"
                key={core?.label}
              >
                <div
                  className={`${core?.bg} p-12 w-full rounded-lg ${
                    selectedCore === index ? "border-2 border-[#fff]" : ""
                  }   `}
                >
                  <div className="flex items-center justify-center">
                    <img
                      className="w-10 h-10 object-contain"
                      src={core?.image}
                      alt={core?.label}
                    />
                  </div>
                </div>
                <div>
                  <p className="text-sm capitalize text-center font-bold">
                    {core?.label}
                  </p>
                  <p className="text-center text-[#B6B6B6] text-sm font-medium">
                    {activitiesCount?.[core?.label]?.bountyCount || 0}{" "}
                    activities
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className=" hidden md:flex items-center justify-between gap-3 mt-6">
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
                      actualSelectedNFT?.totalIPs >= actualSelectedNFT?.maxIPs
                    }
                    className={` px-4 py-2 flex items-center gap-2  ${
                      actualSelectedNFT?.totalIPs >= actualSelectedNFT?.maxIPs
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
                  recieverWalletAddressSolana={recieverWalletAddressSolana}
                  actualSelectedNFT={actualSelectedNFT}
                  activeCollection={activeCollection}
                  core={core}
                />
              </Modal.Window>
            </Modal>

            <button
              type="button"
              disabled={
                activitiesCount?.[cores[selectedCore]?.label]?.bountyCount === 0
              }
              onClick={() => {
                if (!core) {
                  alert("please select a core")
                  return
                }

                increaseActive()
                handleStepClick(2)
              }}
              className={` px-4 py-2 flex items-center gap-2  ${
                activitiesCount?.[cores[selectedCore]?.label]?.bountyCount === 0
                  ? "cursor-not-allowed"
                  : ""
              } `}
            >
              Proceed <ArrowRight size={14} />
            </button>
          </div>
        </div>
        <div className="bg-fund-mobile-gradient md:bg-bg-lg w-full flex rounded-lg lg:rounded-none  flex-col items-center self-start justify-center   ">
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
                disabled={
                  actualSelectedNFT?.totalIPs >= actualSelectedNFT?.maxIPs
                }
                className={` px-4 py-2 flex items-center gap-2  ${
                  actualSelectedNFT?.totalIPs >= actualSelectedNFT?.maxIPs
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
              recieverWalletAddressSolana={recieverWalletAddressSolana}
              actualSelectedNFT={actualSelectedNFT}
              activeCollection={activeCollection}
              core={core}
            />
          </Modal.Window>
        </Modal>

        <button
          onClick={() => {
            if (!core) {
              alert("please select a core")
              return
            }

            increaseActive()
            handleStepClick(2)
          }}
          className=" px-4 py-2 flex items-center gap-2  "
        >
          <span>Proceed</span>
          <ArrowRight size={14} />
        </button>
      </Footer>
    </>
  )
}

export default StepOne
