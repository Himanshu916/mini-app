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

export const fundingActivityWithoutNFT = async (payload) => {
  try {
    const url = `${BASE_URL}/landscape/funding2`
    const accessToken = getAccessToken()
    const response = await axios.post(url, payload, getConfig(accessToken))

    if (response?.data?.success) {
      return {
        success: response?.data?.success,
      }
    }
  } catch (error) {
    return error
  }
}
