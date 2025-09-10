import axios from "axios"
import { BASE_URL } from "../constants/apiPath"
import { getAccessToken } from "../helpers/getAccessToken"

const getConfig = (token) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

// GET /landscape/coreWiseFunding?nftCollectionNumber=<NFT collection number></NFT>

export const getGreenpillCounts = async (collectionNumber) => {
  try {
    const url = `${BASE_URL}/landscape/greenpillCount?nftCollectionNumber=${collectionNumber}`
    const accessToken = getAccessToken()
    const response = await axios.get(url, getConfig(accessToken))

    if (response?.status === 200) {
      return {
        data: response?.data,
      }
    }
  } catch (error) {
    return error
  }
}
// { count: greenPillCount, landscapeCollection: nftCollectionNumber }

export const getGreenpillCountsForAllLandscapes = async (collectionNumber) => {
  try {
    const url = `${BASE_URL}/landscape/greenpillCount?nftCollectionNumber=${collectionNumber}`
    const accessToken = getAccessToken()
    const response = await axios.get(url, getConfig(accessToken))

    if (response?.status === 200) {
      return {
        count: response?.data?.greenpillCount,
        landscapeCollection: collectionNumber,
      }
    }
  } catch (error) {
    return error
  }
}
