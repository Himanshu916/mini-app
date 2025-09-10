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
export const createProfile = async ({
  wallet,
  timestamp,
  signature,
  isEVM,
}) => {
  try {
    const url = `${BASE_URL}/citizen/withWallet?walletAddress=${wallet}&loginTimestamp=${timestamp}&signature=${signature}&isEvmWallet=${isEVM}`

    const response = await axios.get(url)

    if (!response?.data)
      return {
        status: response.status,
        userInfo: null,
      }

    if (response.status === 200 || response.status == 201) {
      return {
        status: response.status,
        userInfo: {
          token: response?.data?.token,
          citizen: response?.data?.citizen,
        },
      }
    }
  } catch (error) {
    return error
  }
}

export const verifyProfile = async ({
  wallet,
  timestamp,
  signature,
  isEVM,
}) => {
  try {
    const url = `${BASE_URL}/citizen/withWallet2?walletAddress=${wallet}&loginTimestamp=${timestamp}&signature=${signature}&isEvmWallet=${isEVM}`

    const response = await axios.get(url)

    if (!response?.data)
      return {
        status: response.status,
        userInfo: null,
      }

    if (response.status === 200 || response.status == 201) {
      return {
        status: response.status,
        userInfo: {
          token: response?.data?.token,
          citizen: response?.data?.citizen,
        },
      }
    }
  } catch (error) {
    return error
  }
}

export const linkProfile = async (isEVM, wallet, token) => {
  try {
    const url = `${BASE_URL}/citizen/linkWallet?${
      isEVM ? `evmAddress=${wallet}` : `walletAddress=${wallet}`
    }`

    const response = await axios.patch(url, {}, getConfig(token))

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

export const linkProfileFromInside = async (isEVM, wallet) => {
  try {
    const url = `${BASE_URL}/citizen/linkWallet?${
      isEVM ? `evmAddress=${wallet}` : `walletAddress=${wallet}`
    }`
    const accessToken = getAccessToken()
    const response = await axios.patch(url, {}, getConfig(accessToken))

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
