import { useEffect, useState } from "react"
import { useSDK } from "@metamask/sdk-react"
import { useWallet } from "@solana/wallet-adapter-react"
import { getProvider } from "../contexts/AuthContext"

const useLoginAccount = (chainType, walletType) => {
  const [account, setAccount] = useState(null)
  const { sdk, account: evmAccount } = useSDK()
  const solanaWallet = useWallet()

  useEffect(() => {
    const fetchAccount = () => {
      try {
        if (chainType === "EVM") {
          if (walletType === "metamask") {
            setAccount(evmAccount || null)
          } else if (walletType === "phantom" && window.phantom?.ethereum) {
            const accounts = window.phantom.ethereum.selectedAddress

            setAccount(accounts || null)
          }
        } else if (chainType === "Solana") {
          if (walletType === "phantom" && window.solana?.isPhantom) {
            setAccount(window.solana.publicKey?.toString() || null)
          }
        }
      } catch (error) {
        console.error("Error fetching wallet account:", error)
      }
    }

    fetchAccount()
  }, [chainType, walletType])

  return { account }
}

export default useLoginAccount
