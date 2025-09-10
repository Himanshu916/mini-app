import axios from "axios"
import { BASE_URL } from "../constants/apiPath"
import { getAccessToken } from "./getAccessToken"

const getConfig = (token) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

export const uploader = async (payload) => {
  const payloadnew = new FormData()
  payloadnew.append("image", payload)
  try {
    const url = `${BASE_URL}/microtaskdata/upload2`

    const accessToken = getAccessToken()
    const response = await axios.post(url, payloadnew, getConfig(accessToken))

    return response.data
  } catch (error) {
    console.log(error)
  }
}
