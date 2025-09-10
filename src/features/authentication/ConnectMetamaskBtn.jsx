import React from "react"
import GradientBorder from "../../components/GradientBorder"
import { useAuth } from "../../contexts/AuthContext"
import { useSDK } from "@metamask/sdk-react"
import metamaskImage from "../../assets/images/metamaskImage.png"
import Loader from "../../components/Loader"

const ConnectMetamaskBtn = ({
  isEVM,
  handleVerifyWallet2,
  isFromActivityPage,
  close,
  forLinkingProfile = false,
}) => {
  const { handleConnectMetamask, handleLogout, connectingMetamask } = useAuth()
  const { connected, sdk, account } = useSDK()

  return (
    <button
      onClick={async () => {
        {
          connected
            ? await handleLogout()
            : forLinkingProfile
            ? await handleVerifyWallet2("metamask", isFromActivityPage, close)
            : await handleConnectMetamask(isEVM, isFromActivityPage, close)

          // close()
        }
      }}
      className="  px-4 py-2 h-10 w-full  "
    >
      {connectingMetamask ? (
        <div className="flex items-center justify-center w-full">
          <Loader color="fill-[#326F58]" />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="  rounded-full">
            <img className="w-[1.2rem] h[1.2rem] " src={metamaskImage} alt="" />
          </div>

          <span className=" text-xs md:text-sm text-[#FFF]">
            Connect Metamask{" "}
          </span>
        </div>
      )}
    </button>
  )
}

export default ConnectMetamaskBtn
