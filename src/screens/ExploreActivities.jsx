import React from "react"

import { useNavigate } from "react-router-dom"
import GridActivities from "../features/activities/GridActivities"

const ExploreActivities = () => {
  const navigate = useNavigate()
  return (
    <div className="w-[67%] mx-auto mt-9 ">
      <div className="relative">
        <button
          className=" absolute top-[50%] translate-y-[-50%] -left-12  rounded-full   "
          onClick={() => {
            navigate(-1)
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
          >
            <circle cx="14.5713" cy="15.4287" r="14.5713" fill="#353535" />
            <path
              d="M17.6378 10.3794L16.4846 9.29346L9.96875 15.4287L16.4846 21.564L17.6378 20.4781L12.2753 15.4287L17.6378 10.3794Z"
              fill="#fff"
            />
          </svg>
        </button>
        <h1
          className="text-[2.5rem] font-bold text-textHeading "
          style={{
            textShadow: "0px 0px 11.8px rgba(255, 255, 255, 0.59)",
          }}
        >
          Activities you can fund
        </h1>
      </div>

      <GridActivities className={"mt-5"} />
    </div>
  )
}

export default ExploreActivities
