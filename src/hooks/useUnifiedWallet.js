import { useWallet as useSolanaWallet } from "@solana/wallet-adapter-react"
import { useAccount as useEvmAccount } from "wagmi"

export function useUnifiedWallet() {
  const solana = useSolanaWallet()
  const evm = useEvmAccount()

  if (solana.connected && solana.publicKey) {
    return { type: "solana", address: solana.publicKey.toBase58(), solana }
  }
  if (evm.isConnected && evm.address) {
    return { type: "evm", address: evm.address, evm }
  }
  return { type: null, address: null }
}
