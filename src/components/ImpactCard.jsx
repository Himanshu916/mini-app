import { useNavigate } from "react-router-dom"
import TextWithTooltip from "./TextWithTooltip"
import Heading from "./Heading"
import Button from "./Button"
import WhiteCard from "./WhiteCard"
import Loader from "./Loader"

function ImpactCard({
  type = "",
  typeColor = "",
  heading = "",
  img = "",
  stats = "",
  brief = "",
  btnText = "",
  mT = "",
  mR = "",
  tooltipText = "",
  navigateTo = "",
  loading,
  rank = null,
}) {
  const navigate = useNavigate()
  return (
    <div className="">
      {/* <TextWithTooltip
        className="leading-10"
        expandedTextWidth="w-[332px]"
        hoverOverText={heading}
      >
        <p className="text-[#404040] ">{tooltipText}</p>
      </TextWithTooltip> */}

      <WhiteCard verticalMargin="" className=" p-6">
        <div className="flex justify-between items-center">
          <div className="flex  items-center  ">
            <img
              className={`${mR} w-12 object-cover `}
              src={img}
              alt="trophyimage"
            />
            <div>
              <Heading className={`${typeColor}  `} type={"large"}>
                IMPACT
              </Heading>
              <Heading
                className={`font-semibold ${typeColor} t`}
                type={"large"}
              >
                {type}
              </Heading>
            </div>
          </div>
          {
            <div className="flex flex-col items-end">
              <p
                className={`${typeColor} text-[40px] leading-none font-semibold`}
              >
                {stats}
              </p>
              {loading ? (
                <Loader w="w-4" h="h-4" color={"fill-[#326F58]"} />
              ) : (
                <p className={`${typeColor} text-base font-medium`}>
                  Rank #{rank}{" "}
                </p>
              )}
            </div>
          }
        </div>
        <div className={`flex justify-between ${mT} items-center`}>
          <p className="text-[#878D98] text-xs w-[55%] whitespace-pre-wrap">
            {brief}
          </p>
          <Button
            onClick={() => navigate(navigateTo)}
            className="flex-1 text-end pb-0 "
            variant="transparent"
          >
            {btnText}
          </Button>
        </div>
      </WhiteCard>
    </div>
  )
}

export default ImpactCard
