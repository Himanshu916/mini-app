import Heading from "../../components/Heading"
import { useAuth } from "../../contexts/AuthContext"

import solana from "../../assets/images/solana.png"
import evm from "../../assets/images/evm.png"
import { phantomConnectionLogin } from "../../helpers/phantomConnection"
import { linkProfileFromInside } from "../../apis/authApis"
import { toast } from "sonner"
import { metaConnectionLogin } from "../../helpers/metaConnection"
import copyIcon from "../../assets/images/copyIcon.svg"

import { useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useLoadingState } from "../../hooks/useLoader"

const userProfile = {
  bio: "This is my bio",
}
function ProfileBio() {
  const { state, dispatch } = useAuth()
  const [copiedWallet, setCopiedWallet] = useState(null)
  const { loading, startLoading, stopLoading } = useLoadingState()
  const wallet = useWallet()
  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text)
    setCopiedWallet(type)
    setTimeout(() => setCopiedWallet(null), 1500)
  }
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
    <div>
      <div className="mb-4">
        <Heading className={"text-[#CFCFCF] "} type={"medium"}>
          Linked Wallets
        </Heading>

        <div className="flex items-center mt-[.65rem] gap-4 divide-x divide-[#555555]">
          {/* Solana Wallet */}
          <button className="flex items-center gap-2 w-fit">
            {state?.citizen?.walletAddress ? (
              <span
                onClick={() =>
                  copyToClipboard(state?.citizen?.walletAddress, "solana")
                }
                className="flex cursor-pointer items-center gap-2 text-[#B7B7B7] text-sm"
              >
                <img
                  className="w-[1.2rem] h-[1.2rem] rounded-full"
                  src={solana}
                  alt=""
                />
                <span>
                  {state?.citizen?.walletAddress.slice(0, 4) +
                    "..." +
                    state?.citizen?.walletAddress.slice(-4)}
                </span>
                {copiedWallet === "solana" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-[#B7B7B7]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <img src={copyIcon} alt="copy-icon" />
                )}
              </span>
            ) : (
              <span
                onClick={() => handleLinkWallet("solana")}
                className="flex cursor-pointer items-center gap-2 text-sm"
              >
                <img
                  className="w-[1.2rem] h-[1.2rem] rounded-full"
                  src={solana}
                  alt=""
                />
                <span>Connect Solana</span>
              </span>
            )}
          </button>

          {/* EVM Wallet */}
          <button className="flex items-center w-fit gap-2 pl-4">
            {state?.citizen?.evmAddress ? (
              <span
                onClick={() =>
                  copyToClipboard(state?.citizen?.evmAddress, "evm")
                }
                className="flex cursor-pointer items-center gap-2 text-[#B7B7B7] text-sm"
              >
                <img
                  className="w-[1.2rem] h-[1.2rem] rounded-full"
                  src={evm}
                  alt=""
                />
                <span>
                  {state?.citizen?.evmAddress.slice(0, 4) +
                    "..." +
                    state?.citizen?.evmAddress.slice(-4)}
                </span>
                {copiedWallet === "evm" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-[#B7B7B7]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <img src={copyIcon} alt="copy-icon" />
                )}
              </span>
            ) : (
              <span
                onClick={() => handleLinkWallet("evm")}
                className="flex cursor-pointer items-center gap-2 text-sm"
              >
                <img
                  className="w-[1.2rem] h-[1.2rem] rounded-full"
                  src={evm}
                  alt=""
                />
                <span>Connect EVM</span>
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="mb-4">
        <Heading className={"text-[#CFCFCF] "} type={"medium"}>
          Bio
        </Heading>
        <p className="text-[#DCDCDC] mt-2 ">{state?.citizen?.bio || ""}</p>
      </div>
    </div>
  )
}

export default ProfileBio
