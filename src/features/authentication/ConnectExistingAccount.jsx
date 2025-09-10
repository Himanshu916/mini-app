import React, { useEffect, useState } from "react"
import GradientBorder from "../../components/GradientBorder"
import { useSDK } from "@metamask/sdk-react"
import { getProvider, useAuth } from "../../contexts/AuthContext"
import evm from "../../assets/images/evm.png"
import solana from "../../assets/images/solana.png"
import { useWallet } from "@solana/wallet-adapter-react"
import ConnectPhantomBtn from "./ConnectPhanotmWallet"
import ConnectMetamaskBtn from "./ConnectMetamaskBtn"
import EmailForm from "./EmailForm"
import DeepBackButton from "../../components/DeepBackButton"
import BackButton from "../../assets/icons/BackButton"
import { useNavigate } from "react-router-dom"
import { linkProfile, verifyProfile } from "../../apis/authApis"
import { useGlobalState } from "../../contexts/GlobalState"
import { toast } from "sonner"
import { onConnection } from "../../apis/metamaskHelper"
import { getWalletSignature } from "../../contexts/getWalletSignature"

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

const onConnectionPhantom = async () => {
  const provider = getProvider() // see "Detecting the Provider"
  try {
    const resp = await provider.connect()

    return { account: resp.publicKey.toString() }
    // 26qv4GCcx98RihuK3c4T6ozB3J7L6VwCuFVc7Ta2A3Uo
  } catch (err) {
    // { code: 4001, message: 'User rejected the request.' }
  }
}

const ConnectExistingAccount = ({ handleIsExistingAccount, close }) => {
  const { state, dispatch, setIsNoUserFound } = useAuth()
  const { setShowAnimation } = useGlobalState()
  const { sdk, account } = useSDK()
  const { publicKey, connect, disconnect, select } = useWallet()

  const [walletSol, setWalletSol] = useState("")
  const provider = getProvider()

  useEffect(() => {
    // Store user's public key once they connect
    if (provider) setWalletSol(provider?.publicKey?.toString())
  }, [provider])

  const address = publicKey?.toBase58()
  const navigate = useNavigate()

  const handleVerifyWallet2 = async (walletType, isFromActivityPage) => {
    try {
      // startRequesting()

      // Ensure Phantom is selected before connecting
      const { account: onConnectAccount } =
        walletType === "phantom"
          ? await onConnectionPhantom(connect, disconnect, publicKey, select)
          : await onConnection()

      const { signature, timeStamp } = await getWalletSignature(walletType, sdk)

      const verified = await verifyProfile({
        wallet: onConnectAccount,
        timestamp: timeStamp,
        signature: signature,
        isEVM: !(state?.chainType === "EVM"),
      })

      if (!verified?.userInfo) {
        if (!(state?.chainType === "EVM")) {
          toast?.error("No profile found with EVM Wallet")
        } else toast?.error("No profile found with Solana Wallet")
        setIsNoUserFound(false)
        dispatch({
          type: "logout",
          payload: {
            citizen: null,
            token: null,
            firstTime: true,
          },
        })
        close()
        return
      }

      if (verified?.userInfo?.token) {
        const response = await linkProfile(
          state?.chainType === "EVM",
          state?.chainType === "EVM" ? account : walletSol,
          verified?.userInfo?.token
        )

        if (
          response?.response?.data?.code == 400 &&
          response?.response?.data?.message ===
            "EVM wallet already linked with the profile"
        ) {
          toast?.error("Another EVM wallet is already linked to the profile")
          setIsNoUserFound(false)
          dispatch({
            type: "logout",
            payload: {
              citizen: null,
              token: null,
              firstTime: true,
            },
          })
          close()
          return
        }

        if (
          response?.response?.data?.code == 400 &&
          response?.response?.data?.message ===
            "Solana wallet already linked with the profile"
        ) {
          toast?.error("Another solana wallet is already linked to the profile")
          setIsNoUserFound(false)
          dispatch({
            type: "logout",
            payload: {
              citizen: null,
              token: null,
              firstTime: true,
            },
          })
          close()
          return
        }
        if (response?.data?.success) {
          const { signature2, timeStamp2 } = getWalletSignature(
            state?.walletType,
            sdk
          )

          const verifiedAfterLinking = await verifyProfile({
            wallet: state?.chainType === "EVM" ? account : walletSol,
            timestamp: timeStamp2,
            signature: signature2,
            isEVM: state?.chainType === "EVM",
          })

          dispatch({
            type: "login",
            payload: {
              citizen: verifiedAfterLinking?.userInfo?.citizen,
              token: verifiedAfterLinking?.userInfo?.token,
              firstTime: verifiedAfterLinking?.status === 200 ? false : true,
              loginAccount: state?.chainType === "EVM" ? account : walletSol,
              walletType: state?.walletType,
            },
          })
          setShowAnimation(true)
          if (fromShareBounty) {
            close()
            return
          } else navigate("/", { replace: true })
          // navigate("/home", { replace: true })
        }
      }
    } catch (error) {
      console.log("Phantom wallet connection error:", error)
    } finally {
      // stopRequesting()
      await disconnect()
    }
  }

  return (
    <div>
      <div>
        <div className="border-b border-[#2D2D2D]  ">
          <div className="flex relative justify-center items-center gap-10">
            <button
              className={` absolute bg-[#393939] top-0 left-0   rounded-full   `}
              onClick={() => {
                handleIsExistingAccount(false)
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="31"
                height="32"
                viewBox="0 0 31 32"
                fill="none"
              >
                <circle cx="15.5" cy="16.0898" r="15.5" fill="#353535" />
                <path
                  d="M18.7634 10.7177L17.5366 9.5625L10.6055 16.0888L17.5366 22.6151L18.7634 21.46L13.0591 16.0888L18.7634 10.7177Z"
                  fill="#9B9B9B"
                />
              </svg>
            </button>

            <h1
              className=" text-xl md:text-2xl font-bold text-textHeading text-center "
              style={{
                textShadow: "0px 0px 11.8px rgba(255, 255, 255, 0.59)",
              }}
            >
              Connect Existing Account
            </h1>
          </div>

          <div className="flex gap-2  my-4  ">
            <img
              className="w-5 h-5 object-cover rounded-full"
              src={state?.chainType === "EVM" ? evm : solana}
              alt=""
            />
            <div>
              <p className={` text-sm  text-center `}>
                <span>
                  {state?.chainType === "EVM"
                    ? account?.slice(0, 4) + "..." + account?.slice(-4)
                    : walletSol?.slice(0, 4) + "..." + walletSol?.slice(-4)}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="pt-4">
          <div>
            <p className="font-semibold mb-1 ">Connect Wallet</p>
            <div className="flex items-center justify-between ">
              {state?.chainType === "EVM" ? (
                <GradientBorder
                  radiusBorder={".60rem"}
                  color2={"rgba(80, 108, 102, 0)"}
                  color1={"rgba(105, 159, 132, 1)"}
                  bg="bg-[#1E3D36]"
                >
                  <ConnectPhantomBtn
                    handleVerifyWallet2={handleVerifyWallet2}
                    forLinkingProfile={true}
                  />
                </GradientBorder>
              ) : (
                <>
                  <GradientBorder
                    radiusBorder={".60rem"}
                    color2={"rgba(80, 108, 102, 0)"}
                    color1={"rgba(105, 159, 132, 1)"}
                    bg="bg-[#1E3D36]"
                  >
                    {" "}
                    <ConnectMetamaskBtn
                      handleVerifyWallet2={handleVerifyWallet2}
                      forLinkingProfile={true}
                    />
                  </GradientBorder>
                  {/* <GradientBorder
                    radiusBorder={".60rem"}
                    color2={"rgba(80, 108, 102, 0)"}
                    color1={"rgba(105, 159, 132, 1)"}
                    bg="bg-[#1E3D36]"
                  >
                    <ConnectPhantomBtn />
                  </GradientBorder> */}
                </>
              )}
            </div>
          </div>

          <p className="text-center my-3 text-sm leading-6 uppercase">Or</p>
          <EmailForm
            close={close}
            wallet={state?.chainType === "EVM" ? account : walletSol}
            isEVM={state?.chainType === "EVM"}
          />
        </div>
      </div>
    </div>
  )
}

export default ConnectExistingAccount
