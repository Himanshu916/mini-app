// PUT /citizen/withEvmWallet
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

export const updateWallet = async (evmAddress, walletAddress) => {
  try {
    const url = `${BASE_URL}/citizen?${
      evmAddress ? `evmAddress=${evmAddress}` : `walletAddress=${walletAddress}`
    }`

    const accessToken = await getAccessToken()

    const response = await axios.patch(url, {}, getConfig(accessToken))

    if (response.status === 201 || response.status === 200) return response.data
  } catch (error) {
    return error
    // toast.error('Sorry unable to create your organization.');
  }
}

// GET /landscape/leaderboard?nftCollectionNumber=<num>&evmAddress=<EVM address></EVM>
export const updateProfile = async (payload) => {
  try {
    const url = `${BASE_URL}/citizen/withWallet`
    const accessToken = getAccessToken()
    const response = await axios.put(url, payload, getConfig(accessToken))

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
