import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { useLoadingState } from "../../hooks/useLoader"
import GradientBorder from "../../components/GradientBorder"

import solana from "../../assets/images/solana.png"
import evm from "../../assets/images/evm.png"

import { linkProfileFromInside, verifyProfile } from "../../apis/authApis"
import { onConnection } from "../../apis/metamaskHelper"
import { useGlobalState } from "../../contexts/GlobalState"
import { useSDK } from "@metamask/sdk-react"
import { useEffect, useRef, useState } from "react"
import Modal from "../../components/Modal"
import ConnectWalletModal from "./ConnectWalletModal"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import useLoginAccount from "../../hooks/useLoginAccount"
import {
  metaConnection,
  metaConnectionLogin,
} from "../../helpers/metaConnection"
import { phantomConnectionLogin } from "../../helpers/phantomConnection"
import { useWallet } from "@solana/wallet-adapter-react"
import Loader from "../../components/Loader"
import { toast } from "sonner"
import { copyToClipboard } from "../../helpers/copyText"

async function signMessageWithMetamask(message) {
  try {
    const messageBytes = new TextEncoder().encode(message)

    const signedMessage = await window.solana.signMessage(messageBytes)

    return signedMessage.signature
  } catch (error) {
    console.error("Error signing message:", error)
    return null
  }
}
function Login() {
  const { dispatch, state, handleLogout } = useAuth()
  const { loading, startLoading, stopLoading } = useLoadingState()
  const wallet = useWallet()
  const { connected, sdk, account } = useSDK()
  const [open, setOpen] = useState(false)

  const myRef = useRef()

  useEffect(() => {
    function handleClick(e) {
      if (myRef.current && !myRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("click", handleClick, true)
    return () => document.removeEventListener("click", handleClick, true)
  }, [])

  const {
    loading: requesting,
    startLoading: startRequesting,
    stopLoading: stopRequesting,
  } = useLoadingState()
  //   const [noProfileError, setNoProfileError] = useState("")

  const navigate = useNavigate()

  const handleLinkWallet = async (walletType) => {
    if (walletType === "solana") {
      try {
        const phantomConnectionResponse = await phantomConnectionLogin(wallet)

        startLoading()

        const response = await linkProfileFromInside(
          false,
          phantomConnectionResponse?.wallet
        )

        if (response?.response?.data?.code === 400) {
          toast?.error(response?.response?.data?.message)
          stopLoading()
          return
        }
        if (response?.data?.success) {
          toast?.success("wallet linked successfully")
          dispatch({
            type: "changeWalletSolana",
            payload: phantomConnectionResponse?.wallet,
          })
        }
      } catch (error) {
        console.log(error)
      } finally {
        stopLoading()
        setOpen(false)
      }
    }
    if (walletType === "evm") {
      try {
        const metaConnectionResponse = await metaConnectionLogin(
          state?.citizen?.evmAddress
        )
        const response = await linkProfileFromInside(
          true,
          metaConnectionResponse?.wallet
        )

        if (response?.response?.data?.code === 400) {
          toast?.error(response?.response?.data?.message)
          stopLoading()
          return
        }
        if (response?.data?.success) {
          toast?.success("wallet linked successfully")
          dispatch({
            type: "changeWalletEVM",
            payload: metaConnectionResponse?.wallet,
          })
        }
      } catch (error) {
        console.log(error)
      } finally {
        stopLoading()
        setOpen(false)
      }
    }
  }

  return (
    <div className="flex flex-col gap-2 ">
      {state?.isAuthenticated ? (
        <div className="relative" ref={myRef}>
          <button
            onClick={() => setOpen(true)}
            className=" px-4 py-2 flex bg-[#3D3D3D] rounded-sm text-[#B7B7B7] items-center gap-2  "
          >
            <div className="   rounded-full">
              <img
                className="w-[1.2rem] h[1.2rem] "
                src={state?.walletType === "metamask" ? evm : solana}
                alt=""
              />
            </div>

            <span className="text-xs">
              <span className="flex items-center justify-between gap-4">
                <span>
                  {state?.loginAccount?.slice(0, 4)}...
                  {state?.loginAccount?.slice(-4)}
                </span>
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="8"
                    viewBox="0 0 10 8"
                    fill="none"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0.412691 3.18382L4.02209 6.79322C4.56559 7.33672 5.44356 7.33672 5.98706 6.79322L9.59646 3.18382C10.4605 2.30586 9.8473 0.800781 8.60701 0.800781L1.40214 0.800781C0.147908 0.800781 -0.465272 2.30586 0.412691 3.18382Z"
                      fill="#969696"
                    />
                  </svg>
                </span>
              </span>
            </span>
          </button>
          <div
            className={`z-[2000] w-full ${
              open ? "absolute " : "hidden"
            } bg-[#353535]  overflow-auto main rounded-lg rounded-t-none shadow px-4 py-3`}
          >
            <button
              onClick={() => {
                handleLogout()

                setOpen(false)
              }}
              className="  flex justify-center items-center rounded-sm  text-center w-full text-[#B7B7B7]  gap-2 text-xs  "
            >
              <span className="text-center text-[#FFF]">
                {" "}
                Disconnect Wallet
              </span>
            </button>
          </div>
        </div>
      ) : (
        <Modal>
          <Modal.Button opens={"connect"}>
            <GradientBorder
              radiusBorder={".60rem"}
              color2={"rgba(80, 108, 102, 0)"}
              color1={"rgba(105, 159, 132, 1)"}
              bg="bg-[#1E3D36]"
            >
              <button className="px-4 py-2 flex items-center gap-2">
                <div className=" p-1 w-[1.2rem] h-[1.2rem] bg-white rounded-full">
                  {/* <img
                  className="w-[1.2rem] h[1.2rem] "
                  src={evm}
                  alt=""
                /> */}
                </div>

                <span className="text-xs">Connect Wallet</span>
              </button>
            </GradientBorder>
          </Modal.Button>
          <Modal.Window name={"connect"}>
            <ConnectWalletModal />
          </Modal.Window>
        </Modal>
      )}
    </div>
  )
}

export default Login
