import React from "react"
import { Progress } from "@/components/ui/progress"

const ProgressBox = ({
  name,
  percent,
  isShowPercent = false,
  currentData,
  outOfData,
  textColor = "",
  color,
  nameClass = "font-medium  text-landscapeYellowLight",
  h = "h-[0.63rem]",
}) => {
  return (
    <div className="flex flex-col gap-[.375rem] w-full   ">
      <div className="flex items-center justify-between">
        {name && <p className={`${nameClass}`}>{name}</p>}
        {currentData !== undefined ? (
          <p className={`${nameClass}`}>
            ${Number(currentData)?.toFixed(2)}/{outOfData}
          </p>
        ) : null}
      </div>
      <div>
        <Progress
          isShowPercent={isShowPercent}
          className={h}
          bg={color}
          textColor={textColor}
          value={percent}
        />
      </div>
    </div>
  )
}

export default ProgressBox
