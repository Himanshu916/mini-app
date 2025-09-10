export const fetchChainDetails = async (chainId) => {
  try {
    // Fetch the list of all chains
    const response = await fetch("https://chainid.network/chains.json")
    const chains = await response.json()

    const chainDetails = chains.find(
      (chain) => chain.chainId === Number(chainId)
    )

    if (!chainDetails) {
      throw new Error(`Chain with ID ${chainId} not found.`)
    }

    return {
      chainId: `0x${Number(chainDetails.chainId).toString(16)}`, // Convert to hex
      rpcUrls: chainDetails.rpc, // Array of RPC URLs
      chainName: chainDetails.name,
      nativeCurrency: {
        name: chainDetails.nativeCurrency.name,
        symbol: chainDetails.nativeCurrency.symbol,
        decimals: chainDetails.nativeCurrency.decimals || 18,
      },
      blockExplorerUrls:
        chainDetails.explorers?.map((explorer) => explorer.url) || [],
    }
  } catch (error) {
    console.error("Error fetching chain details:", error)
    throw new Error("Failed to fetch chain details.")
  }
}

export const getMetaMaskProvider = () => {
  if (window.ethereum && window.ethereum.providers) {
    // Multiple providers detected
    const providers = window.ethereum.providers

    // Find MetaMask's provider
    const metaMaskProvider = providers.find((provider) => provider.isMetaMask)

    return metaMaskProvider
  } else if (window.ethereum && window.ethereum.isMetaMask) {
    return window.ethereum
  } else {
    return null
  }
}

export const onConnection = async () => {
  const metaMaskProvider = getMetaMaskProvider()
  if (!metaMaskProvider) {
    const installUrl = "https://metamask.io/download.html"
    toast.info("Opening MetaMask installation page in a new tab...")
    window.open(installUrl, "_blank")

    return
  }

  const accounts = await metaMaskProvider.request({
    method: "eth_requestAccounts",
  })
  if (!accounts || accounts.length === 0) {
    toast.error("Failed to connect wallet")
    return
  }

  const userChainId = await metaMaskProvider.request({ method: "eth_chainId" })

  return {
    accounts,
    chainId: userChainId,
    account: accounts,
  }
}
