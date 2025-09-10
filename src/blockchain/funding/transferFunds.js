import { parseUnits, Interface, ethers } from "ethers"
import { ALCHEMY_API_KEY } from "../../constants/apiPath"
import * as web3 from "@solana/web3.js"
import * as splToken from "@solana/spl-token"
import { getRpcUrl } from "../../apis/getRPCURL"
export const fetchChainDetails = async (chainId) => {
  try {
    // Fetch the list of all chains
    const response = await fetch("https://chainid.network/chains.json")
    const chains = await response.json()

    // Find the chain matching the targetChainId
    const chainDetails = chains.find(
      (chain) => chain.chainId === Number(chainId)
    )

    if (!chainDetails) {
      throw new Error(`Chain with ID ${chainId} not found.`)
    }

    // Extract necessary details
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
    // Single provider detected, and it's MetaMask
    return window.ethereum
  } else {
    // MetaMask is not installed
    return null
  }
}

export const getERC20Balance = async (tokenAddress, walletAddress, chainId) => {
  // Connect to the blockchain
  // const provider = ethers.getDefaultProvider(Number(chainId), {
  //   alchemy: ALCHEMY_API_KEY,
  //   quorum: 1,
  // })

  const provider = new ethers.JsonRpcProvider(getRpcUrl(chainId))

  // const provider = getMetaMaskProvider();
  // ABI for ERC20 `balanceOf` and `decimals` functions
  const ERC20_ABI = [
    "function balanceOf(address _owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
  ]

  // Create a contract instance
  const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider)

  try {
    // Get the token balance

    const rawBalance = await contract.balanceOf(walletAddress)

    // Get the token decimals
    const decimals = await contract.decimals()

    // Convert balance to a human-readable format
    const balance = Number(rawBalance) / Math.pow(10, Number(decimals))

    return balance
  } catch (error) {
    throw error
  }
}

export const transferFund = async ({
  tokenAddress,
  recieverWalletAddress,
  amount,
  decimals,
}) => {
  const metaMaskProvider = getMetaMaskProvider()

  try {
    const transferAmount = parseUnits(amount?.toString(), decimals) // Adjust decimals if needed (e.g., 6 for USDC)

    const accounts = await metaMaskProvider.request({
      method: "eth_requestAccounts",
    })
    const from = accounts[0]
    const transferData = new Interface([
      "function transfer(address to, uint256 value) public returns (bool)",
    ]).encodeFunctionData("transfer", [recieverWalletAddress, transferAmount])

    const transactionParams = {
      to: tokenAddress, // ERC-20 contract address
      from: from, // Fetch connected account
      data: transferData, // Encoded function call
      value: "0x0", // No ETH transfer
    }

    // Send transaction
    const result = await metaMaskProvider.request({
      method: "eth_sendTransaction",
      params: [transactionParams],
    })

    return { success: true, result }
  } catch (error) {
    console.error("Error during transfer:", error)
    return { success: false, code: error?.message }
  }
}

// Function to transfer SPL tokens from one wallet to another
export const getTransferTransaction = async (
  tokenMintAddress,
  fromWalletAddress,
  toWalletAddress,
  amountToTransfer,
  connection
) => {
  try {
    // 2. Load sender's keypair from file
    // const senderKeypair = web3.Keypair.fromSecretKey(
    //   Buffer.from(JSON.parse(fs.readFileSync(fromWalletPath, "utf-8")))
    // )

    // 3. Parse recipient's address
    const recipientAddress = new web3.PublicKey(toWalletAddress)
    const senderAddress = new web3.PublicKey(fromWalletAddress)

    // 4. Parse token mint address
    const mintAddress = new web3.PublicKey(tokenMintAddress)

    // 5. Get token accounts
    const senderTokenAccount = splToken.getAssociatedTokenAddressSync(
      mintAddress,
      senderAddress
    )

    // 6. Check if recipient has a token account, if not, create one
    const recipientTokenAccount = splToken.getAssociatedTokenAddressSync(
      mintAddress,
      recipientAddress,
      true
    )

    const instructions = []

    // Check if recipient token account exists, if not create it
    const recipientAccountInfo = await connection.getAccountInfo(
      recipientTokenAccount
    )
    if (!recipientAccountInfo) {
      instructions.push(
        splToken.createAssociatedTokenAccountInstruction(
          senderAddress, // associated token account address
          recipientTokenAccount,
          recipientAddress,
          mintAddress // mint
        )
      )
      // transaction.add(
      //   splToken.createAssociatedTokenAccountInstruction(
      //     senderKeypair.publicKey, // payer
      //     recipientTokenAccount, // associated token account address
      //     recipientAddress, // owner
      //     mintAddress // mint
      //   )
      // )
    }

    // 7. Calculate token amount (considering decimals)
    // Get mint info to determine decimals
    const mintInfo = await splToken.getMint(connection, mintAddress)
    const adjustedAmount = amountToTransfer * Math.pow(10, mintInfo.decimals)

    // 8. Add transfer instruction to transaction

    instructions.push(
      splToken.createTransferInstruction(
        senderTokenAccount, // source
        recipientTokenAccount, // destination
        senderAddress,
        BigInt(adjustedAmount) // amount to transfer with decimals applied
      )
    )

    const blockhash = (await connection.getLatestBlockhash()).blockhash

    const message = new web3.TransactionMessage({
      payerKey: senderAddress,
      recentBlockhash: blockhash,
      instructions: instructions,
    }).compileToV0Message()

    const transaction = new web3.VersionedTransaction(message)

    return transaction
  } catch (error) {
    console.error("Error transferring tokens:", error)
    throw error
  }
}
