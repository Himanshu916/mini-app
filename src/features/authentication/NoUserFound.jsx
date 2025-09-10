import React, { useEffect, useState } from "react"
import ConnectExistingAccount from "./ConnectExistingAccount"
import GradientBorder from "../../components/GradientBorder"
import { getProvider, useAuth } from "../../contexts/AuthContext"
import evm from "../../assets/images/evm.png"
import solana from "../../assets/images/solana.png"
import { useWallet } from "@solana/wallet-adapter-react"
import { useSDK } from "@metamask/sdk-react"
import Loader from "../../components/Loader"

async function signMessageWithPhantom(message) {
  try {
    // Request Phantom wallet to sign the message
    // const selectedWallet = 'Phantom'; // Change this to the selected wallet
    // await connectToWallet(selectedWallet);

    const messageBytes = new TextEncoder().encode(message)

    const signedMessage = await window.solana.signMessage(messageBytes)

    return signedMessage.signature
  } catch (error) {
    console.error("Error signing message:", error)
    return null
  }
}

const NoUserFound = ({ close, isFromActivityPage }) => {
  const [isConnectExistingAccount, setIsConnectExistingAccount] =
    useState(false)
  const { state, handleCreateNewAccount, isCreating } = useAuth()
  const { sdk, account } = useSDK()
  const handleIsExistingAccount = (value) => {
    setIsConnectExistingAccount(value)
  }
  // const { connected, wallet, publicKey, connecting } = useWallet()
  const [wallet, setWallet] = useState("")
  const provider = getProvider()

  // 26qv4GCcx98RihuK3c4T6ozB3J7L6VwCuFVc7Ta2A3Uo

  useEffect(() => {
    // Store user's public key once they connect
    if (provider) setWallet(provider?.publicKey?.toString())
  }, [provider])

  return (
    <div>
      {isConnectExistingAccount ? (
        <ConnectExistingAccount
          isFromActivityPage={isFromActivityPage}
          handleIsExistingAccount={handleIsExistingAccount}
          close={close}
        />
      ) : (
        <div>
          <h1
            className="text-xl md:text-2xl font-bold text-textHeading text-center "
            style={{
              textShadow: "0px 0px 11.8px rgba(255, 255, 255, 0.59)",
            }}
          >
            No Existing User Found
          </h1>
          <div className="flex  items-center justify-center my-6">
            <div>
              <p className="text-[#CFCFCF] text-center  mb-1 ">
                Connect Wallet
              </p>

              <div className="flex gap-2   ">
                <img
                  className="w-7 h-7 object-cover rounded-full"
                  src={state?.chainType === "EVM" ? evm : solana}
                  alt=""
                />
                <div>
                  <p className={`   text-center `}>
                    <span>
                      {state?.chainType === "EVM"
                        ? account?.slice(0, 4) + "..." + account?.slice(-4)
                        : wallet?.slice(0, 4) + "..." + wallet?.slice(-4)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center ">
            <div className="flex items-center gap-4">
              <GradientBorder
                radiusBorder={".60rem"}
                color2={"rgba(80, 108, 102, 0)"}
                color1={"rgba(105, 159, 132, 1)"}
                bg="bg-[#1E3D36]"
              >
                <button
                  onClick={() => {
                    handleCreateNewAccount(
                      state?.chainType === "EVM",
                      state?.chainType === "EVM" ? account : wallet,
                      isFromActivityPage,
                      close
                    )
                  }}
                  className="  px-4 py-1  w-fit  "
                >
                  <span className=" text-xs md:text-sm text-[#FFF]">
                    {" "}
                    {isCreating ? (
                      <Loader color={"fill-[#326F58]"} />
                    ) : (
                      "Create New Account"
                    )}
                  </span>
                </button>
              </GradientBorder>
              <span>or</span>
              <GradientBorder
                radiusBorder={".60rem"}
                color2={"rgba(80, 108, 102, 0)"}
                color1={"rgba(105, 159, 132, 1)"}
                bg="bg-[#1E3D36]"
              >
                <button
                  onClick={() => handleIsExistingAccount(true)}
                  className="  px-4 py-1  gap-2  w-fit "
                >
                  <span className="text-xs md:text-sm text-[#FFF]">
                    {" "}
                    Link Existing account
                  </span>
                </button>
              </GradientBorder>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NoUserFound
