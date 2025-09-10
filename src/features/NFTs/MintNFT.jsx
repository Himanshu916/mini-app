import { useEffect, useState } from "react"

import LandscapeLayout from "../../components/LandscapeLayout"
import Carousel from "../../components/Carousel"
import redNFT from "../../assets/images/redNFT.png"
import { useHome } from "../../contexts/HomeContext"
import ProgressBox from "../../components/ProgressBox"
import { useGlobalState } from "../../contexts/GlobalState"
import { fundText, getColor, getImage } from "../../constants/colors"
import { getGreenpillCounts } from "../../apis/getGreenPillCountInLandscape"
import { useLoadingState } from "../../hooks/useLoader"
import useGreenPillCountInLandscape from "../../hooks/useGreenPillCountInLandscape"

const MintNFT = () => {
  const { state } = useHome()
  const { greenPillNFTsCountInLandscape, gettingGreenpillCounts } =
    useGreenPillCountInLandscape(state?.activeCollection)

  const { state: landscapesState } = useGlobalState()
  const { landscapes } = landscapesState
  const { activeCollection } = state
  const [images, setImages] = useState([])

  const activeLandScapeIndex = activeCollection
    ? landscapes.findIndex(
        (landscape) => landscape.nftCollectionNumber === activeCollection
      )
    : 0

  const fetchImage = async (imageFile) => {
    try {
      const response = await fetch(imageFile)
      const data = await response.json()
      return data
    } catch (error) {
      console.log(error, "error while fetching image")
      return null
    }
  }

  useEffect(() => {
    const fetchImages = async () => {
      if (activeLandScapeIndex !== -1) {
        const activeLandScape = landscapes[activeLandScapeIndex]
        if (activeLandScape && activeLandScape.stateURIs) {
          const imagesFetched = await Promise.all(
            activeLandScape.stateURIs.map(async (imageFile) => {
              const i = await fetchImage(imageFile)

              return i
            })
          )

          setImages(imagesFetched)
        }
      }
    }

    fetchImages()
  }, [activeLandScapeIndex, landscapes])

  console.log(activeCollection, "see the active collection")

  return (
    <div className="min-w-[100vw] min-h-[calc(100vh - 4rem)] mt-16 overflow-hidden ">
      <div
        style={
          {
            // backgroundImage: `url(${BgProfile})`,
            // backgroundSize: "cover",
            // backgroundRepeat: "no-repeat",
          }
        }
        className="bg-fixed h-full"
      >
        <div className="w-[90%]  lg:w-[63.5%] mx-auto">
          <Carousel
            {...(window.innerWidth < 1024 && { shouldDisplayBtns: false })}
            landscapes={landscapes?.sort(
              (a, b) => a?.nftCollectionNumber - b?.nftCollectionNumber
            )}
            initialIndex={activeCollection - 1}
            render={(data, currentIndex, goToPrev, goToNext, goToSpecific) => {
              const imageStates =
                data[currentIndex]?.stateImages?.activeStateImages

              return (
                <LandscapeLayout
                  image={redNFT}
                  pillImage={
                    imageStates?.[
                      getImage((greenPillNFTsCountInLandscape / 400) * 100)
                    ]
                  }
                  name={data[currentIndex]?.name}
                  region={data[currentIndex]?.region}
                  gettingGreenpillCounts={gettingGreenpillCounts}
                  collection={data[currentIndex]?.nftCollectionNumber}
                  mintOptions={data[currentIndex]?.mintOptions}
                  greenPills={
                    gettingGreenpillCounts ? 0 : greenPillNFTsCountInLandscape
                  }
                  greyPills={
                    gettingGreenpillCounts
                      ? 400
                      : 400 - greenPillNFTsCountInLandscape
                  }
                  contractAddresses={data[currentIndex]?.contractAddresses}
                  goToPrev={goToPrev}
                  goToNext={goToNext}
                  goToSpecific={goToSpecific}
                  landscape={data[currentIndex]}
                  progress={
                    <ProgressBox
                      name={`Landscape progress ${Number(
                        (greenPillNFTsCountInLandscape / 400) * 100
                      ).toFixed(2)}%`}
                      percent={Number(
                        (greenPillNFTsCountInLandscape / 400) * 100?.toFixed(2)
                      )}
                      nameClass={`${
                        fundText[
                          getColor(
                            Number(
                              (greenPillNFTsCountInLandscape / 400) * 100
                            )?.toFixed(2)
                          )
                        ]?.perFundText
                      }`}
                      color={`${
                        fundText[
                          getColor(
                            Number(
                              (greenPillNFTsCountInLandscape / 400) * 100
                            )?.toFixed(2)
                          )
                        ]?.progress
                      }`}
                    />
                  }
                />
              )
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default MintNFT
