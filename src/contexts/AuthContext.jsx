import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react"
import { createProfile, verifyProfile } from "../apis/authApis"
import { useWallet } from "@solana/wallet-adapter-react"
import { useSDK } from "@metamask/sdk-react"
import { useGlobalState } from "./GlobalState"
import { onConnection } from "../apis/metamaskHelper"
import { useLoadingState } from "../hooks/useLoader"
import { useNavigate } from "react-router-dom"
import { getWalletSignature } from "./getWalletSignature"
import nacl from "tweetnacl"
import bs58 from "bs58"

const DAPP_URL = "https://landscapes-vert.vercel.app/"
const CALLBACK_URL = `${DAPP_URL}/phantom-callback`

// Step 1: Generate keypair for this session
const dappKeyPair = nacl.box.keyPair()
const dappPublicKeyBase58 = bs58.encode(dappKeyPair.publicKey)

// Step 2: Build connect URL
const buildConnectUrl = () => {
  const params = new URLSearchParams({
    dapp_encryption_public_key: dappPublicKeyBase58,
    cluster: "mainnet-beta",
    app_url: DAPP_URL,
    redirect_link: DAPP_URL,
  })

  return `https://phantom.app/ul/v1/connect?${params.toString()}`
}

// Step 3: Build signMessage URL (to call after connect)
const buildSignMessageUrl = (sharedSecret, walletAddress) => {
  const timeStamp = new Date().toISOString()
  const message = `impact-landscapes:${timeStamp}`
  // const message = `Login to MyApp at ${new Date().toISOString()}`
  const encodedMsg = new TextEncoder().encode(message)

  const nonce = nacl.randomBytes(nacl.box.nonceLength)
  const encryptedMsg = nacl.box.after(encodedMsg, nonce, sharedSecret)

  const params = new URLSearchParams({
    dapp_encryption_public_key: dappPublicKeyBase58,
    message: bs58.encode(encryptedMsg),
    nonce: bs58.encode(nonce),
    redirect_link: CALLBACK_URL,
  })

  return `https://phantom.app/ul/v1/signMessage?${params.toString()}`
}

// Step 4: Decrypt Phantom response
const decryptPayload = ({ data, nonce, phantom_encryption_public_key }) => {
  const sharedSecret = nacl.box.before(
    bs58.decode(phantom_encryption_public_key),
    dappKeyPair.secretKey
  )

  const decrypted = nacl.box.open.after(
    bs58.decode(data),
    bs58.decode(nonce),
    sharedSecret
  )

  if (!decrypted) throw new Error("Failed to decrypt Phantom payload")

  return JSON.parse(new TextDecoder().decode(decrypted))
}

export const getProvider = () => {
  if ("phantom" in window) {
    const provider = window.phantom?.solana

    if (provider?.isPhantom) {
      return provider
    }
  }

  window.open("https://phantom.app/", "_blank")
}

export const disconnectPhantomWallet = async () => {
  const provider = getProvider()
  if (provider && provider.isConnected) {
    try {
      await provider.disconnect()
    } catch (err) {
      console.error("Error disconnecting Phantom wallet:", err)
    }
  } else {
    console.log("No Phantom wallet connected")
  }
}

// export const onConnectionPhantom = async () => {
//   const provider = getProvider() // see "Detecting the Provider"
//   try {
//     const resp = await provider.connect()

//     return { account: resp.publicKey.toString() }
//     // 26qv4GCcx98RihuK3c4T6ozB3J7L6VwCuFVc7Ta2A3Uo
//   } catch (err) {
//     // { code: 4001, message: 'User rejected the request.' }
//   }
// }

// export const onConnectionPhantom = async () => {
//   const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
//   const provider = window?.phantom?.solana

//   if (!provider || !provider.isPhantom) {
//     if (isMobile) {
//       localStorage.setItem("phantom-login", "1") // mark login in progress
//       const redirectUrl = encodeURIComponent(window.location.href)
//       const deepLink = `https://phantom.app/ul/browse/${redirectUrl}`
//       window.location.href = deepLink
//       return { account: null, redirected: true }
//     } else {
//       toast.error("Phantom wallet not found. Please install it.")
//       return { account: null }
//     }
//   }

//   if (provider.isConnected) {
//     try {
//       await provider.disconnect()
//     } catch (e) {
//       console.warn("Phantom disconnect failed", e)
//     }
//   }

//   try {
//     const resp = await provider.connect()
//     return { account: resp.publicKey.toString() }
//   } catch (err) {
//     toast.error("User rejected connection request.")
//     return { account: null }
//   }
// }

export const onConnectionPhantom = async (startLogin) => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  const provider = window?.phantom?.solana

  if (!provider || !provider.isPhantom) {
    if (isMobile) {
      startLogin()

      return { account: null, redirected: true }
    } else {
      toast.error("Phantom wallet not found.")
      return { account: null }
    }
  }

  if (provider.isConnected) {
    try {
      await provider.disconnect()
    } catch (e) {
      console.warn("Phantom disconnect failed", e)
    }
  }

  try {
    const resp = await provider.connect()
    return { account: resp.publicKey.toString() }
  } catch (err) {
    toast.error("User rejected connection.")
    return { account: null }
  }
}

const AuthContext = createContext()

const initialState = {
  token: "",
  citizen: null,
  isLoading: false,
  isAuthenticated: false,
  firstTime: false,
  error: null,
  chainType: "",
  walletType: "",
  signature: "",
  loginAccount: "",
}

function reducer(state, action) {
  switch (action.type) {
    case "selectChain":
      localStorage.setItem(
        "myState",
        JSON.stringify({
          ...state,

          chainType: action?.payload,
        })
      )
      return {
        ...state,
        chainType: action?.payload,
      }
    case "noUserFound":
      localStorage.setItem(
        "myState",
        JSON.stringify({
          ...state,
          walletType: action.payload,
        })
      )
      return {
        ...state,
        walletType: action.payload,
      }
    case "login":
      localStorage.setItem(
        "myState",
        JSON.stringify({
          ...state,
          isAuthenticated: true,
          citizen: action.payload.citizen,
          token: action.payload.token,
          walletType: action?.payload?.walletType,
          loginAccount: action?.payload?.loginAccount,
        })
      )
      return {
        ...state,
        isAuthenticated: true,
        citizen: action.payload.citizen,
        token: action.payload.token,
        firstTime: action?.payload?.firstTime,
        walletType: action?.payload?.walletType,
        loginAccount: action?.payload?.loginAccount,
      }

    case "offFirstTime":
      return { ...state, firstTime: false }

    case "editProfile":
      localStorage.setItem(
        "myState",
        JSON.stringify({
          ...state,

          citizen: {
            ...state?.citizen,

            bio: action?.payload?.bio,
            profileImage: action?.payload?.profileImage,
          },
        })
      )
      return {
        ...state,
        citizen: {
          ...state?.citizen,
          userName: action?.payload?.userName,
          bio: action?.payload?.bio,
          profileImage: action?.payload?.profileImage,
        },
      }
    case "changeWalletEVM":
      const beforeUpdate = JSON.parse(localStorage.getItem("myState")) || {}
      const afterUpdate = {
        ...beforeUpdate,
        citizen: { ...state.citizen, evmAddress: action.payload },
      }
      localStorage.setItem("myState", JSON.stringify(afterUpdate))
      return { ...afterUpdate }
    case "changeWalletSolana":
      const beforeUpdatesolana =
        JSON.parse(localStorage.getItem("myState")) || {}
      const afterUpdatesolana = {
        ...beforeUpdatesolana,
        citizen: { ...state.citizen, walletAddress: action.payload },
      }
      localStorage.setItem("myState", JSON.stringify(afterUpdatesolana))
      return { ...afterUpdatesolana }
    case "logout":
      localStorage.clear()
      return initialState

    default:
      return state
  }
}
const getInitialStateFromLocalStorage = () => {
  const storedState = localStorage.getItem("myState")
  return storedState ? JSON.parse(storedState) : initialState
}
const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    reducer,
    [],
    getInitialStateFromLocalStorage
  )
  const { connect, disconnect, publicKey, select } = useWallet()
  const {
    loading: connectingMetamask,
    startLoading: startConnectingMetamask,
    stopLoading: stopConnectingMetamask,
  } = useLoadingState()
  const {
    loading: connectingPhantom,
    startLoading: startConnectingPhantom,
    stopLoading: stopConnectingPhantom,
  } = useLoadingState()

  const navigate = useNavigate()
  const {
    loading: requesting,
    startLoading: startRequesting,
    stopLoading: stopRequesting,
  } = useLoadingState()
  const [isNoUserFound, setIsNoUserFound] = useState(false)
  // const navigate = useNavigate()
  const { connected, sdk, account } = useSDK()
  const [isRunMobile, setIsRunMobile] = useState(false)

  useEffect(() => {
    const url = new URL(window.location.href)
    const data = url.searchParams.get("data")
    const nonce = url.searchParams.get("nonce")
    const phantomKey = url.searchParams.get("phantom_encryption_public_key")

    if (data && nonce && phantomKey && isRunMobile) {
      const payload = decryptPayload({
        data,
        nonce,
        phantom_encryption_public_key: phantomKey,
      })

      const sharedSecret = nacl.box.before(
        bs58.decode(phantomKey),
        dappKeyPair.secretKey
      )

      if (payload.public_key) {
        // ✅ CONNECT flow complete
        const account = payload.public_key
        const timeStamp = new Date().toISOString()

        // Trigger SIGN deep link now
        const signUrl = buildSignMessageUrl(sharedSecret, account, timeStamp)
        window.location.href = signUrl
      }

      if (payload.signature) {
        // ✅ SIGNATURE received
        const account = payload.public_key
        const signatureArray = Array.from(payload.signature).join(",")

        const timeStamp = payload.timestamp || new Date().toISOString()

        verifyProfile({
          wallet: account,
          timestamp: timeStamp,
          signature: signatureArray,
          isEVM: false,
        }).then((verified) => {
          if (!verified?.userInfo) {
            setIsNoUserFound(true)
            dispatch({ type: "noUserFound", payload: "phantom" })
            return
          }

          if (verified?.status === 200 || verified?.status === 201) {
            dispatch({
              type: "login",
              payload: {
                citizen: verified?.userInfo?.citizen,
                token: verified?.userInfo?.token,
                firstTime: verified?.status === 200 ? false : true,
                walletType: "phantom",
                loginAccount: account,
              },
            })

            onClose?.()
            setShowAnimation(true)
            if (!fromShareBounty) {
              navigate("/", { replace: true })
              setIsRunMobile(false)
            }
          }
        })
      }
    }
  }, [isRunMobile])

  const startLogin = () => {
    const url = buildConnectUrl()
    window.location.href = url
  }

  const { setShowAnimation } = useGlobalState()
  const handleLogout = async () => {
    try {
      if (sdk && connected) {
        await sdk.disconnect()
      }

      if (state?.walletType === "phantom") {
        disconnectPhantomWallet()
      }
    } catch (error) {
      console.error("Error disconnecting wallet:", error)
    }

    dispatch({
      type: "logout",
      payload: {
        citizen: null,
        token: null,
        firstTime: true,
      },
    })
    setIsNoUserFound(false)
  }

  const handleCreateNewAccount = async (
    isEVM,
    wallet,
    fromShareBounty,
    onClose
  ) => {
    try {
      startRequesting()

      const { signature, timeStamp } = await getWalletSignature(
        state?.walletType,
        sdk
      )

      const verified = await createProfile({
        wallet: wallet,
        timestamp: timeStamp,
        signature: signature,
        isEVM,
      })

      if (verified?.status === 200 || verified?.status === 201) {
        dispatch({
          type: "login",
          payload: {
            citizen: verified?.userInfo?.citizen,
            token: verified?.userInfo?.token,
            firstTime: verified?.status === 200 ? false : true,
            walletType: state?.walletType,
            loginAccount: wallet,
          },
        })
        onClose()
        setShowAnimation(true)
        if (fromShareBounty) {
          return
        } else navigate("/", { replace: true })
      }
    } catch (error) {
      console.log(error)
    } finally {
      stopRequesting()
    }
  }

  const handleConnectMetamask = async (isEVM, fromShareBounty, onClose) => {
    try {
      startConnectingMetamask()
      const { accounts } = await onConnection()

      const timeStamp = new Date().toISOString()
      const message = `impact-landscapes:${timeStamp}`

      const signature = await sdk.connectAndSign({ msg: message })

      const verified = await verifyProfile({
        wallet: accounts[0],
        timestamp: timeStamp,
        signature: signature,
        isEVM,
      })

      if (!verified?.userInfo) {
        setIsNoUserFound(true)
        dispatch({ type: "noUserFound", payload: "metamask" })

        return
      }

      if (verified?.status === 200 || verified?.status === 201) {
        dispatch({
          type: "login",
          payload: {
            citizen: verified?.userInfo?.citizen,
            token: verified?.userInfo?.token,
            firstTime: verified?.status === 200 ? false : true,
            walletType: "metamask",
            loginAccount: accounts[0],
          },
        })
        onClose()
        setShowAnimation(true)
        if (fromShareBounty) {
          return
        } else navigate("/", { replace: true })
      }
    } catch (error) {
      console.log(error, "is error during sign")
    } finally {
      stopConnectingMetamask()
    }
  }

  const handleConnectPhantom = async (isEVM, fromShareBounty, onClose) => {
    try {
      startConnectingPhantom()

      const { account, redirected } = await onConnectionPhantom(startLogin)

      if (redirected) {
        setIsRunMobile(true)
        return
      }

      // const { account, redirected } = await onConnectionPhantom()

      // if (redirected) return // wait until user returns from Phantom

      const timeStamp = new Date().toISOString()
      const message = `impact-landscapes:${timeStamp}`

      const encodedMessage = new TextEncoder().encode(message)
      const signedMessage = await window.solana.signMessage(
        encodedMessage,
        "utf8"
      )

      const signatureArray = Array.from(signedMessage.signature).join(",")

      const verified = await verifyProfile({
        wallet: account,
        timestamp: timeStamp,
        signature: signatureArray,
        isEVM,
      })

      if (!verified?.userInfo) {
        setIsNoUserFound(true)
        dispatch({ type: "noUserFound", payload: "phantom" })
        return
      }

      if (verified?.status === 200 || verified?.status === 201) {
        dispatch({
          type: "login",
          payload: {
            citizen: verified?.userInfo?.citizen,
            token: verified?.userInfo?.token,
            firstTime: verified?.status === 200 ? false : true,
            walletType: "phantom",
            loginAccount: account,
          },
        })
        onClose()
        setShowAnimation(true)
        if (fromShareBounty) {
          return
        } else navigate("/", { replace: true })
      }
    } catch (error) {
      console.log("Phantom wallet connection error:", error)
    } finally {
      stopConnectingPhantom()
    }
  }
  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
        handleConnectMetamask,
        handleCreateNewAccount,
        handleConnectPhantom,
        handleLogout,
        isNoUserFound,
        setIsNoUserFound,
        connectingMetamask,
        connectingPhantom,
        isCreating: requesting,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => {
  return useContext(AuthContext)
}

export { AuthProvider, useAuth }

/*


we are selecting chain type from the dropdown whether it is evm or solana 
and we are selecting wallet type from handleConnectMetamask or handleConnectPhantom


*/
