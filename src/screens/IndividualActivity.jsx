import React, { useEffect, useState } from "react"
import ActivityDetail from "../features/activities/ActivityDetail"
import GridActivities from "../features/activities/GridActivities"
import { ArrowRightIcon } from "lucide-react"
import { getExploreActivity } from "../apis/getExploreActivities"
import { useNavigate, useParams } from "react-router-dom"
import { useLoadingState } from "../hooks/useLoader"
import Loader from "../components/Loader"

const IndividualActivity = () => {
  const { loading, startLoading, stopLoading } = useLoadingState()
  const [exploreActivity, setExploreActivity] = useState({})
  const [isFunded, setIsFunded] = useState(false)
  const navigate = useNavigate()
  const { bountyId } = useParams()
  useEffect(() => {
    const fetchData = async () => {
      try {
        startLoading()
        const response1 = await getExploreActivity(bountyId)

        // setBountiesInCore(response1?.data?.[core]?.bountyCount)
        setExploreActivity(response1?.data)
      } catch (error) {
        console.error(error, "error")
      } finally {
        stopLoading()
      }
    }
    fetchData()
  }, [bountyId])

  const mapExploreActivities = (exploreActivitites, setExploreActivities) => {
    const updateActivities = exploreActivitites?.map((activity) => {
      if (activity.bountyId === exploreActivity.bountyId) {
        return { ...activity, amountFunded: exploreActivity.amountFunded }
      }
      return activity
    })
    setExploreActivities(updateActivities)
  }

  const afterFunding = (fundAmount) => {
    setExploreActivity((prev) => {
      return { ...prev, amountFunded: prev.amountFunded + Number(fundAmount) }
    })
  }

  return (
    <div className="w-[67%] mx-auto mt-9 ">
      {loading ? (
        <div className="flex items-center bg-cardGrey rounded-md justify-center h-52 col-span-2">
          <Loader color={"fill-[#326F58]"} />
        </div>
      ) : (
        <ActivityDetail
          isFunded={isFunded}
          afterFunding={afterFunding}
          setIsFunded={setIsFunded}
          bounty={exploreActivity}
          bountyId={bountyId}
        />
      )}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-3">
          <h1
            className="text-2xl font-bold text-textHeading"
            style={{
              textShadow: "0px 0px 11.8px rgba(255, 255, 255, 0.59)",
            }}
          >
            Explore more activities you can fund
          </h1>

          <p
            onClick={() => navigate("/activities")}
            className="text-subHeadingGrey flex items-center  cursor-pointer gap-1 font-semibold "
          >
            <>
              {" "}
              <span>View all</span> <ArrowRightIcon strokeWidth={4} size={14} />
            </>
          </p>
        </div>
        <div className="pb-9">
          <GridActivities
            isFunded={isFunded}
            mapExploreActivities={mapExploreActivities}
            fromIndividual={true}
          />
        </div>
      </div>
    </div>
  )
}

export default IndividualActivity
