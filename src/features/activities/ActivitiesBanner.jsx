import Heading from "../../components/Heading"
import ActivityCard from "./ActivityCard"

const ActivitiesBanner = () => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading className={"text-secondaryText"} type={"medium"}>
          Activities you can fund
        </Heading>
        <p>View All</p>
      </div>

      <div className="flex ">
        <ActivityCard />
        <ActivityCard />
        <ActivityCard />
        <ActivityCard />
        <ActivityCard />
      </div>
    </div>
  )
}

export default ActivitiesBanner
