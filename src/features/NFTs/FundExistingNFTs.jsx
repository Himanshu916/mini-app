import React, { useEffect, useState } from "react"

import Carousel from "../../components/Carousel"
import greenNFT from "../../assets/images/greenNFT.png"

import FundLandscapeLayout from "../../components/FundLandscapeLayout"
import { useOutletContext } from "react-router-dom"
import { getLeaderboard } from "../../apis/leaderboard"
import { useLoadingState } from "../../hooks/useLoader"
import { getImage } from "../../constants/colors"

const FundExistingNFTs = () => {
  const {
    landscapesData,
    activeCollection,
    greenPillNFTsCountInLandscapes,
    selectedNFT,
    actualSelectedNFT,

    onSelectingNFT,
  } = useOutletContext()
  const individualLandscape = landscapesData?.find(
    (landscape) => landscape?.nftCollectionNumber === parseInt(activeCollection)
  )
  console.log(activeCollection, "activeCollection")
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
      <Carousel
        landscapes={landscapesData?.sort(
          (a, b) => a?.nftCollectionNumber - b?.nftCollectionNumber
        )}
        shouldDisplayBtns={false}
        initialIndex={activeCollection - 1}
        render={(data, currentIndex) => {
          const landscapeSpecificCount = greenPillNFTsCountInLandscapes.find(
            (count) =>
              count?.landscapeCollection ===
              data[currentIndex]?.nftCollectionNumber
          )
          const imageStates = data[currentIndex]?.stateImages?.activeStateImages
          console.log(
            data,
            data[currentIndex],
            currentIndex,
            "activeCollection"
          )
          return (
            <FundLandscapeLayout
              image={greenNFT}
              pillImage={
                imageStates?.[
                  getImage((landscapeSpecificCount?.count / 400) * 100)
                ]
              }
              name={data[currentIndex]?.name}
              region={data[currentIndex]?.region}
              collection={data[currentIndex]?.nftCollectionNumber}
              contractAddresses={data[currentIndex?.contractAddresses]}
              onSelectingNFT={onSelectingNFT}
              recieverWalletAddress={individualLandscape?.treasuryWalletAddress}
              recieverWalletAddressSolana={
                individualLandscape?.solanaTreasuryWalletAddress
              }
              greenPills={landscapeSpecificCount?.count}
              greyPills={400 - landscapeSpecificCount?.count}
              landscape={data[currentIndex]}
            />
          )
        }}
      />
    </div>
  )
}

export default FundExistingNFTs
