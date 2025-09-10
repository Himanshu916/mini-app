import { ethers } from "ethers"
import axios from "axios"
import { RPC_ENDPOINT } from "../../constants/apiPath"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api"
import { publicKey } from "@metaplex-foundation/umi"
import { getRpcUrl } from "../../apis/getRPCURL"

// ABI for ERC721Enumerable interface
const contractABI = [
  "function totalSupply() public view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)",
]

export const fetchGreenpillCount = async (
  chainId,
  contractAddress,
  greenPillURIs,
  nftCollectionNumber,
  chainName,
  collectionAddress
) => {
  try {
    if (chainName === "solana") {
      // fetch the below two details from landscape

      const umi = createUmi(RPC_ENDPOINT)
      umi.use(dasApi())

      const rpcAssetList = await umi.rpc.getAssetsByGroup({
        groupKey: "collection",
        groupValue: collectionAddress,
      })

      let greenPillCount = 0
      for (let i = 0; i < rpcAssetList.items.length; ++i) {
        if (greenPillURIs?.includes(rpcAssetList.items[i].content.json_uri)) {
          greenPillCount += 1
        }
      }

      return { count: greenPillCount, landscapeCollection: nftCollectionNumber }
    } else {
      const provider = new ethers.JsonRpcProvider(getRpcUrl(chainId))

      // Create contract instance
      const nftContract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      )

      const nftCount = Number(await nftContract.totalSupply())

      let uri
      let greenPillCount = 0
      for (let i = 0; i < nftCount; ++i) {
        uri = await nftContract.tokenURI(i)
        if (greenPillURIs.includes(uri)) {
          greenPillCount += 1
        }
      }

      return { count: greenPillCount, landscapeCollection: nftCollectionNumber }
    }
  } catch (error) {
    console.log("error while fetching greenpill nft count", error)
  }
}

const contractABIWithColor = [
  "function totalSupply() public view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
]

/*
    nftContracts: { chainId, contractAddress }[]
    nftURIs: string[]
    nftsURIs[0] - decayed red
    nftsURIs[1] - red
    nftsURIs[2] - decayed orange
    nftsURIs[3] - orange
    nftsURIs[4] - green
*/
export const fetchGreenpillCountWithColor = async (
  walletAddress,
  solanaWalletAddress,
  nftContracts,
  redStateURIs,
  orangeStateURIs,
  greenStateURIs
) => {
  try {
    let greenNftCount = 0
    let orangeNftCount = 0
    let redNftCount = 0
    const obj = {}
    for (let i = 0; i < nftContracts.length; ++i) {
      const collectionNumber = nftContracts[i]?.collectionNumber
      if (!collectionNumber) continue

      if (!obj[collectionNumber]) {
        obj[collectionNumber] = {
          redNftCount: 0,
          orangeNftCount: 0,
          greenNftCount: 0,
        }
      }
      if (nftContracts[i]?.chainName === "solana") {
        if (!solanaWalletAddress) {
          continue
        }

        const umi = createUmi(RPC_ENDPOINT)
        umi.use(dasApi())

        const owner = publicKey(solanaWalletAddress)

        const rpcAssetList = await umi.rpc.getAssetsByGroup({
          groupKey: "collection",
          groupValue: nftContracts[i].collectionAddress,
        })

        for (let i = 0; i < rpcAssetList.items.length; ++i) {
          if (rpcAssetList.items[i].ownership.owner === owner) {
            const metaDataURI = rpcAssetList.items[i].content.json_uri
            if (redStateURIs.includes(metaDataURI)) {
              redNftCount += 1

              obj[collectionNumber].redNftCount++
            } else if (orangeStateURIs.includes(metaDataURI)) {
              orangeNftCount += 1
              obj[collectionNumber].orangeNftCount++
            } else if (greenStateURIs.includes(metaDataURI)) {
              greenNftCount += 1
              obj[collectionNumber].greenNftCount++
            }
          }
        }
      } else {
        if (!walletAddress) {
          continue
        }

        // const provider = ethers.getDefaultProvider(
        //   Number(nftContracts[i].chainId),
        //   {
        //     alchemy: ALCHEMY_API_KEY,
        //   }
        // )

        const provider = new ethers.JsonRpcProvider(
          getRpcUrl(nftContracts[i].chainId)
        )

        // Create contract instance
        const nftContract = new ethers.Contract(
          nftContracts[i].contractAddress,
          contractABIWithColor,
          provider
        )

        // Get balance of NFTs for the wallet
        const balance = Number(await nftContract.balanceOf(walletAddress))

        // Fetch all token IDs
        let tokenId
        let tokenURI

        for (let i = 0; i < balance; i++) {
          tokenId = await nftContract.tokenOfOwnerByIndex(walletAddress, i)
          tokenURI = await nftContract.tokenURI(tokenId)

          if (redStateURIs.includes(tokenURI)) {
            redNftCount += 1
            obj[collectionNumber].redNftCount++
          } else if (orangeStateURIs.includes(tokenURI)) {
            orangeNftCount += 1
            obj[collectionNumber].orangeNftCount++
          } else if (greenStateURIs.includes(tokenURI)) {
            greenNftCount += 1
            obj[collectionNumber].greenNftCount++
          }
        }
      }
    }
    return { greenNftCount, orangeNftCount, redNftCount, obj }
  } catch (error) {
    console.log("solana count else t catch", error)
  }
}
