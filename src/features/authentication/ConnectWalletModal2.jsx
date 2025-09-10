import { useEffect, useRef, useState } from "react"
import Overlay from "../../components/Overlay"
import metamaskImage from "../../assets/images/metamaskImage.png"
import WalletDropdown from "./WalletDropdown"
import evm from "../../assets/images/evm.png"
import solana from "../../assets/images/solana.png"
import GradientBorder from "../../components/GradientBorder"
import { useSDK } from "@metamask/sdk-react"

import { useWallet } from "@solana/wallet-adapter-react"
import NoUserFound from "./NoUserFound"
import { disconnectPhantomWallet, useAuth } from "../../contexts/AuthContext"
import ConnectMetamaskBtn from "./ConnectMetamaskBtn"
import ConnectPhantomBtn from "./ConnectPhanotmWallet"
import { verifyProfile } from "../../apis/authApis"
import { useUnifiedWallet } from "../../hooks/useUnifiedWallet"

function ConnectWalletModal2({ close, isFromActivityPage = false }) {
  const myRef = useRef({ close })
  const btnRef = useRef()
  const {
    handleConnectMetamask,
    handleLogout,
    dispatch,
    state,
    isNoUserFound,
    setIsNoUserFound,
  } = useAuth()
  const [open, setOpen] = useState("")
  const { connected, sdk, account } = useSDK()

  const { type, address } = useUnifiedWallet()

  useEffect(() => {
    function handleClickOutside(e) {
      // Close the modal if the click is outside the modal content
      if (myRef.current && !myRef.current.contains(e.target)) {
        close()
      }
    }

    // Add the event listener to close modal on outside click
    document.addEventListener("mousedown", handleClickOutside, true)

    // Clean up the event listener when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true)
    }
  }, [close])

  useEffect(function () {
    const disconnectFn = async () => {
      await sdk?.terminate()
    }

    if (connected) disconnectFn()
    if (window?.phantom?.solana?.isConnected) disconnectPhantomWallet()
  }, [])

  return (
    <Overlay>
      <div className="absolute rounded-lg left-[50%] p-6 w-[90%]   md:w-[37.7%]  bg-[#1C1C1C] border border-[#2a2a2a]    translate-x-[-50%] translate-y-[-50%] top-[50%]">
        <div ref={myRef} className="relative w-full h-full">
          <button
            className="  absolute z-[9999] top-0 right-0  rounded-full  "
            onClick={() => {
              close()
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
            >
              <circle cx="16.4106" cy="16.0894" r="15.5894" fill="#353535" />
              <path
                d="M23.4424 9.72656L10.734 22.435"
                stroke="#9B9B9B"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M22.6924 22.4336L9.98398 9.72519"
                stroke="#9B9B9B"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          {isNoUserFound ? (
            <NoUserFound
              isFromActivityPage={isFromActivityPage}
              close={close}
            />
          ) : (
            <div className="px-6">
              <div className="border-b pb-6 border-[#2D2D2D]">
                <h1
                  className="text-2xl font-bold text-textHeading text-center "
                  style={{
                    textShadow: "0px 0px 11.8px rgba(255, 255, 255, 0.59)",
                  }}
                >
                  Connect Wallet
                </h1>
                <p className="text-[#CFCFCF] text-center mt-2  ">
                  Connect your EVM or Solana Wallet below
                </p>
              </div>

              <div className="flex items-center justify-center mt-6">
                <div className="flex flex-col  items-center gap-1 md:gap-4 md:flex-row">
                  <WalletDropdown
                    text={"EVM"}
                    open={open}
                    setOpen={setOpen}
                    image={evm}
                    width="w-48"
                    fn={(value) => {
                      dispatch({ type: "selectChain", payload: value })
                    }}
                    onOpen={
                      <div className="w-full">
                        <ConnectMetamaskBtn
                          isFromActivityPage={isFromActivityPage}
                          close={close}
                          isEVM={true}
                        />
                        {/* <ConnectPhantomBtn /> */}
                      </div>
                    }
                  />
                  <span>or</span>
                  <WalletDropdown
                    text={"Solana"}
                    open={open}
                    setOpen={setOpen}
                    image={solana}
                    fn={(value) => {
                      dispatch({ type: "selectChain", payload: value })
                    }}
                    onOpen={
                      <div>
                        <ConnectPhantomBtn
                          isFromActivityPage={isFromActivityPage}
                          close={close}
                          isEVM={false}
                        />
                      </div>
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Overlay>
  )
}

export default ConnectWalletModal2
