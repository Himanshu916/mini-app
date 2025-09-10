import { useEffect, useState } from "react"
import {
  EarthIcon,
  FistIcon,
  SunIcon,
  WaterIcon,
} from "../assets/icons/ProgressBarIcons"
import ProgressBar from "./ProgressBar"
import {
  getCoreWiseFundingInLandscape,
  getImpactPoints,
} from "../apis/landscapes"
import { useLoadingState } from "../hooks/useLoader"
import Loader from "./Loader"

const colors = {
  Earth: "bg-[#00BA34]",
  Energy: "bg-[#FBCF4E]",
  Social: "bg-[#BA2C2C]",
  Water: "bg-[#76C8E8]",
}

const coreIcons = {
  Earth: <EarthIcon key="earth-icon" color="bg-foundryGreenL" />,
  Energy: <SunIcon key="sun-icon" color="bg-foundryYellowL" />,
  Social: <FistIcon key="fist-icon" color="bg-foundryRedL" />,
  Water: <WaterIcon key="wayer-icon" color="bg-foundryBlueL" />,
}
function ImpactFields({
  className = "",

  isDollar = false,
}) {
  const { loading, startLoading, stopLoading } = useLoadingState()
  const [coresData, setCoresData] = useState([])
  useEffect(function () {
    const fetchData = async () => {
      try {
        startLoading
        const response = await getImpactPoints()
        setCoresData(response?.data)
      } catch (error) {
        console.log(error)
      } finally {
        stopLoading()
      }
    }

    fetchData()
  }, [])

  const total = coresData?.reduce((acc, obj) => acc + obj?.impactPoints, 0)
  return (
    <div className={` h-full flex flex-col justify-between ${className}  `}>
      {loading ? (
        <Loader color="fill-[#326F58]" />
      ) : (
        coresData?.map((obj, index) => {
          return (
            <div key={obj?.core} className="flex w-full  items-center gap-6">
              <div
                className={`${coresData?.length - 1 === index ? "" : " pb-5"} `}
              >
                {coreIcons[obj?.core]}
              </div>
              <div
                className={`flex flex-1 items-center gap-4  ${
                  coresData?.length - 1 === index
                    ? ""
                    : "border-b border-[#353535] pb-5"
                }  `}
              >
                <p className="text-[#E8E8E8] w-14   ">{obj?.core}</p>
                <ProgressBar
                  color={"bg-[#E8E8E8]"}
                  width={(obj?.impactPoints / total) * 100 + "%"}
                />
                <p className="w-20 text-right text-primaryInput font-medium  ">
                  {isDollar
                    ? `$${obj?.impactPoints} `
                    : obj?.impactPoints?.toFixed(2) + " IP"}
                </p>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

export default ImpactFields
