import React from "react"
import ProgressBox from "../../components/ProgressBox"
import GradientBorder from "../../components/GradientBorder"
import { useNavigate } from "react-router-dom"
import { useGlobalState } from "../../contexts/GlobalState"
import { onConnection } from "../../apis/metamaskHelper"
import metamaskImage from "../../assets/images/metamaskImage.png"
import { useSDK } from "@metamask/sdk-react"
import { useHome } from "../../contexts/HomeContext"
import Loader from "../../components/Loader"
import Login from "../authentication/Login"
import { useAuth } from "../../contexts/AuthContext"
const HoverCard = ({
  position,
  content,
  onMouseEnter,
  onMouseLeave,
  userFundDetails,
  progress,
  onClick,
}) => {
  const { setShowAnimation } = useGlobalState()
  const { state: authState } = useAuth()
  const { state } = useHome()
  const { greenPillNFTsHoldByWalletAddress, greenPillNFTsCountInLandscapes } =
    state

  const { connected } = useSDK()
  const navigate = useNavigate()
  const handleConnectMetamask = async () => {
    // Connect to Metamask wallet
    // Assuming you have a function to connect to Metamask
    await onConnection()

    // Show animation
    setShowAnimation(true)
    navigate("home")
  }

  const countDetail = greenPillNFTsCountInLandscapes.find(
    (countObject) => countObject?.landscapeCollection === content
  )

  return (
    <div
      onClick={onClick}
      className="absolute bg-hoverCardColor z-[9999] flex flex-col gap-3 py-3 px-4 w-80 backdrop-blur-blur-hover p-2 rounded shadow-lg"
      style={{
        top: position.top,
        left: position.left,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {!authState?.isAuthenticated && <Login onMouseLeave={onMouseLeave} />}
      {!authState?.isAuthenticated && (
        <p className="font-bold text-white">
          Connect Wallet to see more & fund!
        </p>
      )}

      {userFundDetails && authState?.isAuthenticated && userFundDetails}
      {progress && progress}
      {/* {countDetail?.count ? (
        <ProgressBox
          name={`${(countDetail?.count / 400) * 100}% Funded`}
          percent={(countDetail?.count / 400) * 100}
          color={"bg-landscapeYellowDark"}
          nameClass="font-bold  text-landscapeYellowLight"
        />
      ) : (
        <Loader color="fill-[#326F58]" />
      )} */}
    </div>
  )
}
export default HoverCard
