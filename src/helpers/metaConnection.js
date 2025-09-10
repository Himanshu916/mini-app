import { toast } from "sonner"
import { getMetaMaskProvider } from "../blockchain/funding/transferFunds"
import { fetchChainDetails } from "../apis/metamaskHelper"

export const metaConnection = async (linkedWallet, chainId) => {
  const metaMaskProvider = getMetaMaskProvider()

  if (!metaMaskProvider) {
    const installUrl = "https://metamask.io/download.html"
    toast.info("Opening MetaMask installation page in a new tab...")
    window.open(installUrl, "_blank")
    return
  }

  try {
    // Always prompt MetaMask popup
    const accounts = await metaMaskProvider.request({
      method: "wallet_requestPermissions",
      params: [{ eth_accounts: {} }],
    })

    // Now explicitly request selected accounts again
    const selectedAccounts = await metaMaskProvider.request({
      method: "eth_requestAccounts",
    })

    if (!selectedAccounts || selectedAccounts.length === 0) {
      toast.error("No wallet selected. Connection cancelled.")
      return
    }

    const newWallet = selectedAccounts[0]?.toLowerCase()
    const existingWallet = linkedWallet?.toLowerCase()

    if (existingWallet && newWallet !== existingWallet) {
      return undefined
    } else if (!existingWallet) {
      return { text: "changewallet", wallet: selectedAccounts[0] }
    } else {
      const userChainId = await metaMaskProvider.request({
        method: "eth_chainId",
      })
      const targetChainId = `0x${parseInt(chainId, 10).toString(16)}` // Convert to hex string

      if (userChainId !== targetChainId) {
        try {
          // Attempt to switch to the correct chain
          await metaMaskProvider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: targetChainId }],
          })
          toast.success(`Switched to chain ID: ${targetChainId}`)
        } catch (switchError) {
          // Handle the case where the chain is not added or user rejects the switch

          if (switchError.code === 4902) {
            // 4902: Chain not added to MetaMask
            try {
              const chainDetails = await fetchChainDetails(chainId)
              await metaMaskProvider.request({
                method: "wallet_addEthereumChain",
                params: [chainDetails],
              })
              toast.success(`Added and switched to chain ID: ${targetChainId}`)
            } catch (addError) {
              toast.error("Failed to add or switch to the required chain")
              return "chainerror"
            }
          } else {
            toast.error("Please change your chain network manually")
            return "chainerror"
          }
        }
      }

      return selectedAccounts[0]
    }
  } catch (error) {
    console.error("MetaMask connection error:", error)
    toast.error("Failed to connect MetaMask wallet.")
    return "chainerror"
  }
}

export const metaConnectionPublic = async (linkedWallet, chainId) => {
  const metaMaskProvider = getMetaMaskProvider()

  if (!metaMaskProvider) {
    const installUrl = "https://metamask.io/download.html"
    toast.info("Opening MetaMask installation page in a new tab...")
    window.open(installUrl, "_blank")
    return
  }

  try {
    // Always prompt MetaMask popup
    // const accounts = await metaMaskProvider.request({
    //   method: "wallet_requestPermissions",
    //   params: [{ eth_accounts: {} }],
    // })

    // Now explicitly request selected accounts again
    const selectedAccounts = await metaMaskProvider.request({
      method: "eth_requestAccounts",
    })

    // if (!selectedAccounts || selectedAccounts.length === 0) {
    //   toast.error("No wallet selected. Connection cancelled.")
    //   return
    // }

    // const newWallet = selectedAccounts[0]?.toLowerCase()
    // const existingWallet = linkedWallet?.toLowerCase()

    const userChainId = await metaMaskProvider.request({
      method: "eth_chainId",
    })
    const targetChainId = `0x${parseInt(chainId, 10).toString(16)}` // Convert to hex string

    if (userChainId !== targetChainId) {
      try {
        // Attempt to switch to the correct chain
        await metaMaskProvider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: targetChainId }],
        })
        toast.success(`Switched to chain ID: ${targetChainId}`)
      } catch (switchError) {
        // Handle the case where the chain is not added or user rejects the switch

        if (switchError.code === 4902) {
          // 4902: Chain not added to MetaMask
          try {
            const chainDetails = await fetchChainDetails(chainId)
            await metaMaskProvider.request({
              method: "wallet_addEthereumChain",
              params: [chainDetails],
            })
            toast.success(`Added and switched to chain ID: ${targetChainId}`)
          } catch (addError) {
            toast.error("Failed to add or switch to the required chain")
            return "chainerror"
          }
        } else {
          toast.error("Please change your chain network manually")
          return "chainerror"
        }
      }
    }

    return selectedAccounts[0]
  } catch (error) {
    console.error("MetaMask connection error:", error)
    toast.error("Failed to connect MetaMask wallet.")
    return "chainerror"
  }
}

export const metaConnectionLogin = async () => {
  const metaMaskProvider = getMetaMaskProvider()

  if (!metaMaskProvider) {
    const installUrl = "https://metamask.io/download.html"
    toast.info("Opening MetaMask installation page in a new tab...")
    window.open(installUrl, "_blank")
    return
  }

  try {
    // Always prompt MetaMask popup
    const accounts = await metaMaskProvider.request({
      method: "wallet_requestPermissions",
      params: [{ eth_accounts: {} }],
    })

    // Now explicitly request selected accounts again
    const selectedAccounts = await metaMaskProvider.request({
      method: "eth_requestAccounts",
    })

    if (!selectedAccounts || selectedAccounts.length === 0) {
      toast.error("No wallet selected. Connection cancelled.")
      return
    }

    return { text: "changewallet", wallet: selectedAccounts[0] }
  } catch (error) {
    console.error("MetaMask connection error:", error)
    toast.error("Failed to connect MetaMask wallet.")
    return "chainerror"
  }
}
