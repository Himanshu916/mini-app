import { useEffect, useRef } from "react"
import { useWallet } from "@solana/wallet-adapter-react"

export const autoSelectPhantom = (close) => {
  // const wallet = useWallet()
  // const didAttemptRef = useRef(false)

  const autoSelectAndHandle = async () => {
    if (!wallet.wallet && wallet.wallets.length > 0) {
      const phantom = wallet.wallets.find((w) => w.adapter.name === "Phantom")

      if (phantom) {
        didAttemptRef.current = true
        wallet.select(phantom.adapter.name)

        try {
          await phantom.adapter.connect()
        } catch (err) {
          console.warn("User cancelled wallet connection:", err)
          // ❗ Deselect wallet adapter so that it can be retried later
          wallet.disconnect() // disconnect first
          wallet.select(null) // deselect Phantom
          close?.() // call close UI
        }
      }
    }
  }
  // useEffect(() => {
  //   autoSelectAndHandle()
  // }, [wallet.wallets, wallet.wallet])

  return autoSelectAndHandle
}
