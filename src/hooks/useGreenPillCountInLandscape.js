import { useEffect, useState } from "react"
import { getGreenpillCounts } from "../apis/getGreenPillCountInLandscape"
import { useLoadingState } from "./useLoader"

const useGreenPillCountInLandscape = (collection) => {
  const [greenPillNFTsCountInLandscape, setGreenPillCountsInLandscape] =
    useState(0)
  const {
    loading: gettingGreenpillCounts,
    startLoading: startGettingGreenpillsCount,
    stopLoading: stopGettingGreenPillsCount,
  } = useLoadingState()

  useEffect(
    function () {
      const fetchData = async () => {
        try {
          startGettingGreenpillsCount()

          const response = await getGreenpillCounts(collection)

          setGreenPillCountsInLandscape(response?.data?.greenpillCount)
        } catch (error) {
          console.log(error)
        } finally {
          stopGettingGreenPillsCount()
        }
      }

      fetchData()
    },
    [collection]
  )
  return { gettingGreenpillCounts, greenPillNFTsCountInLandscape }
}

export default useGreenPillCountInLandscape
