import React, { useState } from "react"
import { useNavigate, useOutletContext, useParams } from "react-router-dom"

import greenNFT from "../../assets/images/greenNFT.png"
import StepOne from "../precisionFunding/StepOne"
import StepTwo from "../precisionFunding/StepTwo"
import StepThree from "../precisionFunding/StepThree"
import { useForm } from "react-hook-form"
import CompletedStep from "../../components/CompletedStep"
import { getImage } from "../../constants/colors"

const PrecisionFunding = () => {
  const {
    landscapesData,
    activeCollection,
    greenPillNFTsCountInLandscapes,
    completedSteps,
    active,
    increaseActive,
    decreaseActive,
  } = useOutletContext()

  const [dataToFund, setDataToFund] = useState({
    core: "Water",
    activity: "Code",
    bounties: [],
  })
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()
  const navigate = useNavigate()

  const onSelection = (type, value) => {
    setDataToFund((initial) => ({ ...initial, [type]: value }))
    setValue(type, value) // Sync with react-hook-form
  }

  const onSubmit = (data) => {}

  const { collection } = useParams()

  const individualLandscape = landscapesData?.find(
    (landscape) => landscape?.nftCollectionNumber === parseInt(collection)
  )

  const landscapeSpecificCount = greenPillNFTsCountInLandscapes.find(
    (count) =>
      count?.landscapeCollection === individualLandscape?.nftCollectionNumber
  )
  const imageStates = individualLandscape?.stateImages?.activeStateImages

  return (
    <div
      style={
        {
          // backgroundImage: `url(${BgProfile})`,
          // backgroundSize: "cover",
          // backgroundRepeat: "no-repeat",
        }
      }
      className="bg-fixed w-[90%]  lg:w-[67%]    mx-auto h-full"
    >
      <div className="mt-9 ">
        <div className="   flex  self-center mb-6 gap-4">
          <button
            className={` bg-[#393939] md:hidden    rounded-full  `}
            onClick={() => {
              navigate(-1)
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="38"
              height="38"
              viewBox="0 0 38 38"
              fill="none"
            >
              <circle cx="19" cy="19" r="19" fill="#262626" />
              <path
                d="M23 12.416L21.4962 11L13 19L21.4962 27L23 25.584L16.0076 19L23 12.416Z"
                fill="#F0F0F0"
              />
            </svg>
          </button>
          {Array.from({ length: 3 }, (_, i) => i + 1).map((number, index) => {
            const isIncluded = completedSteps?.includes(number)
            return (
              <button
                className={` ${
                  isIncluded ? "bg-[#18382D]  text-[#7CBAA6]" : " "
                }  rounded-full  w-10 h-10 aspect-square flex !cursor-default items-center justify-center ${
                  active === number
                    ? "bg-[#18382D] border-2 border-[#7CBAA6] text-[#7CBAA6]"
                    : " border-borderColor "
                }`}
                variant="tertiary"
                size="circle"
                key={number + index}
              >
                {" "}
                {isIncluded ? <CompletedStep /> : number}
              </button>
            )
          })}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="h-full ">
          {active === 1 && (
            <StepOne
              name={individualLandscape?.name}
              recieverWalletAddress={individualLandscape?.treasuryWalletAddress}
              recieverWalletAddressSolana={
                individualLandscape?.solanaTreasuryWalletAddress
              }
              image={
                imageStates?.[
                  getImage((landscapeSpecificCount?.count / 400) * 100)
                ]
              }
              onSelection={onSelection}
              core={dataToFund?.core}
              region={individualLandscape?.region}
              collection={individualLandscape?.nftCollectionNumber}
              greenPills={individualLandscape?.greenPills}
              greyPills={individualLandscape?.greyPills}
              increaseActive={increaseActive}
              decreaseActive={decreaseActive}
            />
          )}
          {active === 2 && (
            <StepTwo
              name={individualLandscape?.name}
              recieverWalletAddress={individualLandscape?.treasuryWalletAddress}
              image={
                imageStates?.[
                  getImage((landscapeSpecificCount?.count / 400) * 100)
                ]
              }
              onSelection={onSelection}
              activity={dataToFund?.activity}
              recieverWalletAddressSolana={
                individualLandscape?.solanaTreasuryWalletAddress
              }
              core={dataToFund?.core}
              region={individualLandscape?.region}
              collection={individualLandscape?.nftCollectionNumber}
              greenPills={individualLandscape?.greenPills}
              greyPills={individualLandscape?.greyPills}
              increaseActive={increaseActive}
              decreaseActive={decreaseActive}
            />
          )}
          {active === 3 && (
            <StepThree
              name={individualLandscape?.name}
              image={
                imageStates?.[
                  getImage((landscapeSpecificCount?.count / 400) * 100)
                ]
              }
              region={individualLandscape?.region}
              recieverWalletAddressSolana={
                individualLandscape?.solanaTreasuryWalletAddress
              }
              recieverWalletAddress={individualLandscape?.treasuryWalletAddress}
              activity={dataToFund?.activity}
              core={dataToFund?.core}
              bounties={dataToFund?.bounties}
              onSelection={onSelection}
              collection={individualLandscape?.nftCollectionNumber}
              greenPills={individualLandscape?.greenPills}
              greyPills={individualLandscape?.greyPills}
              increaseActive={increaseActive}
              decreaseActive={decreaseActive}
            />
          )}
        </form>
      </div>
    </div>
  )
}

export default PrecisionFunding
