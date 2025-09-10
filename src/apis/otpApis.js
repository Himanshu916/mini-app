import axios from "axios"
import { BASE_URL } from "../constants/apiPath"
import { getAccessToken } from "../firebase"

const getConfig = (token) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}
export const sendOtpEmail = async (email) => {
  try {
    const url = `${BASE_URL}/auth/send-otp-email`

    const headers = {
      "Content-Type": "application/json", // Assuming you're sending JSON data
      // Add any other headers you need here
    }

    const payload = {
      emailID: email,
    }

    const response = await axios.post(url, payload, { headers: headers })

    if (response.status === 200 || response.status == 201) {
      return response.data
    } else {
      return response // or throw an error, depending on your error handling strategy
    }
  } catch (error) {
    return error
  }
}
export const verifyOtpEmail = async (email, otp, otpToken) => {
  try {
    const url = `${BASE_URL}/auth/verify-email-otp`

    const response = await axios.post(url, {
      email: email,
      otp: otp,
      otpToken: otpToken,
    })

    if (response.status === 200 || response.status == 201) {
      return response.data
    } else {
      return response // or throw an error, depending on your error handling strategy
    }
  } catch (error) {
    return error.data
  }
}
// PATCH /citizen/linkWallet2?walletAddress=<wallet_address> OR PATCH /citizen/linkWallet?evmAddress=<wallet_address>

export const linkEmailProfile = async (isEVM, wallet, token) => {
  try {
    const url = `${BASE_URL}/citizen/linkWallet2?${
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

// URL: `${BASE_URL}/citizen/withEmail2?email=${searchString}`

export const emailExistOrNot = async (email) => {
  try {
    const url = `${BASE_URL}/citizen/withEmail2?email=${email}`

    const response = await axios.get(url)

    if (response.status === 200 || response.status == 201) {
      return response
    }
  } catch (error) {
    return error
  }
}
