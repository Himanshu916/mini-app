import React, { useEffect, useState } from "react"
import greenNFT from "../../assets/images/greenNFT.png"
import { Outlet } from "react-router-dom"
import { useHome } from "../../contexts/HomeContext"
import { useGlobalState } from "../../contexts/GlobalState"
import { getFundableBounties } from "../../apis/getFundableBounties"

const FundExistingHome = () => {
  const { state } = useHome()
  const { state: landscapesState } = useGlobalState()
  const [completedSteps, setCompletedSteps] = useState([])

  const [active, setActive] = useState(1)
  const {
    activeCollection,
    greenPillNFTsCountInLandscapes,
    greenPillNFTsHoldByWalletAddress,
  } = state
  const { landscapes } = landscapesState
  const [selectedNFT, setSelectedNFT] = useState(0)
  const [activitiesCount, setActivitiesCount] = useState({})

  const [images, setImages] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await getFundableBounties(activeCollection)
        setActivitiesCount(response1?.data)
      } catch (error) {
        console.error(error, "error")
      } finally {
      }
    }
    if (activeCollection) fetchData()
  }, [activeCollection])

  const activeLandScape = activeCollection
    ? landscapes.find(
        (landscape) => landscape.nftCollectionNumber === state?.activeCollection
      )
    : landscapes[0]
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

  const onSelectingNFT = (index) => {
    setSelectedNFT(index)
  }

  const increaseActive = () => {
    setActive((prev) => prev + 1)
  }
  const decreaseActive = () => {
    setActive((prev) => prev - 1)
  }
  const handleStepClick = (targetStep) => {
    if (targetStep < active) {
      setCompletedSteps((prev) => prev?.filter((s) => s < targetStep))
    } else {
      setCompletedSteps((prev) => {
        if (!prev?.includes(targetStep - 1)) {
          return [...prev, targetStep - 1] // Add the previous step to completedSteps if not already added
        }
      })
    }
  }

  const filteredNFTs = greenPillNFTsHoldByWalletAddress?.filter(
    (nft) => nft?.collectionNo === state?.activeCollection
  )

  const actualSelectedNFT = filteredNFTs[selectedNFT]

  return (
    <div className="min-w-[100vw] h-[calc(90vh)]    mt-16 overflow-y-auto ">
      <Outlet
        context={{
          landscapesData: landscapes,
          activeCollection: activeCollection,
          greenPillNFTsCountInLandscapes,
          selectedNFT: selectedNFT,
          onSelectingNFT: onSelectingNFT,
          actualSelectedNFT: actualSelectedNFT,
          completedSteps,
          activitiesCount,
          handleStepClick,
          setCompletedSteps: setCompletedSteps,
          active,
          setActive: setActive,
          increaseActive: increaseActive,
          decreaseActive: decreaseActive,
        }}
      />
    </div>
  )
}

export default FundExistingHome
