import React from "react"
import ProgressBox from "../../components/ProgressBox"
import ProgressBar from "../../components/ProgressBar"
import Loader from "../../components/Loader"
import water from "../../assets/images/water.png"
import sun from "../../assets/images/sun.png"
import earth from "../../assets/images/earth.png"
import heart from "../../assets/images/fistIcon.png"
import GradientBorder from "../../components/GradientBorder"
import TextWithTooltip from "../../components/TextWithTooltip"
import { formatNumberToK } from "../../helpers/convertIntoK"

const coresData = {
  Water: {
    color: "bg-coreBlue",
    border: "border border-coreBlue",
    default: "bg-[#272727]",
    image: water,
  },
  Earth: {
    color: "bg-coreGreen",
    border: "border border-coreGreen",
    default: "bg-[#272727]",
    image: earth,
  },
  Social: {
    color: "bg-coreRed",
    border: "border border-coreRed",
    default: "bg-[#272727]",
    image: heart,
  },
  Energy: {
    color: "bg-coreYellow",
    border: "border border-coreYellow",
    default: "bg-[#272727]",
    image: sun,
  },
}

const ImpactCores = ({ coreWiseFunding, loading }) => {
  return (
    <GradientBorder
      radiusBorder=".4rem"
      color1="#666"
      color2="#292929"
      isNoBottomRadius={false}
      width="w-full"
      bg="bg-[#272727]"
      upperPadding="p-6"
      borderThickness="1px"
      className="mt-3"
    >
      <div className="rounded-md p-4   ">
        <div className="mb-3 ">
          <TextWithTooltip
            className="leading-10"
            hoverOverText={
              <h3 className="text-sm font-semibold ">Impact Cores</h3>
            }
            isCustomHover={true}
            expandedTextWidth="w-[332px]"
          >
            <p className="text-[#E8E8E8] ">
              Impact Cores is a framework that Atlantis has developed, that
              forms the basis of measuring impact.
            </p>
          </TextWithTooltip>
        </div>

        <div className="grid grid-cols-2 gap-y-4 gap-x-6">
          {loading ? (
            <div className="w-full col-span-2 h-24 flex justify-center items-center ">
              <Loader color="fill-[#326F58]" />
            </div>
          ) : !coreWiseFunding ? (
            <p>not available</p>
          ) : (
            Object.keys(coreWiseFunding).map((core) => {
              return (
                <div key={core}>
                  <div className="flex items-center gap-1 mb-1">
                    <img
                      className="w-5 h-5 object-contain"
                      src={coresData[core]?.image}
                      alt=""
                    />
                    <p className=" capitalize">
                      {core}-{" "}
                      <span>
                        $
                        {coreWiseFunding[core]?.fundingRaisedInUSD === 0
                          ? 0
                          : formatNumberToK(
                              Number(
                                coreWiseFunding[core]?.fundingRaisedInUSD
                              )?.toFixed(2)
                            )}
                      </span>
                    </p>
                  </div>

                  <ProgressBar
                    color={coresData[core]?.color}
                    width={
                      coreWiseFunding[core]?.fundingRaisedInUSD === 0
                        ? "0%"
                        : (coreWiseFunding[core]?.fundingRaisedInUSD /
                            coreWiseFunding[core]?.fundingRequiredInUSD) *
                            100 +
                          "%"
                    }
                    border={coresData[core]?.border}
                    bgDefault={coresData[core]?.default}
                  />
                </div>
              )
            })
          )}
        </div>
      </div>
    </GradientBorder>
  )
}

export default ImpactCores
