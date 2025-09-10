import { createContext, useContext, useEffect, useReducer } from "react"
import { getLandscapes } from "../apis/landscapes"
import { useLoadingState } from "../hooks/useLoader"
import { getWalletNFTs } from "../blockchain/homepage/nftsHoldByWalletAddress"
import { fetchGreenpillCount } from "../blockchain/homepage/numberOfGreenPills"
import { useSDK } from "@metamask/sdk-react"
import {
  getFundingLeaderboard,
  getLeaderboard,
  getUserSpecificStats,
} from "../apis/leaderboard"
import { useGlobalState } from "./GlobalState"
import useAccount from "../hooks/useAccount"
import { useAuth } from "./AuthContext"
import {
  getGreenpillCounts,
  getGreenpillCountsForAllLandscapes,
} from "../apis/getGreenPillCountInLandscape"

const HomeContext = createContext()
const getInitialActiveCollection = () => {
  const stored = localStorage.getItem("activeCollection")
  try {
    return stored ? JSON.parse(stored) : 1
  } catch {
    return null
  }
}
const initialState = {
  activeCollection: getInitialActiveCollection(),
  greenPillNFTsHoldByWalletAddress: [],
  greenPillNFTsCountInLandscapes: [],
  hoverData: [],
  userStats: null,
}

function reducer(state, action) {
  switch (action.type) {
    case "home/setHomeDetails":
      return {
        ...state,
        greenPillNFTsHoldByWalletAddress: action.payload?.walletNFTs,
      }
    case "home/setGreenpillCounts":
      return {
        ...state,
        greenPillNFTsCountInLandscapes: action.payload?.landscapesGreenCount,
      }
    case "home/setScriptInfos":
      return { ...state }

    case "home/setUserSpecificStats":
      return { ...state, userStats: action.payload }

    case "home/setActiveCollection":
      const updatedCollection = action.payload
      localStorage.setItem(
        "activeCollection",
        JSON.stringify(updatedCollection)
      )
      return { ...state, activeCollection: updatedCollection }
    // return { ...state, activeCollection: action.payload }

    case "setHoveredData":
      return {
        ...state,
        hoverData: action?.payload,
      }

    case "home/allocateIPs":
      console?.log(action?.payload, "kar diya tokenize ")
      const nftsAfterAllocation = state.greenPillNFTsHoldByWalletAddress.map(
        (nft) => {
          if (
            nft?.chainName + nft?.contractAddress + nft?.tokenId ===
            action?.payload?.id
          )
            return {
              ...nft,
              totalIPs:
                Number(nft?.totalIPs) + Number(action.payload?.allocateIPs),
            }
          else return nft
        }
      )

      return {
        ...state,
        greenPillNFTsHoldByWalletAddress: nftsAfterAllocation,
      }
    default:
      return state
  }
}

const HomeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { state: landscapesState } = useGlobalState()
  const { state: authState } = useAuth()
  const {
    loading: gettingHoverData,
    startLoading: startGettingHoverData,
    stopLoading: stopGettingHoverData,
  } = useLoadingState()
  const account = authState?.citizen?.evmAddress
  const solanaAccount = authState?.citizen?.walletAddress
  // const { account } = useAccount()
  const { loading, startLoading, stopLoading } = useLoadingState()
  const {
    loading: gettingGreenpillCounts,
    startLoading: startGettingGreenpillCounts,
    stopLoading: stopGettingGreenpillCounts,
  } = useLoadingState()
  const fetchNFT = async (
    chainId,
    contractAddress,
    nftCollectionNumber,
    chainName,
    collectionAddress,
    name,
    chainImage
  ) => {
    try {
      const response = await getWalletNFTs(
        contractAddress,
        chainName !== "solana" ? account : solanaAccount,
        chainId,
        nftCollectionNumber,
        chainName,
        collectionAddress,
        name,
        chainImage
      )

      return response
    } catch (error) {
      return null
    }
  }

  const fetchCounts = async () => {
    try {
      startGettingGreenpillCounts()

      // const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

      const landscapes = landscapesState?.landscapes || []

      const aggregatedResults = []

      for (let landscape of landscapes) {
        const { nftCollectionNumber } = landscape

        const response = await getGreenpillCountsForAllLandscapes(
          nftCollectionNumber
        )

        aggregatedResults.push(response)

        // Sequentially call each fetchGreenCount for current landscape

        // aggregatedResults.push({
        //   count: landscapeTotal,
        //   landscapeCollection: nftCollectionNumber,
        // })
      }

      const countsFetched = aggregatedResults

      dispatch({
        type: "home/setGreenpillCounts",
        payload: {
          landscapesGreenCount: countsFetched,
        },
      })
    } catch (error) {
      console.error(error, "erroe")
    } finally {
      stopGettingGreenpillCounts()
    }
  }

  // const fetchData = async () => {
  //   try {
  //     startLoading()

  //     const nftsFetched = []

  //     const nftPromises = landscapesState?.landscapes.flatMap(
  //       ({ contractAddresses, nftCollectionNumber, name }) => {
  //         return contractAddresses
  //           .filter(({ chainId }) => {
  //             return chainId !== 11155420
  //           })
  //           .map(
  //             ({
  //               chainId,
  //               contractAddress,
  //               chainName,
  //               collectionAddress,
  //               chainImage,
  //             }) =>
  //               fetchNFT(
  //                 chainId,
  //                 contractAddress,
  //                 nftCollectionNumber,
  //                 chainName,
  //                 collectionAddress,
  //                 name,
  //                 chainImage
  //               )
  //           )
  //       }
  //     )

  //     const fetchedNFTs = await Promise.all(nftPromises)

  //     fetchedNFTs.forEach((nft) => nftsFetched.push(...nft))

  //     dispatch({
  //       type: "home/setHomeDetails",
  //       payload: {
  //         walletNFTs: nftsFetched,
  //       },
  //     })
  //   } catch (error) {
  //     console.error(error, "erroe")
  //   } finally {
  //     stopLoading()
  //   }
  // }

  const fetchData = async () => {
    try {
      startLoading()

      const landscapes = landscapesState?.landscapes || []

      const aggregatedNFTs = []
      const timeStart = new Date()?.getTime()
      for (let landscape of landscapes) {
        const { contractAddresses, nftCollectionNumber, name } = landscape

        const results = await Promise.all(
          contractAddresses.map(
            ({
              chainId,
              contractAddress,
              chainName,
              collectionAddress,
              chainImage,
            }) =>
              fetchNFT(
                chainId,
                contractAddress,
                nftCollectionNumber,
                chainName,
                collectionAddress,
                name,
                chainImage
              )
          )
        )

        aggregatedNFTs.push(...results.flat())

        // const calls = contractAddresses.map(
        //   ({
        //     chainId,
        //     contractAddress,
        //     chainName,
        //     collectionAddress,
        //     chainImage,
        //   }) =>
        //     fetchNFT(
        //       chainId,
        //       contractAddress,
        //       nftCollectionNumber,
        //       chainName,
        //       collectionAddress,
        //       name,
        //       chainImage
        //     )
        // )

        // const results = await Promise.all(calls)

        // for (const res of results) {
        //   if (Array.isArray(res)) {
        //     aggregatedNFTs.push(...res)
        //   }
        // }
      }
      const timeEnd = new Date()?.getTime()

      dispatch({
        type: "home/setHomeDetails",
        payload: {
          walletNFTs: aggregatedNFTs,
        },
      })
    } catch (error) {
      console.error(error, "error")
    } finally {
      stopLoading()
    }
  }

  useEffect(
    function () {
      if (landscapesState?.landscapes?.length > 0 && (account || solanaAccount))
        fetchData()
      if (landscapesState?.landscapes.length > 0) fetchCounts()
    },
    [landscapesState?.landscapes, account, solanaAccount]
  )

  useEffect(() => {
    const fetchAllLeaderboards = async () => {
      try {
        startGettingHoverData()

        const results = await Promise.all(
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(async (item) => {
            try {
              const response = await getFundingLeaderboard(
                item,
                undefined,
                1,
                100,
                false
              )
              return {
                nftCollectionNumber: item,
                data: response?.data || [],
              }
            } catch (err) {
              console.error(
                `Failed to fetch leaderboard for collection ${item.nftCollectionNumber}`,
                err
              )
              return null
            }
          })
        )

        const filteredResults = results.filter(Boolean)
        // setAllLeaderboardData(filteredResults)
        dispatch({ type: "setHoveredData", payload: filteredResults })
      } catch (error) {
        console.error("Error fetching all leaderboards", error)
      } finally {
        stopGettingHoverData()
      }
    }

    if (authState?.isAuthenticated) fetchAllLeaderboards() // run once on mount
  }, [authState?.isAuthenticated])

  return (
    <HomeContext.Provider
      value={{
        state,
        dispatch,
        loading,
        gettingGreenpillCounts,
        fetchData,
        gettingHoverData,
      }}
    >
      {children}
    </HomeContext.Provider>
  )
}

const useHome = () => {
  return useContext(HomeContext)
}

export { HomeProvider, useHome }

// this code is causing problem for rate limiter.
// const countsPromises = await Promise.all(
//   landscapesState?.landscapes
//     .filter(({ nftCollectionNumber }) => nftCollectionNumber < 3)
//     .flatMap(
//       ({
//         contractAddresses,
//         stateURIs,
//         nftCollectionNumber,
//         shockStateURIs,
//         stateURIsForSolana,
//         shockStateURIsForSolana,
//       }) =>
//         contractAddresses
//           .filter(({ chainId }) => {
//             return chainId !== 11155420
//           })
//           .map(
//             ({
//               chainId,
//               contractAddress,
//               chainName,
//               collectionAddress,
//             }) =>
//               fetchGreenCount(
//                 chainId,
//                 contractAddress,
//                 chainName === "solana"
//                   ? [
//                       stateURIsForSolana ? stateURIsForSolana?.[4] : "",
//                       ...(shockStateURIsForSolana
//                         ? shockStateURIsForSolana
//                         : []),
//                     ]
//                   : [stateURIs[4], ...shockStateURIs],
//                 nftCollectionNumber,
//                 chainName,
//                 collectionAddress
//               )
//           )
//     )
// )

// const fetchedCounts = await Promise.all(countsPromises)
// const combinedCount = fetchedCounts?.reduce((acc, curr) => {
//   const findLandscape = acc.findIndex(
//     (nft) => nft.landscapeCollection === curr?.landscapeCollection
//   )
//   if (findLandscape === -1) {
//     return [...acc, curr]
//   } else {
//     acc[findLandscape].count += curr.count
//     return acc
//   }
// }, [])
// combinedCount.forEach((nft) => countsFetched.push(nft))
