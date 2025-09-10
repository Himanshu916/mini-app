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

export const getExtraIPs = async () => {
  try {
    const url = `${BASE_URL}/citizen/unusedImpactPoints`
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

// /citizen/allocateImpactPoints

export const allocateIPs = async (payload) => {
  try {
    const url = `${BASE_URL}/landscape/allocateImpactPoints`
    const accessToken = getAccessToken()
    const response = await axios.post(url, payload, getConfig(accessToken))

    if (response?.status === 200) {
      return {
        data: response?.data?.allocatedImpactPoints,
      }
    }
  } catch (error) {
    return error
  }
}
