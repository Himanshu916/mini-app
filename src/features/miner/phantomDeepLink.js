// src/phantomDeeplink.js
import React, { useState } from "react"
import nacl from "tweetnacl"
import bs58 from "bs58"
import {
  Keypair,
  Connection,
  Transaction,
  SystemProgram,
  PublicKey,
} from "@solana/web3.js"
import { RPC_ENDPOINT } from "../../constants/apiPath"

// Constants
const DAPP_KEYPAIR = Keypair.generate()
const CONNECTION = new Connection("https://api.mainnet-beta.solana.com")

const REDIRECT_URL = "http://172.20.10.2:5173/phantom/redirect" // Replace with your real URL

// In-memory state (should be handled by React state/store)
let sessionData = {
  publicKey: null,
  session: null,
  sharedSecret: null,
  phantomEncryptionKey: null,
}

const DAPP_URL = "http://172.20.10.2:5173"
const CALLBACK_URL = "http://172.20.10.2:5173"

// const buildConnectUrl = () => {
//   const dappKeyPair = generateAndStoreDappKeypair()
//   const dappPublicKeyBase58 = bs58.encode(dappKeyPair.publicKey)
//   const params = new URLSearchParams({
//     dapp_encryption_public_key: dappPublicKeyBase58,
//     cluster: "mainnet-beta",
//     app_url: DAPP_URL,
//     redirect_link: CALLBACK_URL,
//   })

//   return `https://phantom.app/ul/v1/connect?${params.toString()}`
// }

export function buildUrlPhantom(pathname, params) {
  return `phantom://v1/${pathname}?${params.toString()}`
}

export const connectPhantom = (data) => {
  const dappKeyPair = JSON.parse(localStorage.getItem("DAPP_KEY_PAIR"))

  const secretKeyBase58 = bs58.encode(dappKeyPair.secretKey)
  const encodedData = btoa(encodeURIComponent(JSON.stringify(data)))
  const params = new URLSearchParams({
    dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
    cluster: "mainnet-beta",
    app_url: window.location.origin,
    redirect_link: `${window.location.origin}/?dapp_secret=${secretKeyBase58}&payloadData=${encodedData}`,
  })
  const url = buildUrlPhantom("connect", params)
  window.location.href = url

  setTimeout(() => {
    window.location.href = "https://phantom.app/download" // Redirect to installation page
  }, 1000) // Wait for 2 seconds to check if Phantom opens
}

// export const connectPhantom = () => {
//   let dappKeyPair

//   const stored = localStorage.getItem("DAPP_KEY_PAIR")
//   if (stored) {
//     const parsed = JSON.parse(stored)
//     const secretKey = new Uint8Array(parsed.secretKey)
//     dappKeyPair = nacl.box.keyPair.fromSecretKey(secretKey)
//   } else {
//     dappKeyPair = nacl.box.keyPair()
//     localStorage.setItem(
//       "DAPP_KEY_PAIR",
//       JSON.stringify({ secretKey: Array.from(dappKeyPair.secretKey) })
//     )
//   }

//   const publicKeyBase58 = bs58.encode(dappKeyPair.publicKey)

//   // 🚨 Log it
//   console.log("🚀 Connecting with publicKey:", dappKeyPair.publicKey)
//   console.log("📦 Encoded publicKey:", publicKeyBase58)

//   const params = new URLSearchParams({
//     dapp_encryption_public_key: publicKeyBase58,
//     cluster: "mainnet-beta",
//     app_url: window.location.origin,
//     redirect_link: `${window.location.origin}/phantom/redirect`,
//   })

//   const url = `https://phantom.app/ul/v1/connect?${params.toString()}`
//   window.location.href = url
// }

// app -> phantom -> app
// export const handlePhantomRedirect = async (searchParams) => {
//   console.log(searchParams, "this is search params")
//   const phantomEncryptionKey = bs58.decode(
//     searchParams.get("phantom_encryption_public_key")
//   )
//   const nonce = bs58.decode(searchParams.get("nonce"))
//   const encryptedPayload = bs58.decode(searchParams.get("data"))

//   const ed25519Secret = dappKeyPair.secretKey.slice(0, 32) // ✅ 32-byte seed
//   const curve25519KeyPair = nacl.box.keyPair.fromSecretKey(ed25519Secret) // ✅ valid Curve25519 pair
//   //   const curve25519KeyPair = nacl.box.keyPair.fromSeed(ed25519Secret)
//   const sharedSecret = nacl.box.before(
//     phantomEncryptionKey,
//     curve25519KeyPair.secretKey
//   ) // ✅ safe

//   console.log("🔐  ed25519Secret:", ed25519Secret)
//   console.log("🔐 curve25519KeyPair:", curve25519KeyPair)
//   console.log("🔐 sharedSecret:", bs58.encode(sharedSecret))
//   console.log("📦 encryptedPayload (base58):", searchParams.get("data"))
//   console.log("🧂 nonce (base58):", searchParams.get("nonce"))
//   console.log("this is shared secret", encryptedPayload, nonce, sharedSecret)
//   const decrypted = nacl.box.open.after(encryptedPayload, nonce, sharedSecret)
//   console.log(decrypted, "this is decrypted ")
//   if (!decrypted) throw new Error("Decryption failed: got null")

//   console.log("Decrypted buffer (Uint8Array):", decrypted)
//   const jsonStr = new TextDecoder().decode(decrypted)
//   console.log("Decrypted UTF-8 string:", jsonStr)

//   if (!jsonStr.trim().startsWith("{"))
//     throw new Error("Decoded string is not valid JSON")
//   const payload = JSON.parse(jsonStr)

//   console.log(payload, "this is payload")

//   sessionData = {
//     publicKey: new PublicKey(payload.public_key),
//     session: payload.session,
//     sharedSecret,
//     phantomEncryptionKey,
//   }

//   alert("minting now")
//   //   await mintNFT();
// }

const handleConnect = (params) => {
  const dappKeyPair = localStorage.getItem("DAPP_KEY_PAIR")

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

    const connectData = decryptPayload(data, nonce, sharedSecret)
    localStorage.setItem("SESSION", connectData.session)
    localStorage.setItem("WALLET_ADDRESS", connectData.public_key.toString())

    const walletPublicKey = new PublicKey(connectData.public_key)
    setPhantomWalletPublicKey(walletPublicKey)

    const walletapp = params.has("phantom_encryption_public_key")
      ? "phantom"
      : "solflare"
    signMessage(walletapp)
  } catch (error) {
    console.error("Failed to handle connection:", error)
  }
}

export const handlePhantomRedirect = async (searchParams) => {
  const phantomEncryptionKey = bs58.decode(
    searchParams.get("phantom_encryption_public_key")
  )
  const nonce = bs58.decode(searchParams.get("nonce"))
  const encryptedPayload = bs58.decode(
    searchParams.get("data") || searchParams.get("payload")
  )

  const dappKeyPair = loadDappKeypair()
  const ed25519Secret = dappKeyPair.secretKey.slice(0, 32)
  const curve25519KeyPair = nacl.box.keyPair.fromSecretKey(ed25519Secret)
  const sharedSecret = nacl.box.before(
    phantomEncryptionKey,
    curve25519KeyPair.secretKey
  )

  const decrypted = nacl.box.open.after(encryptedPayload, nonce, sharedSecret)
  if (!decrypted) throw new Error("❌ Decryption failed: got null")

  const jsonStr = new TextDecoder().decode(decrypted)
  if (!jsonStr.trim().startsWith("{"))
    throw new Error("Decoded string is not valid JSON")

  const payload = JSON.parse(jsonStr)

  sessionData = {
    publicKey: new PublicKey(payload.public_key),
    session: payload.session,
    sharedSecret,
    phantomEncryptionKey,
  }

  // alert("✅ Connected! Now minting...")
  // await mintNFT() // Call your minting logic here if needed
}

const encryptPayload = (data) => {
  const sharedSecret = JSON.parse(localStorage?.getItem("SHARED_SECRET"))
  if (!sharedSecret) {
    throw new Error("Shared secret not created")
  }

  const nonce = nacl.randomBytes(24)
  const dataBuffer = Buffer.from(JSON.stringify(data), "utf8")

  const encrypted = nacl.box.after(
    new Uint8Array(dataBuffer),
    nonce,
    new Uint8Array(sharedSecret)
  )

  return [nonce, encrypted]
}

export const signAndSendTransaction = async (
  transaction,
  phantomWalletPublicKey,
  dappKeyPair
) => {
  const connection = new Connection(RPC_ENDPOINT, "confirmed")
  if (!phantomWalletPublicKey) return

  transaction.feePayer = phantomWalletPublicKey
  transaction.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash
  const serializedTransaction = transaction.serialize({
    requireAllSignatures: false,
  })

  const session = localStorage.getItem("SESSION")
  const payload = {
    session,
    transaction: bs58.encode(serializedTransaction),
  }

  const [nonce, encryptedPayload] = encryptPayload(payload)

  const params = new URLSearchParams({
    dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
    nonce: bs58.encode(nonce),
    redirect_link: `${window.location.origin}/?isMintedAfterRedirect=${true}`,
    payload: bs58.encode(encryptedPayload),
  })

  const url = buildUrlPhantom("signAndSendTransaction", params)
  window.location.href = url
}

export const mintNFT = async () => {
  const { publicKey } = sessionData

  // Simple demo: send lamports to a dummy minting address (replace with real NFT mint tx)
  const mintTx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: new PublicKey("Fg6PaFpoGXkYsidMpWxqSWYxF2uBnEsccZBBM2t3hEbE"), // Dummy mint address
      lamports: 10000000, // 0.01 SOL mint fee
    })
  )

  await signAndSendTransaction(mintTx)
}

// export const MintNftModal = () => {
//   const [show, setShow] = useState(false);

//   const handleMintNow = () => {
//     connectPhantom();
//   };

//   return (
//     show && (
//       <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)' }}>
//         <div style={{ margin: '100px auto', padding: 20, background: '#fff', width: 300, borderRadius: 8 }}>
//           <h2>Mint Your NFT</h2>
//           <p>Click below to connect your Phantom wallet and mint your NFT.</p>
//           <button onClick={handleMintNow} style={{ padding: '10px 20px', marginTop: 10 }}>
//             Mint Now
//           </button>
//           <button onClick={() => setShow(false)} style={{ marginTop: 10, background: 'transparent', border: 'none', color: 'blue' }}>
//             Cancel
//           </button>
//         </div>
//       </div>
//     )
//   );
// };
