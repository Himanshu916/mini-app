// GET /landscape/bounty?nftCollectionNumber=<NFT Collection Number>&core=<bounty core>&type=<bounty type></bounty>

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
export const getBounties = async (collectionNo, core, activity) => {
  try {
    const url = `${BASE_URL}/landscape/bounty?nftCollectionNumber=${collectionNo}&core=${core}&type=${activity}`
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

export const getTokens = async () => {
  try {
    const url = `${BASE_URL}/tokeninfo/usdStableCoins`
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
export const getTokens2 = async () => {
  try {
    const url = `${BASE_URL}/tokeninfo/usdStableCoins2`
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

export const getChains = async () => {
  try {
    const url = `${BASE_URL}/blockchain/withWallet`
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
export const getChains2 = async () => {
  try {
    const url = `${BASE_URL}/blockchain/plain`
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

// GET /landscape/leaderboard?nftCollectionNumber=<num>&evmAddress=<EVM address></EVM>
export const getUserSpecificStats = async (collectionNo, address) => {
  try {
    const url = `${BASE_URL}/landscape/leaderboard?nftCollectionNumber=${collectionNo}&evmAddress=${address}`
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

export const registerFunding = async (payload) => {
  try {
    const url = `${BASE_URL}/landscape/funding`
    const accessToken = getAccessToken()
    const response = await axios.post(url, payload, getConfig(accessToken))

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
