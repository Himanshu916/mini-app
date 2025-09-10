import { ethers } from "ethers"
import axios from "axios"
import {
  ALCHEMY_API_KEY,
  BASE_URL,
  RPC_ENDPOINT,
} from "../../constants/apiPath"
import { getAccessToken } from "../../helpers/getAccessToken"
import { publicKey } from "@metaplex-foundation/umi"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api"
import { getRpcUrl } from "../../apis/getRPCURL"

const getConfig = (token) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}
// ABI for ERC721Enumerable interface
const ERC721EnumerableABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
]

export const getWalletNFTs = async (
  contractAddress,
  walletAddress,
  chainId,
  collectionNo,
  chainName,
  collectionAddress,
  name,
  chainImage
) => {
  try {
    // Connect to the network
    // const provider = new ethers.JsonRpcProvider(rpcUrl);
    const accessToken = getAccessToken()

    if (!walletAddress) {
      return []
    }

    if (chainName === "solana") {
      // read from landscape
      // const collectionAddress = "Fint57xmssDQwvYBf7FDCVxWCM8oJYh2tdq18csFWkN4"

      const umi = createUmi(RPC_ENDPOINT)

      umi.use(dasApi())

      const owner = publicKey(walletAddress)
      const heldNfts = []
      let nftFund

      const rpcAssetList = await umi.rpc.getAssetsByGroup({
        groupKey: "collection",
        groupValue: collectionAddress,
      })

      for (let i = 0; i < rpcAssetList.items.length; ++i) {
        if (rpcAssetList.items[i].ownership.owner === owner) {
          nftFund = await axios.get(
            `${BASE_URL}/landscape/nftProgress?assetId=${rpcAssetList.items[i].id}`,
            getConfig(accessToken)
          )
          // nftFund = 0

          heldNfts.push({
            tokenId: rpcAssetList.items[i].id,
            imageURI: rpcAssetList.items[i]?.content?.links?.image,
            chainName: chainName,
            collectionAddress,
            collectionNo,
            totalIPs: nftFund?.data?.totalImpactPoints,
            maxIPs: nftFund?.data?.maximumImpactPoints,
            name,
            chainImage,
          })
        }
      }

      return heldNfts
    } else {
      // const provider = ethers.getDefaultProvider(Number(chainId), {
      //   alchemy: ALCHEMY_API_KEY,
      // })

      const provider = new ethers.JsonRpcProvider(getRpcUrl(chainId))
      // Create contract instance

      const nftContract = new ethers.Contract(
        contractAddress,
        ERC721EnumerableABI,
        provider
      )

      // Get balance of NFTs for the wallet

      const balance = await nftContract.balanceOf(walletAddress)

      // Fetch all token IDs
      let tokenId
      let tokenURI
      let response
      let nftFund
      const nfts = []
      for (let i = 0; i < balance; i++) {
        tokenId = await nftContract.tokenOfOwnerByIndex(walletAddress, i)
        tokenURI = await nftContract.tokenURI(tokenId)
        response = await axios.get(tokenURI)

        nftFund = await axios.get(
          `${BASE_URL}/landscape/nftProgress?chainId=${chainId}&contractAddress=${contractAddress}&tokenId=${tokenId}`,
          getConfig(accessToken)
        )

        nfts.push({
          tokenId: Number(tokenId)?.toString(),
          imageURI: response?.data?.image,
          chainId,
          chainName,
          contractAddress,
          collectionNo,
          totalIPs: nftFund?.data?.totalImpactPoints,
          maxIPs: nftFund?.data?.maximumImpactPoints,
          name,
          chainImage,
        })
        // also add chainId, contractAddress, also add landscapes collection number to identify
      }

      return nfts
    }
  } catch (error) {
    if (error.message.includes("ENS name not configured")) {
      console.error("Invalid RPC URL")
    } else if (error.message.includes("call revert exception")) {
      console.error("Contract might not support ERC721Enumerable interface")
    } else {
      console.error("Error:", error.message)
    }
    return []
  }
}

//Input : group value as collection address , walletAddress (line 101) , collection No ,
