import { useEffect, useState } from "react"
import { handlePhantomRedirect } from "./phantomDeepLink"
import bs58 from "bs58"
import nacl from "tweetnacl"
import { PublicKey } from "@solana/web3.js"

const decryptPayload = (data, nonce, sharedSecret) => {
  const connectData = nacl.box.open.after(
    bs58.decode(data),
    bs58.decode(nonce),
    sharedSecret
  )
  const jsonString = new TextDecoder().decode(connectData)
  const obj = JSON.parse(jsonString)
  return obj
}

const PhantomRedirect = () => {
  const [wallet, setWallet] = useState(null)
  const [phantomWalletPublicKey, setPhantomWalletPublicKey] = useState("")
  const handleConnect = (params) => {
    const dappSecretBase58 = params.get("dapp_secret")
    const dappSecretKey = bs58.decode(dappSecretBase58)
    const dappKeyPair = nacl.box.keyPair.fromSecretKey(dappSecretKey)
    // const dappKeyPair = JSON.parse(localStorage.getItem("DAPP_KEY_PAIR"))

    try {
      const phantomEncryptionPublicKey = params.get(
        "phantom_encryption_public_key"
      )
      const data = params.get("data")
      const nonce = params.get("nonce")

      if (!phantomEncryptionPublicKey || !data || !nonce) {
        console.error("Missing parameters in the URL for connection.")
        return
      }

      const sharedSecret = nacl.box.before(
        bs58.decode(phantomEncryptionPublicKey),
        dappKeyPair.secretKey
      )

      localStorage.setItem(
        "SHARED_SECRET",
        JSON.stringify(Array.from(sharedSecret))
      )

      //   const connectData = decryptPayload(data, nonce, sharedSecret)
      const connectData = decryptPayload(data, nonce, sharedSecret)

      localStorage.setItem("SESSION", connectData.session)
      localStorage.setItem("WALLET_ADDRESS", connectData.public_key.toString())

      const walletPublicKey = new PublicKey(connectData.public_key)
      setPhantomWalletPublicKey(walletPublicKey)

      // alert("now you can start minting")
      //   const walletapp = "phantom"
      //   signMessage(walletapp)
    } catch (error) {
      console.error("Failed to handle connection:", error)
    }
  }

  useEffect(() => {
    setTimeout(function () {
      const params = new URLSearchParams(window.location.search)

      handleConnect(params)
    }, 5000)
  }, [])
  const storedDappKeyPair = localStorage.getItem("DAPP_KEY_PAIR")

  return (
    <div style={{ padding: 20 }}>
      <h1>Transaction Progress</h1>
      <p>
        {phantomWalletPublicKey
          ? `Wallet Address: ${phantomWalletPublicKey}`
          : "Connecting to wallet..."}
      </p>
    </div>
  )
}

export default PhantomRedirect
