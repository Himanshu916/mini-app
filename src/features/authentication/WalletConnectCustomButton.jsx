import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useWallet } from "@solana/wallet-adapter-react"
import { useEffect, useRef, useState } from "react"
import phantomImage from "../../assets/images/phantomImage.png"

const WalletConnectCustomButton = ({
  customText = "Connect Wallet", // Text before wallet selection
  connectedText = "Connected", // Text when wallet is connected
  disconnectedText = "Wallet Disconnected", // Text when wallet is selected but not connected
  customStyles = {},
  removeIconOnDisconnect = false, // Remove icon when wallet is selected but disconnected
  removeIconOnConnect = false, // Remove icon when wallet is connected
  removeIconOnWalletSelect = false, // Remove icon when no wallet is selected or not connected yet
  removeIconOnConnecting = false, // New prop to remove icon when the wallet is connecting
  width = "100%", // New width prop for the button
  disabled = false,
}) => {
  const { connected, wallet, publicKey, connecting } = useWallet() // Add 'connecting' to detect when the wallet is in connecting state
  const buttonRef = useRef(null) // Reference to the specific button
  const [buttonText, setButtonText] = useState(customText) // Button text state

  useEffect(() => {
    const walletButton = buttonRef.current

    // Function to update button text based on connection state
    if (connected) {
      setButtonText(connectedText) // Set text when connected
    } else if (wallet && !connected) {
      setButtonText(disconnectedText) // Set text when wallet is selected but not connected
    } else {
      setButtonText(customText) // Set default text when no wallet is selected
    }
  }, [
    connected,
    wallet,
    connecting,
    customText,
    connectedText,
    disconnectedText,
  ])

  // CSS to hide the icon based on the prop and connection states
  const customStyleSheet = `
        .wallet-adapter-button-start-icon {
            display: ${
              removeIconOnConnecting && connecting
                ? "none"
                : removeIconOnConnect && connected
                ? "none"
                : removeIconOnDisconnect && !connected && wallet
                ? "none"
                : removeIconOnWalletSelect && !wallet
                ? "none"
                : "inline"
            };
        }
    `

  return (
    <>
      <style>{customStyleSheet}</style>
      <WalletMultiButton
        disabled={disabled}
        ref={buttonRef} // Attach the reference to the specific button instance
        style={{
          width, // Use width prop to control width
          display: "flex", // Use flexbox for text centering

          alignItems: "center", // Center the text vertically
          gap: "8px",
          ...customStyles, // Apply custom styles
        }}
      >
        <span className="  rounded-full">
          <img className="w-[1.2rem] h[1.2rem] " src={phantomImage} alt="" />
        </span>
        {buttonText} {/* Render button text dynamically */}
      </WalletMultiButton>
    </>
  )
}

export default WalletConnectCustomButton
