// wagmi.config.js
import { createConfig, http, createStorage, cookieStorage } from "wagmi"
import { base, optimism, arbitrum, celo } from "wagmi/chains"
import { farcasterMiniApp as miniAppConnector } from "@farcaster/miniapp-wagmi-connector"

export const wagmiConfig = createConfig({
  connectors: [miniAppConnector()],
  chains: [celo, arbitrum, base, optimism],
  transports: {
    [celo.id]: http(
      "https://celo-mainnet.g.alchemy.com/v2/js1is-GD3lRxRHkS4hsJXGcBYsFh7AH3"
    ),
    [arbitrum.id]: http(
      "https://arb-mainnet.g.alchemy.com/v2/js1is-GD3lRxRHkS4hsJXGcBYsFh7AH3"
    ),
    [base.id]: http(
      "https://base-mainnet.g.alchemy.com/v2/js1is-GD3lRxRHkS4hsJXGcBYsFh7AH3"
    ),
    [optimism.id]: http(
      "https://opt-mainnet.g.alchemy.com/v2/js1is-GD3lRxRHkS4hsJXGcBYsFh7AH3"
    ),
  },
  ssr: false,
  storage: createStorage({
    storage: cookieStorage,
  }),
})
