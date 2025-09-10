// GET /landscape?nftCollectionNumber=<collection number></collection>

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
export const getLandscapes = async (collectionNo) => {
  try {
    const url = `${BASE_URL}/landscape${
      collectionNo ? `?nftCollectionNumber=${collectionNo}` : ""
    }`

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

// GET /landscape/coreWiseFunding?nftCollectionNumber=<NFT collection number></NFT>

export const getCoreWiseFundingInLandscape = async (collectionNo) => {
  try {
    const url = `${BASE_URL}/landscape/coreWiseFunding${
      collectionNo ? `?nftCollectionNumber=${collectionNo}` : ""
    }`

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

export const getImpactPoints = async () => {
  try {
    const url = `${BASE_URL}/citizen/impactPoints/withWallet`

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
