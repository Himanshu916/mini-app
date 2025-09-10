// import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
// import { useWallet } from "@solana/wallet-adapter-react"
// import { useEffect, useRef, useState } from "react"
// import GradientBorder from "../../components/GradientBorder"
// import WalletConnectCustomButton from "./WalletConnectCustomButton"

// const ConnectPhantomBtn = ({
//   customText = "Connect Wallet", // Text before wallet selection
//   connectedText = "Connected", // Text when wallet is connected
//   disconnectedText = "Wallet Disconnected", // Text when wallet is selected but not connected
//   customStyles = {},
//   removeIconOnDisconnect = false, // Remove icon when wallet is selected but disconnected
//   removeIconOnConnect = false, // Remove icon when wallet is connected
//   removeIconOnWalletSelect = false, // Remove icon when no wallet is selected or not connected yet
//   removeIconOnConnecting = false, // New prop to remove icon when the wallet is connecting
//   width = "100%", // New width prop for the button
//   disabled = false,
// }) => {
//   const { connected, wallet, publicKey, connecting } = useWallet() // Add 'connecting' to detect when the wallet is in connecting state
//   const buttonRef = useRef(null) // Reference to the specific button
//   const [buttonText, setButtonText] = useState(customText) // Button text state

//   useEffect(() => {
//     const walletButton = buttonRef.current

//     // Function to update button text based on connection state
//     if (connected) {
//       setButtonText(connectedText) // Set text when connected
//     } else if (wallet && !connected) {
//       setButtonText(disconnectedText) // Set text when wallet is selected but not connected
//     } else {
//       setButtonText(customText) // Set default text when no wallet is selected
//     }
//   }, [
//     connected,
//     wallet,
//     connecting,
//     customText,
//     connectedText,
//     disconnectedText,
//   ])

//   // CSS to hide the icon based on the prop and connection states
//   const customStyleSheet = `
//         .wallet-adapter-button-start-icon {
//             display: ${
//               removeIconOnConnecting && connecting
//                 ? "none"
//                 : removeIconOnConnect && connected
//                 ? "none"
//                 : removeIconOnDisconnect && !connected && wallet
//                 ? "none"
//                 : removeIconOnWalletSelect && !wallet
//                 ? "none"
//                 : "inline"
//             };
//         }
//     `

//   return (
//     <>
//       <style>{customStyleSheet}</style>

//       <div className="w-full flex items-center">
//         <WalletConnectCustomButton
//           customText={"Connect Phantom"}
//           width="185px"
//           customStyles={{
//             backgroundColor: "transparent",
//             color: "#fff",
//             lineHeight: "normal",
//             fontWeight: "400",
//             paddingLeft: "12px",
//             paddingRight: "12px",
//             fontSize: ".875rem",
//             height: "31px",
//             flexGrow: 1,
//             fontFamily: "Inter, sans-serif",
//           }}
//           connectedText={"Connect Phantom"}
//           disconnectedText="Connect Phantom"
//           removeIconOnDisconnect={true}
//           removeIconOnConnect={true}
//           removeIconOnWalletSelect={true}
//           removeIconOnConnecting={true}
//         />
//       </div>
//     </>
//   )
// }

// export default ConnectPhantomBtn

import React from "react"
import GradientBorder from "../../components/GradientBorder"
import { useAuth } from "../../contexts/AuthContext"
import { useWallet } from "@solana/wallet-adapter-react"
import phantomImage from "../../assets/images/phantomImage.png"
import Loader from "../../components/Loader"

const ConnectPhantomBtn = ({
  isEVM,
  handleVerifyWallet2,
  isFromActivityPage,
  close,
  forLinkingProfile = false,
}) => {
  const { handleConnectPhantom, handleLogout, connectingPhantom } = useAuth()
  const { publicKey, connected, disconnect } = useWallet()

  return (
    <button
      onClick={() => {
        connected
          ? handleLogout()
          : forLinkingProfile
          ? handleVerifyWallet2("phantom", isFromActivityPage, close)
          : handleConnectPhantom(isEVM, isFromActivityPage, close)
      }}
      className="px-4 py-2 h-10 w-full "
    >
      {connectingPhantom ? (
        <div className="flex items-center justify-center w-full">
          <Loader color="fill-[#326F58]" />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="rounded-full">
            <img
              className="w-[1.2rem] h-[1.2rem]"
              src={phantomImage}
              alt="Phantom Wallet"
            />
          </div>

          <span className="text-xs md:text-sm text-[#FFF]">
            {"Connect Phantom"}
          </span>
        </div>
      )}
    </button>
  )
}

export default ConnectPhantomBtn
