import { useEffect, useState } from "react"
import { useGlobalState } from "../../contexts/GlobalState"
import CountdownTimer from "../onboarding/CountdownTimer"
import bs58 from "bs58"
import PublicPillsMap from "./PublicPillsMap"
import PublicMintModal from "../NFTs/PublicMintModal"
import nacl from "tweetnacl"
import { PublicKey } from "@solana/web3.js"
import { useLoadingState } from "../../hooks/useLoader"
import { useNavigate } from "react-router-dom"
import { useAccount, useConnect, useWalletClient } from "wagmi"
import { isMobile } from "../../helpers/isMobile"
import { FarcasterSolanaProvider } from "@farcaster/mini-app-solana"
import { RPC_ENDPOINT } from "../../constants/apiPath"

const PublicMinting = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinted, setIsMinted] = useState(false)
  const { loading, startLoading, stopLoading } = useLoadingState()
  const [selectedLandscape, setSelectedLandscape] = useState(null)
  const [dataAfterRedirect, setDataAfterRedirect] = useState(null)
  const { state: landscapesState } = useGlobalState()
  const { isConnected, address } = useAccount()
  const { connect, connectors } = useConnect()
  const navigate = useNavigate()
  const wdc = useWalletClient()

  const toggleSidebarPanel = (collectionNumber) => {
    if (collectionNumber) {
      const foundLandscape = landscapesState?.landscapes?.find(
        (l) => l.nftCollectionNumber === collectionNumber
      )
      setSelectedLandscape(foundLandscape)
    }
    setIsOpen(!isOpen)
  }
  useEffect(() => {
    console.log(isConnected, connectors, "this is coming wallet inside effect")
    if (!isConnected && connectors.length > 0) {
      connect({ connector: connectors[0] })
    }
  }, [isConnected, connectors])

  console.log("this is coming wallet client", wdc, isConnected, connectors)

  return (
    <div>
      <header className=" z-[999] h-16 bg-headerBg p-2 border-b-2 border-[#363636] fixed w-full top-0 shadow-sm "></header>
      <div className=" mt-20 relative overflow-hidden">
        <div>
          <div className="">
            <h1
              className="text-4xl lg:text-5xl px-4 md:px-0  text-center font-semibold text-textHeading"
              style={{
                textShadow: "0px 0px 11.8px rgba(255, 255, 255, 0.59)",
              }}
            >
              Greenpill Landscapes
            </h1>
          </div>
          <div className="mt-4">
            <p className="text-[#BFBFBF] text-2xl font-medium text-center mb-3 ">
              Time left to Greenpill the World:
            </p>
            <CountdownTimer />
          </div>
          <div className="bg-fixed h-[calc(100vh)] relative flex items-center justify-center">
            <div className="absolute py-10 left-0 right-0 top-0 z-[999] bg-pillsMap-upperGradient"></div>

            <div className="mt-16   overflow-auto">
              <PublicPillsMap
                landscapes={landscapesState?.landscapes}
                toggleSidebarPanel={toggleSidebarPanel}
              />
            </div>
          </div>

          {isOpen && (
            <FarcasterSolanaProvider endpoint={RPC_ENDPOINT}>
              <PublicMintModal
                dataAfterRedirect={dataAfterRedirect}
                landscape={selectedLandscape}
                contractAddresses={selectedLandscape?.contractAddresses}
                close={toggleSidebarPanel}
                isMinted={isMinted}
                loading={loading}
                stopLoading={stopLoading}
                startLoading={startLoading}
                setIsMinted={setIsMinted}
                address={address}
                walletClient={wdc?.data}
                isConnected={isConnected}
              />
            </FarcasterSolanaProvider>
          )}
        </div>
        <div className="absolute h-80 z-[10] bg-pillsMap-downwardGradient left-0 right-0 bottom-0 "></div>
        <div className="w-[78rem] z-[20] relative -mt-16 mx-auto   ">
          <div className=" w-full  z-50">
            <a
              className=""
              href="https://www.impactlandscapes.xyz/about-greenpill"
              target="_blank"
            >
              <p className="font-instrument py-6 cursor-pointer w-fit text-3xl pl-4 md:pl-0 md:text-5xl md:mt-[4.25rem] bg-clip-text bg-text-gradient text-transparent">
                Learn about the story behind <br /> greenpill landscapes →
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PublicMinting
