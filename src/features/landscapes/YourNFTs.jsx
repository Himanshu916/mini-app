import React from "react"
import ProgressBox from "../../components/ProgressBox"
import Carousel from "../../components/Carousel"
import ArrowRight from "../../assets/icons/ArrowRight"
import ArrowLeft from "../../assets/icons/ArrowLeft"
import { useSDK } from "@metamask/sdk-react"
import { useHome } from "../../contexts/HomeContext"
import Loader from "../../components/Loader"
import GradientBorder from "../../components/GradientBorder"
import { IPsToDollar } from "../../constants/IPsToDollar"

const nftsData = [{ percent: 70 }, { percent: 90 }]

const YourNFTs = ({
  contractDetails,
  nftIndex,
  onSelectingNFT,
  gettingGreenpillCounts,
  marginTop = "mt-6",
}) => {
  const { account, chainId } = useSDK()
  const { state, loading } = useHome()
  const { greenPillNFTsHoldByWalletAddress } = state

  const filteredNFTs = greenPillNFTsHoldByWalletAddress?.filter(
    (nft) => nft?.collectionNo === state?.activeCollection
  )

  return (
    <Carousel
      shouldDisplayBtns={false}
      landscapes={filteredNFTs}
      initialIndex={nftIndex ? nftIndex : 0}
      render={(data, currentIndex, goToPrev, goToNext) => {
        return (
          <GradientBorder
            radiusBorder=".4rem"
            color1="#666"
            color2="#292929"
            isNoBottomRadius={false}
            width="w-full"
            bg="bg-cardGrey"
            upperPadding="p-6"
            borderThickness="1px"
            className={marginTop}
          >
            <div className={`  rounded-lg py-3 px-4  `}>
              {loading ? (
                <Loader color="fill-[#326F58]" />
              ) : (
                <>
                  {" "}
                  <div className="flex items-center justify-between">
                    <h2 className="text-textSupportHeading font-bold mb-4">
                      Your NFTs progress
                    </h2>
                    <p className="text-textSupportHeading font-medium">
                      {currentIndex + 1} of {data.length}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {data?.length > 1 && (
                      <button
                        onClick={() => {
                          if (typeof onSelectingNFT === "function")
                            goToPrev(onSelectingNFT)
                          else goToPrev(() => {})
                        }}
                        className=" bg-[#393939]  w-10 h-10 flex items-center justify-center text-white rounded-full"
                      >
                        <ArrowLeft />
                      </button>
                    )}
                    <div className="flex-grow">
                      <div>
                        <div className="flex items-center justify-between mb-[.375rem]">
                          <p className="text-[#D1EFE0] font-bold">
                            {Number(
                              (data[currentIndex]?.totalIPs /
                                data[currentIndex]?.maxIPs) *
                                100
                            ).toFixed(2)}
                            % progress
                          </p>
                          <p className="text-[#D1EFE0]">
                            $
                            {(
                              data[currentIndex]?.totalIPs * IPsToDollar
                            )?.toFixed(2)}
                            /{data[currentIndex]?.maxIPs * IPsToDollar}
                          </p>
                        </div>

                        <ProgressBox
                          h="h-[1.25rem]"
                          percent={
                            (data[currentIndex]?.totalIPs /
                              data[currentIndex]?.maxIPs) *
                              100 >=
                            100
                              ? 100
                              : Math.round(
                                  Number(
                                    data[currentIndex]?.totalIPs /
                                      data[currentIndex]?.maxIPs
                                  ) * 100
                                )?.toFixed(2)
                          }
                          color={"bg-[#287950]"}
                        />
                      </div>
                    </div>
                    {data?.length > 1 && (
                      <button
                        onClick={() => {
                          if (typeof onSelectingNFT === "function")
                            goToNext(onSelectingNFT)
                          else goToNext(() => {})
                        }}
                        className="bg-[#393939]  w-10 h-10 flex items-center justify-center text-white rounded-full"
                      >
                        <ArrowRight />
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </GradientBorder>
        )
      }}
    />
  )
}

// name={data[currentIndex]?.name}
// region={data[currentIndex]?.region}
// collection={data[currentIndex]?.collection}
// greenPills={data[currentIndex]?.greenPills}
// greyPills={data[currentIndex]?.greyPills}
export default YourNFTs
