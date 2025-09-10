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

export const getExploreActivities = async () => {
  try {
    const url = `${BASE_URL}/landscape/fundableBounties`
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

export const getExploreActivity = async (bountyId) => {
  try {
    const url = `${BASE_URL}/landscape/fundableBounty?bountyId=${bountyId}`
    const accessToken = getAccessToken()
    const response = await axios.get(url)

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

// /landscape/fundableBounty?bountyId=<bounty_id></bounty_id>
