import React, { useState } from "react"
import RedirectIcon from "../assets/icons/RedirectIcon"
import GradientBorder from "./GradientBorder"
import DottedPills from "./DottedPills"
import openSea from "../assets/images/openSea.png"

import ProgressBox from "./ProgressBox"
import Modal from "./Modal"
import ModalToFund from "../features/precisionFunding/ModalToFund"
import MintNFTModal from "../features/NFTs/MintNFTModal"
import Pagination from "./Pagination"
import Upperpaging from "./UpperPaging"
import { useHome } from "../contexts/HomeContext"
import Loader from "./Loader"
const landscapesData = [
  {
    name: "Amazon Rainforest",
    region: "",
    collection: 1,
    greenPills: 220,
    greyPills: 180,
  },
  {
    name: "Andes",
    region: "",
    collection: 2,
    greenPills: 220,
    greyPills: 180,
  },
  {
    name: "Rocky Mountains",
    region: "",
    collection: 3,
    greenPills: 220,
    greyPills: 180,
  },
  {
    name: "Sierra Madre",
    region: "",
    collection: 4,
    greenPills: 220,
    greyPills: 180,
  },
  {
    name: "Carparthian Mountains",
    region: "",
    collection: 5,
    greenPills: 220,
    greyPills: 180,
  },
  {
    name: "Anatolian Plateau",
    region: "",
    collection: 6,
    greenPills: 220,
    greyPills: 180,
  },
  {
    name: "Western Ghats",
    region: "",
    collection: 7,
    greenPills: 220,
    greyPills: 180,
  },
  {
    name: "Guinea Forest",
    region: "",
    collection: 8,
    greenPills: 220,
    greyPills: 180,
  },
  {
    name: "Mekong Basin",
    region: "",
    collection: 9,
    greenPills: 220,
    greyPills: 180,
  },
  {
    name: "Malay Archipelago",
    region: "",
    collection: 10,
    greenPills: 220,
    greyPills: 180,
  },
]
const LandscapeLayout = ({
  name,
  image,
  region,
  gettingGreenpillCounts,
  collection,
  greenPills,

  greyPills,
  contractAddresses,
  goToPrev,
  goToNext,
  goToSpecific,
  landscape,
  progress,
  pillImage,
}) => {
  const [currentPage, setCurrentPage] = useState(collection)

  return (
    <div>
      <Upperpaging
        currentPage={currentPage}
        totalPages={100 / 10}
        onPageChange={setCurrentPage}
        goToPrev={goToPrev}
        goToNext={goToNext}
        goToSpecific={goToSpecific}
        isTotal={false}
        className=" hidden md:block"
      />
      <div className="flex w-full flex-col-reverse mt-1 pb-16 md:pb-0  md:grid md:grid-cols-carouselLayout md:gap-28">
        <div className=" w-full flex flex-col bg-[#272727] md:bg-inherit p-4 md:p-0 rounded-lg  gap-6     ">
          <div>
            <h1
              className="text-2xl md:text-5xl font-bold text-textHeading  "
              style={{
                textShadow: "0px 0px 11.8px rgba(255, 255, 255, 0.59)",
              }}
            >
              {name}
            </h1>

            <h3 className="text-textSupportHeading flex items-center gap-3  lg:mt-3">
              <span>{region}</span>
              <span className=" w-2 h-2 inline-block rounded-full   bg-textSupportHeading"></span>{" "}
              <span>Collection #{collection}</span>
            </h3>
            {progress && <div className="mt-4  md:hidden  ">{progress}</div>}
          </div>

          <div className="">
            <div>
              <Modal>
                <Modal.Button opens={"mint"}>
                  <GradientBorder
                    radiusBorder={".25rem"}
                    color2={"#506C6600"}
                    color1={"#699F84"}
                    bg="bg-[#1E3D36]"
                    shadow="shadow-button-shadow"
                  >
                    <button
                      type="button"
                      className=" px-4 py-2 flex items-center gap-2 w-[7.5rem]  justify-center"
                    >
                      <span>Mint Now</span>
                    </button>
                  </GradientBorder>
                </Modal.Button>
                <Modal.Window name={"mint"}>
                  <MintNFTModal
                    contractAddresses={contractAddresses}
                    landscape={landscape}
                  />
                </Modal.Window>
              </Modal>
            </div>
          </div>
          <div className="">
            <div>
              {gettingGreenpillCounts ? (
                <div className="mb-2">
                  <Loader color="fill-[#326F58]" />
                </div>
              ) : (
                <h3 className="text-xl font-bold mb-2">
                  {greenPills}/{greenPills + greyPills}
                  <span className="ml-1">greenpills transformed</span>
                </h3>
              )}
            </div>
            <DottedPills
              numberGreen={gettingGreenpillCounts ? 0 : greenPills}
              numberGrey={gettingGreenpillCounts ? 400 : greyPills}
            />
          </div>
          <div className="flex flex-col gap-3">
            <p>
              This landscape is a symbolic representation of regenerative work
              happening around the region of the {name}, {region}
            </p>
            <div>
              <p>Buy a red pill and enter into the under belly of chaos.</p>
              <p>Fight your way into turning your pill green.</p>
            </div>

            <p>
              A green pill opens the gateways to Atlantis. A borderless world
              where changemakers are building, creating and forging worlding
              changing solutions.
            </p>
          </div>
        </div>

        <div className="bg-mint-mobile-gradient md:bg-bg-lg w-full flex rounded-lg lg:rounded-none  flex-col items-center justify-center ">
          <img
            className=" h-[16.56rem] md:h-[32.625rem] object-cover"
            src={pillImage}
            alt=""
          />
          <div className="hidden md:block">{progress && progress}</div>
        </div>
        <Upperpaging
          currentPage={currentPage}
          totalPages={100 / 10}
          onPageChange={setCurrentPage}
          goToPrev={goToPrev}
          goToNext={goToNext}
          goToSpecific={goToSpecific}
          isTotal={false}
        />
      </div>
    </div>
  )
}

export default LandscapeLayout
