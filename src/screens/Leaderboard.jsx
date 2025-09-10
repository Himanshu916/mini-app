import React, { useEffect, useState } from "react"
import { LeaderboardTable } from "../LeaderboardTable"
import Bg from "../assets/bg.png"
import StatsCard from "../components/StatsCard"
import Trophy from "../assets/icons/Trophy"
import { useLoadingState } from "../hooks/useLoader"
import { getEntryCount, getLeaderboard } from "../apis/leaderboard"
import { useAuth } from "../contexts/AuthContext"
import { formatNumberToK } from "../helpers/convertIntoK"
import LeaderboardFilter from "../features/profile/LeaderboardFilter"

const Leaderboard = () => {
  const { loading, startLoading, stopLoading } = useLoadingState()
  const { state } = useAuth()

  const {
    loading: gettingMyDetails,
    startLoading: startGettingMyDetails,
    stopLoading: stopGettingMyDetails,
  } = useLoadingState()
  const [myDetails, setMyDetails] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [totalEntries, setTotalEntries] = useState(0)
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [selectedLandscapes, setSelectedLandscapes] = useState([])

  const [leaderboardData, setLeaderboardData] = useState([])

  const entriesHandler = (val) => {
    setEntriesPerPage(val)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        startGettingMyDetails()
        const response3 = await getLeaderboard(
          selectedLandscapes.length === 0 ? undefined : selectedLandscapes[0],
          undefined,
          currentPage,
          entriesPerPage,
          true
        )

        setMyDetails(response3?.data[0])
      } catch (error) {
        console.error(error, "error")
      } finally {
        stopGettingMyDetails()
      }
    }
    fetchData()
  }, [selectedLandscapes])

  useEffect(
    function () {
      const fetchData = async () => {
        try {
          startLoading()

          if (selectedLandscapes.length === 0) {
            const [response2, response3] = await Promise.all([
              getLeaderboard(
                undefined,
                undefined,
                currentPage,
                entriesPerPage,
                false
              ),
              getEntryCount(),
            ])

            setLeaderboardData(response2?.data)
            setTotalEntries(response3?.data)
          } else {
            const [response2, response3] = await Promise.all([
              getLeaderboard(
                selectedLandscapes[0],
                undefined,
                currentPage,
                entriesPerPage,
                false
              ),
              getEntryCount(selectedLandscapes[0]),
            ])

            setLeaderboardData(response2?.data)
            setTotalEntries(response3?.data)
          }
        } catch (error) {
          console.error(error, "error")
        } finally {
          stopLoading()
        }
      }
      fetchData()
    },
    [selectedLandscapes, currentPage, entriesPerPage]
  )

  return (
    <div
      style={{
        backgroundImage: `url(${Bg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
      className="bg-fixed min-h-screen"
    >
      <div className=" w-[90%]   lg:w-[67%]  mx-auto  pb-9">
        <div className="pt-9 ">
          <h1
            className="text-6xl font-bold text-textHeading "
            style={{
              textShadow: "0px 0px 11.8px rgba(255, 255, 255, 0.59)",
            }}
          >
            Leaderboard
          </h1>
          <h6 className="text-sm text-textSupportHeading mt-1">
            More of the network you use, more impact points you earn. IPs are
            used for all loyalty and incentive programs within the network
          </h6>
        </div>
        <div className=" flex items-center gap-3 my-5">
          <StatsCard
            label="Greenpills"
            stats={myDetails?.greenpillCount}
            loading={gettingMyDetails}
          />
          <StatsCard
            label="IP unlocked till now"
            symbol={<Trophy />}
            stats={
              myDetails?.totalImpactPoints
                ? Number(myDetails?.totalImpactPoints)?.toFixed(2)
                : 0
            }
            loading={gettingMyDetails}
          />
          <StatsCard
            label="My Rank"
            symbol={<p className="text-4xl font-medium ">#</p>}
            stats={myDetails?.rank || "-"}
            loading={gettingMyDetails}
          />
        </div>
        <div className="flex items-center justify-between  mt-8 mb-4">
          <LeaderboardFilter
            selectedLandscapes={selectedLandscapes}
            setSelectedLandscapes={setSelectedLandscapes}
            onChangingLandscape={() => setCurrentPage(1)}
          />
          {totalEntries > 10 && myDetails?.rank && (
            <button
              onClick={() => {
                setCurrentPage(Math.ceil(myDetails?.rank / 10))
              }}
              // disabled={disabled}
              className="flex items-center gap-2 text-[#C5C5C5]  justify-center  w-fit min-w-44 font-medium  bg-[#1E3D3673] rounded-lg px-4 py-2 "
              type="button"
            >
              <span>Go to my rank</span>
            </button>
          )}
        </div>
        <div>
          <LeaderboardTable
            leaderboardData={[myDetails, ...leaderboardData]}
            selectedLandscapes={selectedLandscapes}
            myLeaderDetails={myDetails}
            loading={loading}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalEntries={totalEntries}
            entriesPerPage={entriesPerPage}
            entriesHandler={entriesHandler}
            color="fill-[#326F58]"
          />
        </div>
      </div>
    </div>
  )
}

export default Leaderboard
