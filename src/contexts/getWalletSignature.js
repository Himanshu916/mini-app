export const getWalletSignature = async (walletType, sdk) => {
  const timeStamp = new Date().toISOString()
  const message = `impact-landscapes:${timeStamp}`
  let signature

  if (walletType === "metamask") {
    signature = await sdk.connectAndSign({ msg: message })
  }
  if (walletType === "phantom") {
    const encodedMessage = new TextEncoder().encode(message)
    const signedMessage = await window.solana.signMessage(
      encodedMessage,
      "utf8"
    )

    signature = Array.from(signedMessage.signature).join(",")
  }
  return { signature, timeStamp }
}
