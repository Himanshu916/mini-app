import React, { useEffect, useState } from "react"
import { Table, TableBody, TableHeader, TableRow } from "@/components/ui/table"
import RankOneIcon from "../../assets/icons/RankOneIcon"
import RankTwoIcon from "../../assets/icons/RankTwoIcon"
import RankThreeIcon from "../../assets/icons/RankThreeIcon"
import notUpdated from "../../assets/images/notupdated.png"
import { useNavigate } from "react-router-dom"
import { formatNumberToK } from "../../helpers/convertIntoK"
import Loader from "../../components/Loader"
import { useLoadingState } from "../../hooks/useLoader"
import { useAuth } from "../../contexts/AuthContext"
import { getLeaderboard } from "../../apis/leaderboard"
import Pagination from "../../components/Pagination"
import { fetchGreenpillCountWithColor } from "../../blockchain/homepage/numberOfGreenPills"
import { useGlobalState } from "../../contexts/GlobalState"

const ranks = {
  1: <RankOneIcon />,
  2: <RankTwoIcon />,
  3: <RankThreeIcon />,
}

const LandscapeLeaderboard = ({
  className,
  leaderboardData,
  loading,
  collectionNo,
}) => {
  const navigate = useNavigate()
  const [fetchedDetails, setFetchedDetails] = useState({})
  const [loadingRows, setLoadingRows] = useState({})
  const { state } = useAuth()
  const { state: landscapesState } = useGlobalState()
  const contracts = landscapesState?.landscapes.flatMap((l) =>
    l?.contractAddresses?.map((obj) => ({
      ...obj,
      collectionNumber: l?.nftCollectionNumber,
    }))
  )

  const redStateURIs = landscapesState?.landscapes
    .flatMap((l) => [
      l?.stateURIs?.[0],
      l?.stateURIs?.[1],
      l?.stateURIsForSolana?.[0],
      l?.stateURIsForSolana?.[1],
    ])
    .filter(Boolean)

  const orangeStateURIs = landscapesState?.landscapes
    .flatMap((l) => [
      l?.stateURIs?.[2],
      l?.stateURIs?.[3],
      l?.stateURIsForSolana?.[2],
      l?.stateURIsForSolana?.[3],
    ])
    .filter(Boolean)

  const greenStateURIs = landscapesState?.landscapes
    .flatMap((l) => [
      l?.stateURIs?.[4],
      l?.stateURIsForSolana?.[4],
      ...(l?.shockStateURIs || []),
      ...(l?.shockStateURIsForSolana || []),
    ])
    .filter(Boolean)

  const renderNftCount = (userName, color) => {
    if (loadingRows[userName]) return <Loader color="fill-[#326F58]" />

    return (
      fetchedDetails?.[userName]?.obj?.[collectionNo]?.[`${color}NftCount`] ??
      "-"
    )
  }

  const renderRow = (leaderboard, isMine = false, index) => {
    const myRow = leaderboardData?.find(
      (m) => m?.username === leaderboard?.username
    ) || {
      ...leaderboard,
      ...{
        totalImpactPoints: 0,
        amountFundedInUSD: 0,
        greenpillCount: 0,
        username: state?.citizen?.userName,
        profileImage: state?.citizen?.profileImage,
        rank: "-",
      },
    }

    return (
      <TableRow key={myRow.username + index}>
        <td colSpan="7" className="p-0 px-3">
          <div
            className={` grid grid-cols-8 ${
              isMine
                ? "border border-[#326F58] shadow-border-green rounded-full"
                : ""
            }`}
          >
            <div
              className={`py-3 col-span-2 ${
                myRow?.rank <= 3 ? "pl-5" : "pl-6"
              }  self-center justify-self-start`}
            >
              {myRow.rank <= 3 ? ranks[myRow.rank] : myRow.rank ?? "-"}
            </div>
            <div className="py-3 flex items-center space-x-2 col-span-2">
              <img
                src={myRow?.profileImage || notUpdated}
                alt={myRow?.username}
                className="w-8 h-8 rounded-full"
              />
              <span className="truncate">{myRow?.username}</span>
            </div>
            <div className=" py-3 self-center col-span-2 justify-self-center">
              <span className="text-sm  font-medium">
                {myRow?.fundingImpactPoints
                  ? "$" +
                    formatNumberToK(
                      (myRow?.fundingImpactPoints / 14.4)?.toFixed(2)
                    )
                  : "$0"}
              </span>
            </div>
            {/* <div className=" py-3 self-center justify-self-center  text-sm font-medium  ">
            {renderNftCount(myRow.userName, "red")}
          </div>
          <div className=" py-3 self-center justify-self-center  text-sm font-medium  ">
            {renderNftCount(myRow.userName, "orange")}
          </div> */}
            <div className=" py-3 self-center col-span-2 justify-self-center  text-sm font-medium  ">
              {myRow?.greenpillCount}
            </div>
          </div>
        </td>
      </TableRow>
    )
  }

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

  //     // const counts = await fetchGreenpillCountWithColor(
  //     //   address,
  //     //   solanaWallet,
  //     //   contracts,
  //     //   redStateURIs,
  //     //   orangeStateURIs,
  //     //   greenStateURIs
  //     // )

  //     setFetchedDetails((prev) => ({
  //       ...prev,
  //       [userName]: {
  //         redNftCount: 0,
  //         orangeNftCount: 0,
  //         greenNftCount: 0,
  //         [contracts[0]?.collectionNumber]: {
  //           redNftCount: 0,
  //           orangeNftCount: 0,
  //           greenNftCount: 0,
  //         },
  //       },
  //     }))
  //     // setFetchedDetails((prev) => ({ ...prev, [userName]: counts }))
  //   } catch (error) {
  //     console.error("Error fetching data:", error)
  //   } finally {
  //     setLoadingRows((prev) => ({ ...prev, [userName]: false }))
  //   }
  // }

  // useEffect(() => {
  //   if (
  //     landscapesState?.landscapes?.length > 0 &&
  //     leaderboardData?.length > 0
  //   ) {
  //     const seen = new Set()
  //     leaderboardData.forEach(({ evmAddress, userName, walletAddress }) => {
  //       if (!seen.has(userName)) {
  //         seen.add(userName)
  //         fetchDetailsForUser(evmAddress, userName, walletAddress)
  //       }
  //     })
  //   }
  // }, [landscapesState?.landscapes, leaderboardData])

  const myLeaderDetails =
    leaderboardData?.find(
      (leader) => leader?.evmAddress === state?.citizen?.evmAddress
    ) || state?.citizen

  return (
    <div className="mb-24 mt-6">
      <div className="flex px-3 items-center justify-between">
        <h3 className="text-textSupportHeading font-bold">Leaderboard</h3>
        <p
          onClick={() => navigate("/profile/leaderboard")}
          className="text-textSupportHeading font-medium cursor-pointer hover:underline "
        >
          View All
        </p>
      </div>
      <Table className={`${className} min-w-[600px] overflow-auto`}>
        <TableHeader>
          <TableRow>
            <td colSpan="7" className=" px-3">
              <div className="grid grid-cols-8 ">
                <p className=" py-4 text-sm font-medium pl-4 col-span-2 ">
                  Rank
                </p>
                <p className=" py-4 text-sm font-medium col-span-2 ">Name</p>
                <p className=" py-4 text-sm col-span-2 font-medium  justify-self-center ">
                  Funded
                </p>
                {/* <p className=" py-4 text-sm font-medium  justify-self-center">
                  Red
                </p>
                <p className=" py-4 text-sm font-medium justify-self-center">
                  Orange
                </p> */}
                <p className=" py-4 text-sm font-medium  col-span-2 justify-self-center">
                  Greenpills
                </p>
              </div>
            </td>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <div className="w-full flex justify-center items-center ">
              <Loader color="fill-[#326F58]" />
            </div>
          ) : leaderboardData?.length > 0 ? (
            [
              ...leaderboardData.map((l, i) =>
                renderRow(l, i === 0 ? true : false)
              ),
            ]
          ) : (
            <TableRow className="">
              {/* Wrapping the row's content in a div */}
              <td colSpan="7" className={` px-3 rounded-full`}>
                <div
                  className={` grid grid-cols-8
                  rounded-full shadow-border-green   border border-[#326F58]  `}
                >
                  <div className=" col-span-2 self-center pl-6  justify-self-start py-3 ">
                    -
                  </div>
                  <div className=" py-3 flex items-center space-x-2 col-span-2">
                    <img
                      src={state?.citizen.profileImage || notUpdated}
                      alt={state?.citizen?.userName + "image"}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm truncate font-medium">
                      {state?.citizen?.userName}
                    </span>
                  </div>
                  <div className=" py-3 col-span-2 self-center justify-self-center ">
                    -
                  </div>
                  {/* <div className=" py-3 self-center justify-self-center text-sm font-medium  ">
                    -
                  </div>
                  <div className=" py-3 self-center justify-self-center  text-sm font-medium ">
                    -
                  </div> */}
                  <div className=" py-3 self-center  col-span-2 justify-self-center text-sm font-medium ">
                    -
                  </div>
                </div>
              </td>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default LandscapeLeaderboard
