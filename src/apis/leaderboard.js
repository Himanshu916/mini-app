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
export const getLeaderboard = async (
  collectionNo,
  accountDetails,
  page,
  entriesPerPage = 10,
  isUserEntry
) => {
  try {
    const queryString = isUserEntry
      ? `fetchUserEntry=${isUserEntry}${
          collectionNo ? `&nftCollectionNumber=${collectionNo}` : ""
        }`
      : `fetchUserEntry=${isUserEntry}&page=${page}&entriesPerPage=${entriesPerPage}${
          collectionNo ? `&nftCollectionNumber=${collectionNo}` : ""
        }`

    const url = `${BASE_URL}/landscape/greenpillLeaderboard?${queryString}`
    const accessToken = getAccessToken()
    const response = await axios.get(url, getConfig(accessToken))

    console.log("see response 1", response)

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

export const getFundingLeaderboard = async (
  collectionNo,
  accountDetails,
  page,
  entriesPerPage = 10,
  isUserEntry,
  msg
) => {
  try {
    const queryString = isUserEntry
      ? `fetchUserEntry=${isUserEntry}${
          collectionNo ? `&nftCollectionNumber=${collectionNo}` : ""
        }`
      : `fetchUserEntry=${isUserEntry}&page=${page}&entriesPerPage=${entriesPerPage}${
          collectionNo ? `&nftCollectionNumber=${collectionNo}` : ""
        }`
    console.log(queryString, "specific user")
    const url = `${BASE_URL}/citizen/fundingLeaderboard?${queryString}`
    const accessToken = getAccessToken()
    const response = await axios.get(url, getConfig(accessToken))

    console.log("see new funding response", msg, response)

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

export const getFundingEntryCount = async (collectionNo) => {
  try {
    const url = `${BASE_URL}/citizen/fundingLeaderboardEntryCount${
      collectionNo ? `?nftCollectionNumber=${collectionNo}` : ""
    }`
    const accessToken = getAccessToken()
    const response = await axios.get(url, getConfig(accessToken))

    console.log("see response 1", response)

    if (response.status === 200 || response.status == 201) {
      return {
        status: response.status,
        data: response?.data?.entryCount,
      }
    }
  } catch (error) {
    return error
  }
}

export const getEntryCount = async (collectionNo) => {
  try {
    const url = `${BASE_URL}/landscape/greenpillLeaderboardEntryCount${
      collectionNo ? `?nftCollectionNumber=${collectionNo}` : ""
    }`
    const accessToken = getAccessToken()
    const response = await axios.get(url, getConfig(accessToken))

    console.log("see response 1", response)

    if (response.status === 200 || response.status == 201) {
      return {
        status: response.status,
        data: response?.data?.entryCount,
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
