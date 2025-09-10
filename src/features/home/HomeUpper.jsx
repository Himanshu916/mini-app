import React from "react"

const HomeUpper = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="mt-9">
        <h1
          className="text-6xl text-center font-bold text-textHeading "
          style={{
            textShadow: "0px 0px 11.8px rgba(255, 255, 255, 0.59)",
          }}
        >
          Leaderboard
        </h1>
        <h6 className="text-sm text-textSupportHeading mt-1">
          More of the network you use, more impact points you earn. IPs are used
          for all loyalty and incentive programs within the network
        </h6>
      </div>
    </div>
  )
}

export default HomeUpper
