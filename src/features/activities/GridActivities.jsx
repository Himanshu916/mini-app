import { useNavigate, useParams } from "react-router-dom"
import ActivityCard from "./ActivityCard"
import { useEffect, useState } from "react"
import { useLoadingState } from "../../hooks/useLoader"
import { getExploreActivities } from "../../apis/getExploreActivities"
import Loader from "../../components/Loader"
import EmptyArray from "../../components/EmptyArray"

const GridActivities = ({
  className,
  fromIndividual = false,
  isFunded,
  mapExploreActivities,
}) => {
  const navigate = useNavigate()
  const { loading, startLoading, stopLoading } = useLoadingState()
  const [exploreActivities, setExploreActivities] = useState([])
  const { bountyId } = useParams()
  useEffect(() => {
    const fetchData = async () => {
      try {
        startLoading()
        const response1 = await getExploreActivities()

        // setBountiesInCore(response1?.data?.[core]?.bountyCount)
        setExploreActivities(response1?.data)
      } catch (error) {
        console.error(error, "error")
      } finally {
        stopLoading()
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    isFunded && mapExploreActivities(exploreActivities, setExploreActivities)
  }, [isFunded])

  const filteredExploreActivities = bountyId
    ? exploreActivities?.filter((a) => a?.bountyId !== bountyId)
    : exploreActivities

  return (
    <div className={`grid grid-cols-2 gap-6  ${className} `}>
      {loading ? (
        <div className="flex items-center bg-cardGrey rounded-md justify-center h-52 col-span-2">
          <Loader color={"fill-[#326F58]"} />
        </div>
      ) : filteredExploreActivities?.length > 0 ? (
        filteredExploreActivities?.map((bounty) => {
          return (
            <ActivityCard
              onNavigation={(id) =>
                fromIndividual
                  ? navigate(`/activities/${id}`)
                  : navigate(`${id}`)
              }
              width="w-[30rem]"
              className={"mr-5"}
              bounty={bounty}
            />
          )
        })
      ) : (
        <div className="flex items-center bg-cardGrey rounded-md justify-center h-52 col-span-2">
          <p>No Activities Available</p>
        </div>
      )}
    </div>
  )
}

export default GridActivities
