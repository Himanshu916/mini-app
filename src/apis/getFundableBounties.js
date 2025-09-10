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

export const getFundableBounties = async (collectionNo) => {
  try {
    const url = `${BASE_URL}/landscape/fundableBountyCount?nftCollectionNumber=${collectionNo}`
    const accessToken = getAccessToken()
    const response = await axios.get(url, getConfig(accessToken))

    if (response.status === 200 || response.status == 201) {
      return {
        status: response.status,
        data: response?.data,
      }
    }
  } catch (error) {
    return error
  }
}
