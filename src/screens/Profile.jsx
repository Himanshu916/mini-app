import React from "react"

import Bg from "../assets/bg.png"
import StatsCard from "../components/StatsCard"
import Trophy from "../assets/icons/Trophy"

const Profile = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${Bg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
      className="min-w-[100vw] h-[100vh] overflow-y-auto bg-fixed pb-9 "
    >
      <div className="w-[67%] mx-auto">
        <div className="pt-9">
          <h1
            className="text-6xl font-bold text-textHeading "
            style={{
              textShadow: "0px 0px 11.8px rgba(255, 255, 255, 0.59)",
            }}
          >
            Profile
          </h1>
          <h6 className="text-sm text-textSupportHeading mt-1">
            More of the network you use, more impact points you earn. IPs are
            used for all loyalty and incentive programs within the network
          </h6>
        </div>
        <div className=" flex items-center gap-3 my-5">
          <StatsCard
            label="Total funded"
            symbol={<p className="text-4xl font-medium ">$</p>}
            stats={400}
          />
          <StatsCard
            label="IP earned till now"
            symbol={<Trophy />}
            stats={3000}
          />
          <StatsCard
            label="My Rank"
            symbol={<p className="text-4xl font-medium ">#</p>}
            stats={300}
          />
        </div>
      </div>
    </div>
  )
}

export default Profile
