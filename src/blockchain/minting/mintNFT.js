import { ethers } from "ethers"
import { getPublicClient } from "wagmi/actions"
import axios from "axios"
import {
  ALCHEMY_API_KEY,
  COINGECKO_URL,
  merkletree,
  merkletreeprivatekey,
  MINTPRICE_USD,
  mintpriceinsol,
  RPC_ENDPOINT,
} from "../../constants/apiPath"
import { getMetaMaskProvider } from "../funding/transferFunds"
import {
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAccount,
  getAssociatedTokenAddress,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token"
import { createSignerFromKeypair, publicKey } from "@metaplex-foundation/umi"
import { mintToCollectionV1 } from "@metaplex-foundation/mpl-bubblegum"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters"
import {
  Connection,
  PublicKey,
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
  Transaction,
} from "@solana/web3.js"
import { toWeb3JsInstruction } from "@metaplex-foundation/umi-web3js-adapters"

import { getRpcUrl } from "../../apis/getRPCURL"
import { toast } from "sonner"

/*
  transfer SOL equal to $5 to the treasury
  mint one NFT to user's wallet
  requirements: treasury publickey, tree creator keypair, user keypair, 
*/

const ERC721_ABI = [
  "function isTokenWhitelisted(address tokenAddress) public view returns (bool)",
  "function getTokenAmount(address tokenAddress) public view returns (uint256)",
  "function mintWithToken(address tokenAddress) public",
  "function mintPrice() public view returns (uint256)",
  "function mint() public payable",
]

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function totalSupply() external view returns (uint256)",
]

// export const getMintPriceForSolana = async () => {
//   const config = {
//     headers: {
//       "X-CMC_PRO_API_KEY": COINMARKETCAP_API_KEY,
//     },
//     params: {
//       symbol: "SOL",
//       convert: "USD",
//     },
//   }

//   let response = await axios.get(COINMARKETCAP_API_URL, config)
//   let tokenPriceRaw =
//     response?.data?.data &&
//     response?.data?.data["SOL"] &&
//     response?.data?.data["SOL"].length > 0 &&
//     response?.data?.data["SOL"][0]?.quote?.USD?.price

//   return Number((5 / Number(Number(tokenPriceRaw)?.toFixed(2))).toFixed(9))
// }

export const getMintPriceForSolana = async () => {
  const response = await fetch(COINGECKO_URL)

  const data = await response.json()
  const price = data?.solana?.usd

  // $5 worth in SOL
  return Number((MINTPRICE_USD / price).toFixed(9))
}

// Initialize connection to Solana network

export const getSPLTokenBalance = async (walletAddress, tokenMintAddress) => {
  const connection = new Connection(RPC_ENDPOINT)
  try {
    const walletPublicKey = new PublicKey(walletAddress)
    const tokenMintPublicKey = new PublicKey(tokenMintAddress)

    // Get the associated token account address
    const associatedTokenAddress = await getAssociatedTokenAddress(
      tokenMintPublicKey,
      walletPublicKey
    )

    // Get account info
    const accountInfo = await getAccount(connection, associatedTokenAddress)

    // Get mint info to get decimals
    const mintInfo = await connection.getParsedAccountInfo(tokenMintPublicKey)
    const decimals = mintInfo.value?.data?.parsed?.info?.decimals || 0

    // Calculate actual balance (raw balance / 10^decimals)
    const balance = Number(accountInfo.amount) / Math.pow(10, decimals)

    return balance
  } catch (error) {
    if (error?.toString()?.includes("TokenAccountNotFoundError")) {
      return 0
    }
    console.error("Error fetching SPL token balance:", error?.toString())
    throw error
  }
}

export const getMintPriceForEVMInStableCoin = async (
  contractAddress,
  chainId,
  erc20Address
) => {
  const provider = new ethers.JsonRpcProvider(getRpcUrl(chainId))

  const nftContract = new ethers.Contract(contractAddress, ERC721_ABI, provider)

  try {
    const whitelisted = await nftContract.isTokenWhitelisted(erc20Address)
    if (!whitelisted) {
      throw new Error("Token not whitelisted for minting")
    }
    const mintPrice = await nftContract.getTokenAmount(erc20Address)

    return mintPrice
  } catch (error) {
    throw error
  }
}

export const getTokenBalance = async (chainId, tokenAddress, walletAddress) => {
  const provider = new ethers.JsonRpcProvider(getRpcUrl(chainId))
  // const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
  const erc20Contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider)
  const senderBalance = await erc20Contract.balanceOf(walletAddress)
  return senderBalance
}

export const getMintPriceForEVM = async (contractAddress, chainId) => {
  const provider = new ethers.JsonRpcProvider(getRpcUrl(chainId))

  const contract = new ethers.Contract(contractAddress, ERC721_ABI, provider)

  try {
    const rawPrice = await contract.mintPrice()

    const decimals = 18

    const mintPrice = Number(rawPrice) / Math.pow(10, decimals)

    return mintPrice
  } catch (error) {
    throw error
  }
}

// ABI for the setTokenURI function

// export const mintNftWithToken = async (erc20Address, nftAddress, chainId) => {
//   try {
//     const metaMaskProvider = getMetaMaskProvider()

//     const accounts = await metaMaskProvider.request({
//       method: "eth_requestAccounts",
//     })

//     const from = accounts[0]

//     const web3Provider = new ethers.BrowserProvider(metaMaskProvider)

//     const signer = await web3Provider.getSigner()

//     const nftContract = new ethers.Contract(nftAddress, ERC721_ABI, signer)
//     const erc20Contract = new ethers.Contract(erc20Address, ERC20_ABI, signer)

//     const whitelisted = await nftContract.isTokenWhitelisted(erc20Address)

//     if (!whitelisted) {
//       throw new Error("Token not whitelisted for minting")
//     }

//     const mintPrice = await nftContract.getTokenAmount(erc20Address)

//     const approveData = new ethers.Interface([
//       "function approve(address spender, uint256 amount) external returns (bool)",
//     ]).encodeFunctionData("approve", [nftAddress, mintPrice])

//     const transactionParams = {
//       to: erc20Address, // Contract address
//       from: from, // Connected account
//       data: approveData, // Encoded function call
//     }

//     // Send the transaction using MetaMask's request method
//     const result = await metaMaskProvider.request({
//       method: "eth_sendTransaction",
//       params: [transactionParams],
//     })

//     // const approved = await erc20Contract.approve(nftAddress, mintPrice)
//     // if (!approved) {
//     //   throw new Error("Failed to approve transferring mint price")
//     // }
//     const [waitTime, maxRetries] = [1000, 5]
//     let allowance
//     for (let i = 0; i < maxRetries; ++i) {
//       allowance = await erc20Contract.allowance(from, nftAddress)
//       if (allowance < mintPrice) {
//         await new Promise((res) => setTimeout(res, waitTime))
//       } else {
//         break
//       }
//     }

//     if (mintPrice > allowance) {
//       throw new Error("Could not allow approving transfer of mint price")
//     }

//     const mintData = new ethers.Interface([
//       "function mintWithToken(address tokenAddress) public",
//     ]).encodeFunctionData("mintWithToken", [erc20Address])

//     const transactionParams2 = {
//       to: nftAddress, // Contract address
//       from: from, // Connected account
//       data: mintData, // Encoded function call
//     }

//     // Send the transaction using MetaMask's request method
//     const result2 = await metaMaskProvider.request({
//       method: "eth_sendTransaction",
//       params: [transactionParams2],
//     })

//     return { success: true, result: result2 }
//   } catch (error) {
//     console.error(error, error?.code)
//     return { success: false, code: error?.message }
//   }
// }

// Contract setup

// Get whitelisted token addresses
export const getWhitelistedTokenAddresses = async (chainId, erc721Address) => {
  try {
    const provider = new ethers.JsonRpcProvider(getRpcUrl(chainId))
    // const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
    const erc721Contract = new ethers.Contract(
      erc721Address,
      ["function getWhitelistedTokens() view returns (address[])"],
      provider
    )
    const tokenAddresses = await erc721Contract.getWhitelistedTokens()
    return tokenAddresses
  } catch (error) {
    console.error("Error fetching whitelisted tokens:", error)
    throw error
  }
}

export const mintNftWithToken = async (
  erc20Address,
  nftAddress,
  chainId,
  walletClient // pass wallet client from Farcaster wallet
) => {
  try {
    const userAddress = await walletClient.account.address

    // Create provider for reading contract data
    const provider = new ethers.JsonRpcProvider(getRpcUrl(chainId))
    const nftContract = new ethers.Contract(nftAddress, ERC721_ABI, provider)
    const erc20Contract = new ethers.Contract(erc20Address, ERC20_ABI, provider)

    const whitelisted = await nftContract.isTokenWhitelisted(erc20Address)
    if (!whitelisted) {
      throw new Error("Token not whitelisted for minting")
    }

    const mintPrice = await nftContract.getTokenAmount(erc20Address)

    const currentAllowance = await erc20Contract.allowance(
      userAddress,
      nftAddress
    )

    if (currentAllowance < mintPrice) {
      // Approve token spending
      const approveData = new ethers.Interface([
        "function approve(address spender, uint256 amount) external returns (bool)",
      ]).encodeFunctionData("approve", [nftAddress, mintPrice])

      const approveHash = await walletClient.sendTransaction({
        to: erc20Address,
        data: approveData,
      })

      // Wait for approval transaction to be mined
      await provider.waitForTransaction(approveHash)
    }

    const finalAllowance = await erc20Contract.allowance(
      userAddress,
      nftAddress
    )
    if (finalAllowance < mintPrice) {
      throw new Error(
        `Insufficient allowance: ${finalAllowance.toString()} < ${mintPrice.toString()}`
      )
    }

    // Mint NFT with token
    const mintData = new ethers.Interface([
      "function mintWithToken(address tokenAddress) public",
    ]).encodeFunctionData("mintWithToken", [erc20Address])

    const mintHash = await walletClient.sendTransaction({
      to: nftAddress,
      data: mintData,
    })

    return { success: true, result: mintHash }
  } catch (error) {
    console.error("Minting error:", error)

    if (error.code === "ACTION_REJECTED") {
      return { success: false, code: "User rejected the transaction" }
    } else if (error.code === "INSUFFICIENT_FUNDS") {
      return { success: false, code: "Insufficient funds for transaction" }
    } else if (error.reason) {
      return { success: false, code: error.reason }
    }

    return { success: false, code: error?.message || "Unknown error occurred" }
  }
}

// export const mintNftWithToken = async (
//   erc20Address,
//   nftAddress,
//   chainId,
//   walletClient
// ) => {
//   try {
//     const userAddress = walletClient.account.address
//     const rpcUrl = getRpcUrl(chainId)
//     const provider = new ethers.JsonRpcProvider(rpcUrl)

//     const nftContract = new ethers.Contract(nftAddress, ERC721_ABI, provider)
//     const erc20Contract = new ethers.Contract(erc20Address, ERC20_ABI, provider)

//     const decimalsContract = new ethers.Contract(
//       erc20Address,
//       ["function decimals() view returns (uint8)"],
//       provider
//     )
//     const decimals = await decimalsContract.decimals()

//     const whitelisted = await nftContract.isTokenWhitelisted(erc20Address)
//     if (!whitelisted) throw new Error("Token not whitelisted for minting")

//     const mintPrice = await nftContract.getTokenAmount(erc20Address)
//     const humanReadablePrice = ethers.formatUnits(mintPrice, decimals)
//     console.log(
//       "Mint price:",
//       humanReadablePrice,
//       `(${mintPrice.toString()} raw)`
//     )

//     const currentAllowance = await erc20Contract.allowance(
//       userAddress,
//       nftAddress
//     )

//     if (currentAllowance < mintPrice) {
//       const approveData = new ethers.Interface([
//         "function approve(address spender, uint256 amount) external returns (bool)",
//       ]).encodeFunctionData("approve", [nftAddress, mintPrice])

//       const approveHash = await walletClient.sendTransaction({
//         to: erc20Address,
//         data: approveData,
//         account: userAddress,
//         chain: { id: chainId },
//       })

//       const publicClient = getPublicClient({ chainId })
//       await publicClient.waitForTransactionReceipt({ hash: approveHash })

//       // await walletClient.waitForTransaction({ hash: approveHash })
//     }

//     const finalAllowance = await erc20Contract.allowance(
//       userAddress,
//       nftAddress
//     )

//     if (finalAllowance < mintPrice) {
//       throw new Error(
//         `Insufficient allowance: ${finalAllowance.toString()} < ${mintPrice.toString()}`
//       )
//     }

//     const mintData = new ethers.Interface([
//       "function mintWithToken(address tokenAddress) public",
//     ]).encodeFunctionData("mintWithToken", [erc20Address])

//     const gasEstimate = await provider.estimateGas({
//       to: nftAddress,
//       from: userAddress,
//       data: mintData,
//     })

//     const mintHash = await walletClient.sendTransaction({
//       to: nftAddress,
//       data: mintData,
//       gas: gasEstimate.toString(),
//       account: userAddress,
//       chain: { id: chainId },
//     })

//     return { success: true, result: mintHash }
//   } catch (error) {
//     console.error("Minting error:", error)

//     if (error.code === "ACTION_REJECTED") {
//       return { success: false, code: "User rejected the transaction" }
//     } else if (error.code === "INSUFFICIENT_FUNDS") {
//       return { success: false, code: "Insufficient funds for transaction" }
//     } else if (error.reason) {
//       return { success: false, code: error.reason }
//     }

//     return { success: false, code: error?.message || "Unknown error occurred" }
//   }
// }

// export const mintNftWithToken = async (erc20Address, nftAddress, chainId) => {
//   try {
//     const metaMaskProvider = getMetaMaskProvider()

//     const accounts = await metaMaskProvider.request({
//       method: "eth_requestAccounts",
//     })

//     const from = accounts[0]

//     const web3Provider = new ethers.BrowserProvider(metaMaskProvider)
//     const signer = await web3Provider.getSigner()

//     const nftContract = new ethers.Contract(nftAddress, ERC721_ABI, signer)
//     const erc20Contract = new ethers.Contract(erc20Address, ERC20_ABI, signer)

//     const whitelisted = await nftContract.isTokenWhitelisted(erc20Address)

//     if (!whitelisted) {
//       throw new Error("Token not whitelisted for minting")
//     }

//     const mintPrice = await nftContract.getTokenAmount(erc20Address)

//     // Check current allowance first
//     const currentAllowance = await erc20Contract.allowance(from, nftAddress)

//     if (currentAllowance < mintPrice) {
//       // Method 1: Using ethers contract (recommended)
//       const approveTx = await erc20Contract.approve(nftAddress, mintPrice)

//       // Wait for transaction confirmation
//       const approvalReceipt = await approveTx.wait()
//     }

//     // Double-check allowance after approval
//     const finalAllowance = await erc20Contract.allowance(from, nftAddress)

//     if (finalAllowance < mintPrice) {
//       throw new Error(
//         `Insufficient allowance: ${finalAllowance.toString()} < ${mintPrice.toString()}`
//       )
//     }

//     const mintTx = await nftContract.mintWithToken(erc20Address)

//     const mintReceipt = await mintTx.wait()

//     return { success: true, result: mintTx.hash, receipt: mintReceipt }
//   } catch (error) {
//     console.error("Minting error:", error)

//     // Handle specific error types
//     if (error.code === "ACTION_REJECTED") {
//       return { success: false, code: "User rejected the transaction" }
//     } else if (error.code === "INSUFFICIENT_FUNDS") {
//       return { success: false, code: "Insufficient funds for transaction" }
//     } else if (error.reason) {
//       return { success: false, code: error.reason }
//     }

//     return { success: false, code: error?.message || "Unknown error occurred" }
//   }
// }
// export const getMintTransactionWithStableCoin = async (
//   metadataUri,
//   nftName,
//   collectionMintString,
//   treasuryAddress,
//   connection,
//   wallet,
//   tokenAddress,
//   decimals
// ) => {
//   console.log("0>>>>>>>>>>>", wallet?.publicKey)
//   const phantomAddressPublicKey = wallet?.publicKey
//   const collectionMint = publicKey(collectionMintString)
//   const treasury = new PublicKey(treasuryAddress)
//   const merkleTree = publicKey(merkletree)

//   const umi = createUmi(RPC_ENDPOINT)

//   umi.use(walletAdapterIdentity(wallet?.wallet?.adapter))

//   const keypair1 = Keypair.fromSecretKey(
//     new Uint8Array(merkletreeprivatekey?.split(",")?.map(Number))
//   )

//   const treeCreatorKeypair = umi.eddsa.createKeypairFromSecretKey(
//     keypair1.secretKey
//   )
//   const treeCreatorKeypairSigner = createSignerFromKeypair(
//     umi,
//     treeCreatorKeypair
//   )

//   const fromPublicKey = phantomAddressPublicKey
//   const toPublicKey = treasury
//   const mintPublicKey = new PublicKey(tokenAddress)

//   const rawAmount = BigInt(Math.floor(MINTPRICE_USD * Math.pow(10, decimals)))

//   console.log("a>>>>>>", mintPublicKey, fromPublicKey, tokenAddress)
//   // Get associated token addresses
//   const fromTokenAccount = getAssociatedTokenAddressSync(
//     mintPublicKey,
//     fromPublicKey
//   )
//   console.log("b>>>>>>")
//   const toTokenAccount = getAssociatedTokenAddressSync(
//     mintPublicKey,
//     toPublicKey,
//     true
//   )
//   console.log("c>>>>>>")

//   const transferInstructions = []

//   // Check if receiver's token account exists
//   console.log("d>>>>>>")
//   const toAccountInfo = await connection.getAccountInfo(toTokenAccount)
//   console.log("e>>>>>>>>>>>", toAccountInfo)
//   // If receiver's token account doesn't exist, create it
//   if (!toAccountInfo) {
//     console.log("f>>>>>>>>>>>")
//     const createAccountInstruction = createAssociatedTokenAccountInstruction(
//       fromPublicKey, // payer
//       toTokenAccount, // associatedToken
//       toPublicKey, // owner
//       mintPublicKey // mint
//     )
//     transferInstructions.push(createAccountInstruction)
//   }
//   console.log(
//     "g>>>>>>>>>>>",

//     fromTokenAccount,
//     toTokenAccount,
//     fromPublicKey,
//     rawAmount
//   )

//   // Create the transfer instruction
//   const transferInstruction = createTransferInstruction(
//     fromTokenAccount, // source
//     toTokenAccount, // destination
//     fromPublicKey, // owner of source account
//     rawAmount // amount in raw units
//   )
//   console.log("h>>>>>>>>>>>", transferInstruction)
//   transferInstructions.push(transferInstruction)

//   const mintInstructions = mintToCollectionV1(umi, {
//     leafOwner: phantomAddressPublicKey,
//     merkleTree,
//     collectionMint,
//     metadata: {
//       name: nftName,
//       uri: metadataUri,
//       sellerFeeBasisPoints: 0,
//       symbol: "PILL",
//       collection: { key: collectionMint, verified: false },
//       creators: [
//         {
//           address: treeCreatorKeypair.publicKey,
//           verified: false,
//           share: 100,
//         },
//       ],
//     },
//     treeCreatorOrDelegate: treeCreatorKeypairSigner,
//     collectionAuthority: treeCreatorKeypairSigner,
//   })
//     .getInstructions()
//     .map(toWeb3JsInstruction)
//   console.log("i>>>>>>>>>>>")

//   const blockhash = (await connection.getLatestBlockhash()).blockhash
//   console.log("j>>>>>>>>>>>")
//   const message = new TransactionMessage({
//     payerKey: wallet.publicKey,
//     recentBlockhash: blockhash,
//     instructions: [...transferInstructions, ...mintInstructions],
//   }).compileToV0Message()

//   console.log("k>>>>>>>>>>>")

//   const transaction = new VersionedTransaction(message)
//   console.log("l>>>>>>>>>>>", transaction)
//   // Sign with tree creator keypair (for the mint instructions)
//   transaction.sign([Keypair.fromSecretKey(treeCreatorKeypair.secretKey)])
//   console.log("m>>>>>>>>>>>", transaction)

//   return transaction
// }

//// new solana minting for farcaster
export const getMintTransactionWithStableCoin = async (
  metadataUri,
  nftName,
  collectionMintString,
  treasuryAddress,
  connection,
  wallet,
  tokenAddress,
  decimals
) => {
  console.log("0>>>>>>>>>>>", wallet?.publicKey)
  const phantomAddressPublicKey = wallet?.publicKey
  const collectionMint = publicKey(collectionMintString)
  const treasury = new PublicKey(treasuryAddress)
  const merkleTree = publicKey(merkletree)

  const umi = createUmi(RPC_ENDPOINT)

  umi.use(walletAdapterIdentity(wallet?.wallet?.adapter))

  const keypair1 = Keypair.fromSecretKey(
    new Uint8Array(merkletreeprivatekey?.split(",")?.map(Number))
  )

  const treeCreatorKeypair = umi.eddsa.createKeypairFromSecretKey(
    keypair1.secretKey
  )
  const treeCreatorKeypairSigner = createSignerFromKeypair(
    umi,
    treeCreatorKeypair
  )

  const fromPublicKey = phantomAddressPublicKey
  const toPublicKey = treasury
  const mintPublicKey = new PublicKey(tokenAddress)

  const rawAmount = BigInt(Math.floor(MINTPRICE_USD * Math.pow(10, decimals)))

  console.log("a>>>>>>", mintPublicKey, fromPublicKey, tokenAddress)
  // Get associated token addresses
  const fromTokenAccount = getAssociatedTokenAddressSync(
    mintPublicKey,
    fromPublicKey
  )
  console.log("b>>>>>>")
  const toTokenAccount = getAssociatedTokenAddressSync(
    mintPublicKey,
    toPublicKey,
    true
  )
  console.log("c>>>>>>")

  const transferInstructions = []

  // Check if receiver's token account exists
  console.log("d>>>>>>")
  const toAccountInfo = await connection.getAccountInfo(toTokenAccount)
  console.log("e>>>>>>>>>>>", toAccountInfo)
  // If receiver's token account doesn't exist, create it
  if (!toAccountInfo) {
    console.log("f>>>>>>>>>>>")
    const createAccountInstruction = createAssociatedTokenAccountInstruction(
      fromPublicKey, // payer
      toTokenAccount, // associatedToken
      toPublicKey, // owner
      mintPublicKey // mint
    )
    transferInstructions.push(createAccountInstruction)
  }
  console.log(
    "g>>>>>>>>>>>",

    fromTokenAccount,
    toTokenAccount,
    fromPublicKey,
    rawAmount
  )

  // Create the transfer instruction
  const transferInstruction = createTransferInstruction(
    fromTokenAccount, // source
    toTokenAccount, // destination
    fromPublicKey, // owner of source account
    rawAmount // amount in raw units
  )
  console.log("h>>>>>>>>>>>", transferInstruction)
  transferInstructions.push(transferInstruction)

  const mintInstructions = mintToCollectionV1(umi, {
    leafOwner: phantomAddressPublicKey,
    merkleTree,
    collectionMint,
    metadata: {
      name: nftName,
      uri: metadataUri,
      sellerFeeBasisPoints: 0,
      symbol: "PILL",
      collection: { key: collectionMint, verified: false },
      creators: [
        {
          address: treeCreatorKeypair.publicKey,
          verified: false,
          share: 100,
        },
      ],
    },
    treeCreatorOrDelegate: treeCreatorKeypairSigner,
    collectionAuthority: treeCreatorKeypairSigner,
  })
    .getInstructions()
    .map(toWeb3JsInstruction)
  console.log("i>>>>>>>>>>>")

  const blockhash = (await connection.getLatestBlockhash()).blockhash
  if (!blockhash) {
    throw new Error("Failed to fetch the latest Solana blockhash.")
  }
  console.log("j>>>>>>>>>>>")

  //   const transaction = new Transaction()
  //   transaction.add(...transferInstructions, ...mintInstructions)
  // transaction.recentBlockhash = blockhash;
  // transaction.feePayer = phantomAddressPublicKey

  const message = new TransactionMessage({
    payerKey: wallet.publicKey,
    recentBlockhash: blockhash,
    instructions: [...transferInstructions, ...mintInstructions],
  }).compileToV0Message()

  console.log("k>>>>>>>>>>>")

  const transaction = new VersionedTransaction(message)
  console.log("l>>>>>>>>>>>", transaction)
  // Sign with tree creator keypair (for the mint instructions)
  transaction.sign([Keypair.fromSecretKey(treeCreatorKeypair.secretKey)])
  console.log("m>>>>>>>>>>>", transaction)

  return transaction
}

export const getMintTransaction = async (
  metadataUri,
  nftName,
  collectionMintString,
  treasuryAddress,
  connection,
  wallet // useWallet() passed here
) => {
  const phantomAddressPublicKey = wallet.publicKey
  const collectionMint = publicKey(collectionMintString)
  const treasury = new PublicKey(treasuryAddress)
  const merkleTree = publicKey(merkletree)

  // const mintPriceInSol = Number(mintpriceinsol)

  const umi = createUmi(RPC_ENDPOINT)

  umi.use(walletAdapterIdentity(wallet))

  const keypair1 = Keypair.fromSecretKey(
    new Uint8Array(merkletreeprivatekey?.split(",")?.map(Number))
  )

  const treeCreatorKeypair = umi.eddsa.createKeypairFromSecretKey(
    keypair1.secretKey
  )
  const treeCreatorKeypairSigner = createSignerFromKeypair(
    umi,
    treeCreatorKeypair
  )

  const transferInstruction = SystemProgram.transfer({
    fromPubkey: phantomAddressPublicKey,
    toPubkey: treasury,
    lamports: (await getMintPriceForSolana()) * LAMPORTS_PER_SOL,
  })

  const mintInstructions = mintToCollectionV1(umi, {
    leafOwner: phantomAddressPublicKey,
    merkleTree,
    collectionMint,
    metadata: {
      name: nftName,
      uri: metadataUri,
      sellerFeeBasisPoints: 0,
      symbol: "PILL",
      collection: { key: collectionMint, verified: false },
      creators: [
        {
          address: treeCreatorKeypair.publicKey,
          verified: false,
          share: 100,
        },
      ],
    },
    treeCreatorOrDelegate: treeCreatorKeypairSigner,
    collectionAuthority: treeCreatorKeypairSigner,
  })
    .getInstructions()
    .map(toWeb3JsInstruction)

  const blockhash = (await connection.getLatestBlockhash()).blockhash

  const message = new TransactionMessage({
    payerKey: wallet.publicKey,
    recentBlockhash: blockhash,
    instructions: [transferInstruction, ...mintInstructions],
  }).compileToV0Message()

  const transaction = new VersionedTransaction(message)

  // Sign with tree creator keypair (for the mint instructions)
  transaction.sign([Keypair.fromSecretKey(treeCreatorKeypair.secretKey)])

  return transaction
}

export const mintNFT = async (contractAddress, chainId, walletClient) => {
  try {
    // Get mint price from the contract
    const provider = new ethers.JsonRpcProvider(getRpcUrl(chainId))
    const nftContract = new ethers.Contract(
      contractAddress,
      ERC721_ABI,
      provider
    )
    const mintPrice = await nftContract.mintPrice()

    // Prepare transaction data
    const mintData = new ethers.Interface([
      "function mint() public payable",
    ]).encodeFunctionData("mint", [])

    // Send transaction using wagmi wallet client
    const hash = await walletClient.sendTransaction({
      to: contractAddress,
      data: mintData,
      value: mintPrice,
    })

    return { success: true, result: hash }
  } catch (error) {
    console.error("Minting error:", error)
    return { success: false, code: error?.message || "Unknown error occurred" }
  }
}

// export const mintNFT = async (contractAddress, chainId, signer) => {
//   const metaMaskProvider = getMetaMaskProvider()

//   try {
//     // Request user accounts from MetaMask
//     // const accounts = await metaMaskProvider.request({
//     //   method: "eth_requestAccounts",
//     // })
//     // const from = accounts[0]

//     // const web3Provider = new ethers.BrowserProvider(metaMaskProvider)
//     // const signer = await web3Provider.getSigner()

//     // Create contract instance with the signer
//     const nftContract = new ethers.Contract(contractAddress, ERC721_ABI, signer)

//     // Get mint price from contract
//     const mintPrice = await nftContract.mintPrice()

//     // Encode the mint function call
//     const mintData = new ethers.Interface([
//       "function mint() public payable",
//     ]).encodeFunctionData("mint", [])

//     const transactionParams = {
//       to: contractAddress, // Contract address
//       from: from, // Connected account
//       data: mintData, // Encoded function call
//       value: "0x" + mintPrice.toString(16), // Payment required for minting
//     }

//     // Send the transaction using MetaMask's request method
//     const result = await metaMaskProvider.request({
//       method: "eth_sendTransaction",
//       params: [transactionParams],
//     })

//     return { success: true, result }
//   } catch (error) {
//     return { success: false, code: error?.message }
//   }
// }

// Use Phantom’s EVM provider
const getPhantomEvmProvider = () => {
  if (typeof window !== "undefined" && window?.ethereum?.isPhantom) {
    return window.ethereum
  }
  throw new Error(
    "Phantom EVM provider not found. Make sure Phantom is installed and selected."
  )
}

export const mintNFTP = async (contractAddress, chainId = 42161) => {
  try {
    const phantomProvider = getPhantomEvmProvider()

    // Check and switch to Arbitrum
    const currentChain = await phantomProvider.request({
      method: "eth_chainId",
    })
    if (parseInt(currentChain, 16) !== chainId) {
      await phantomProvider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      })
    }

    // Request account access
    const accounts = await phantomProvider.request({
      method: "eth_requestAccounts",
    })
    const from = accounts[0]

    const web3Provider = new ethers.BrowserProvider(phantomProvider)
    const signer = await web3Provider.getSigner()

    // Create contract instance
    const nftContract = new ethers.Contract(contractAddress, ERC721_ABI, signer)

    // Get mint price
    const mintPrice = await nftContract.mintPrice()

    // Encode mint() call
    const mintData = new ethers.Interface([
      "function mint() public payable",
    ]).encodeFunctionData("mint", [])

    const txParams = {
      from,
      to: contractAddress,
      data: mintData,
      value: `0x${mintPrice.toString(16)}`, // hex format
    }

    const txHash = await phantomProvider.request({
      method: "eth_sendTransaction",
      params: [txParams],
    })

    return { success: true, result: txHash }
  } catch (err) {
    return { success: false, error: err?.message || "Mint failed" }
  }
}
