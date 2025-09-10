export const phantomConnection = async (linkedWallet, wallet) => {
  try {
    const phantom = wallet.wallets.find((w) => w.adapter.name === "Phantom")

    if (!phantom || !phantom.adapter) {
      toast.error("Phantom wallet not found")
      return "chainerror"
    }

    // Select Phantom wallet if not already selected
    if (phantom.adapter?.name !== "Phantom") {
      await wallet.select(phantom.adapter.name)
    }

    // Disconnect if already connected
    if (phantom.adapter.connected) {
      await phantom.adapter.disconnect()
    }

    // Now connect to Phantom
    await phantom.adapter.connect()

    const publicKey = phantom.adapter.publicKey
    if (!publicKey) {
      toast.error("Failed to get Phantom wallet address")
      return "chainerror"
    }

    const newWallet = publicKey.toBase58()?.toLowerCase()
    const existingWallet = linkedWallet?.toLowerCase()

    if (existingWallet && newWallet !== existingWallet) {
      return undefined
    } else if (!existingWallet) {
      return { text: "changewallet", wallet: publicKey.toBase58() }
    } else {
      console.log("returned")
      return publicKey.toBase58()
    }
  } catch (error) {
    toast.error("Error connecting to Phantom wallet")
    return "chainerror"
  }
}

export const phantomConnectionLogin = async (wallet) => {
  try {
    const phantom = wallet.wallets.find((w) => w.adapter.name === "Phantom")

    if (!phantom || !phantom.adapter) {
      toast.error("Phantom wallet not found")
      return "chainerror"
    }

    // Select Phantom wallet if not already selected
    if (phantom.adapter?.name !== "Phantom") {
      await wallet.select(phantom.adapter.name)
    }

    // Disconnect if already connected
    if (phantom.adapter.connected) {
      await phantom.adapter.disconnect()
    }

    // Now connect to Phantom
    await phantom.adapter.connect()

    const publicKey = phantom.adapter.publicKey
    if (!publicKey) {
      toast.error("Failed to get Phantom wallet address")
      return "chainerror"
    }

    return { text: "changewallet", wallet: publicKey.toBase58() }
  } catch (error) {
    toast.error("Error connecting to Phantom wallet")
    return "chainerror"
  }
}
