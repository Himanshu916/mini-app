import { Table, TableBody, TableHeader, TableRow } from "@/components/ui/table"
import RankOneIcon from "./assets/icons/RankOneIcon"
import RankTwoIcon from "./assets/icons/RankTwoIcon"
import RankThreeIcon from "./assets/icons/RankThreeIcon"
import { formatNumberToK } from "./helpers/convertIntoK"
import defaultAvatar from "./assets/images/defaultAvatar.png"
import notUpdated from "./assets/images/notupdated.png"
import { useEffect, useState } from "react"

import { fetchGreenpillCountWithColor } from "./blockchain/homepage/numberOfGreenPills"
import { useGlobalState } from "./contexts/GlobalState"
import Loader from "./components/Loader"
import { useAuth } from "./contexts/AuthContext"
import Pagination from "./components/Pagination"
import { useLocation } from "react-router-dom"

const ranks = {
  1: <RankOneIcon />,
  2: <RankTwoIcon />,
  3: <RankThreeIcon />,
}

export function LeaderboardTable({
  className,
  leaderboardData,
  currentPage,
  myLeaderDetails,
  setCurrentPage,
  loading,
  totalEntries,
  selectedLandscapes,
  color,
  entriesPerPage,
  entriesHandler,
}) {
  const [fetchedDetails, setFetchedDetails] = useState({})
  const [loadingRows, setLoadingRows] = useState({})
  const location = useLocation()
  const isLeaderboard = location.pathname.endsWith("leaderboard")
  const { state } = useGlobalState()
  const { state: authState } = useAuth()

  const contracts = state?.landscapes.flatMap((l) =>
    l?.contractAddresses?.map((obj) => ({
      ...obj,
      collectionNumber: l?.nftCollectionNumber,
    }))
  )

  const redStateURIs = state?.landscapes
    .flatMap((l) => [
      l?.stateURIs?.[0],
      l?.stateURIs?.[1],
      l?.stateURIsForSolana?.[0],
      l?.stateURIsForSolana?.[1],
    ])
    .filter(Boolean)

  const orangeStateURIs = state?.landscapes
    .flatMap((l) => [
      l?.stateURIs?.[2],
      l?.stateURIs?.[3],
      l?.stateURIsForSolana?.[2],
      l?.stateURIsForSolana?.[3],
    ])
    .filter(Boolean)

  const greenStateURIs = state?.landscapes
    .flatMap((l) => [
      l?.stateURIs?.[4],
      l?.stateURIsForSolana?.[4],
      ...(l?.shockStateURIs || []),
      ...(l?.shockStateURIsForSolana || []),
    ])
    .filter(Boolean)

  // const fetchDetailsForUser = async (address, userName, solanaWallet) => {
  //   try {
  //     setLoadingRows((prev) => ({ ...prev, [userName]: true }))

  //     if (!address && !solanaWallet) {
  //       setFetchedDetails((prev) => ({
  //         ...prev,
  //         [userName]: { redNftCount: 0, orangeNftCount: 0, greenNftCount: 0 },
  //       }))
  //       return
  //     }

  //     const counts = await fetchGreenpillCountWithColor(
  //       address,
  //       solanaWallet,
  //       contracts,
  //       redStateURIs,
  //       orangeStateURIs,
  //       greenStateURIs
  //     )

  //     setFetchedDetails((prev) => ({ ...prev, [userName]: counts }))
  //   } catch (error) {
  //     console.error("Error fetching data:", error)
  //   } finally {
  //     setLoadingRows((prev) => ({ ...prev, [userName]: false }))
  //   }
  // }

  // useEffect(() => {
  //   if (state?.landscapes?.length > 0 && leaderboardData?.length > 0) {
  //     const seen = new Set()
  //     leaderboardData.forEach(({ evmAddress, userName, walletAddress }) => {
  //       if (!seen.has(userName)) {
  //         seen.add(userName)
  //         fetchDetailsForUser(evmAddress, userName, walletAddress)
  //       }
  //     })
  //   }
  // }, [state?.landscapes, leaderboardData])

  const isSpecific = selectedLandscapes?.length > 0
  // const renderNftCount = (userName, color) => {
  //   if (loadingRows[userName]) return <Loader color="fill-[#326F58]" />
  //   if (isSpecific) {
  //     return (
  //       fetchedDetails?.[userName]?.obj?.[selectedLandscapes?.[0]]?.[
  //         `${color}NftCount`
  //       ] ?? "0"
  //     )
  //   }
  //   return fetchedDetails?.[userName]?.[`${color}NftCount`] ?? "0"
  // }

  const renderRow = (leaderboard, isMine = false) => {
    const myRow = leaderboardData?.find(
      (m) => m?.username === leaderboard?.username
    ) || {
      ...leaderboard,
      ...{
        totalImpactPoints: 0,
        amountFundedInUSD: 0,
        greenpillCount: 0,
        username: authState?.citizen?.userName,
        profileImage: authState?.citizen?.profileImage,
        rank: "-",
      },
    }

    return (
      <TableRow key={myRow?.userName}>
        <td colSpan="7" className="p-0 px-3">
          <div
            className={`grid grid-cols-10 ${
              isMine
                ? "border border-[#326F58] shadow-border-green rounded-full"
                : ""
            }`}
          >
            <div
              className={`py-3  ${
                myRow?.rank <= 3 ? "pl-5" : "pl-6"
              }  col-span-2 self-center justify-self-start`}
            >
              {myRow?.rank <= 3 ? ranks[myRow?.rank] : myRow?.rank ?? "-"}
            </div>
            <div className="py-3 flex pr-2 items-center space-x-2 col-span-3">
              <img
                src={myRow?.profileImage || notUpdated}
                alt={myRow?.username}
                className="w-8 h-8 rounded-full"
              />
              <span className="truncate">{myRow?.username}</span>
            </div>
            <div className="py-3 col-span-3 self-center justify-self-center">
              {formatNumberToK(myRow?.totalImpactPoints?.toFixed(2))}
            </div>
            {/* <div className="py-3 self-center justify-self-center">
              {renderNftCount(myRow?.userName, "red")}
            </div>
            <div className="py-3 self-center justify-self-center">
              {renderNftCount(myRow?.userName, "orange")}
            </div> */}
            <div className="py-3 self-center justify-self-center col-span-2 ">
              {myRow?.greenpillCount}
            </div>
            {/* <div className="py-3 flex items-center justify-start col-span-2 space-x-2">
              {myRow?.chainUsedMost?.image ? (
                <>
                  <img
                    src={myRow?.chainUsedMost?.image}
                    alt={myRow?.chainUsedMost?.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="capitalize">
                    {myRow?.chainUsedMost?.name}
                  </span>
                </>
              ) : (
                <div className="flex w-full items-center justify-center">
                  <span>-</span>
                </div>
              )}
            </div> */}
          </div>
        </td>
      </TableRow>
    )
  }

  return (
    <div className="overflow-auto pr-2  main">
      <Table className={`${className} min-w-[600px] overflow-hidden  `}>
        <TableHeader>
          <TableRow>
            <td colSpan="7" className="px-3">
              <div className="grid grid-cols-10">
                <p className="py-4 px-3 col-span-2 font-semibold text-base justify-self-start">
                  Rank
                </p>
                <p className="py-4 font-semibold text-base col-span-3">Name</p>
                <p className="py-4 font-semibold text-base justify-self-center col-span-3">
                  Impact Points
                </p>
                {/* <p className="py-4 font-semibold justify-self-center text-base">
                  Red
                </p>
                <p className="py-4 font-semibold justify-self-center text-base">
                  Orange
                </p> */}
                <p className="py-4 font-semibold justify-self-center text-base col-span-2">
                  Greenpills
                </p>
                {/* <p className="py-4 font-semibold justify-self-start  text-base col-span-2">
                  Chain Used Most
                </p> */}
              </div>
            </td>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <Loader color="fill-[#326F58]" />
          ) : leaderboardData?.length > 0 ? (
            [
              ...leaderboardData.map((l, i) =>
                renderRow(l, i === 0 ? true : false)
              ),
            ]
          ) : (
            <TableRow>
              <div className="py-3 pl-6 col-span-2 self-center justify-self-start">
                -
              </div>
              <div className="py-3 flex items-center space-x-2 col-span-3">
                <img
                  src={authState?.citizen.profileImage || notUpdated}
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm truncate font-medium">
                  {authState?.citizen?.userName}
                </span>
              </div>
              <div className="py-3 self-center col-span-3 justify-self-center">
                -
              </div>

              <div className="py-3 self-center justify-self-center col-span-2">
                -
              </div>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {totalEntries > 10 && (
        <div className="w-[100%]     mx-auto">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(totalEntries / 10)}
            entriesPerPage={entriesPerPage}
            entriesHandler={entriesHandler}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  )
}
