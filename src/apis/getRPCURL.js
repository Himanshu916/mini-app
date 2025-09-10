import { evmRPCURL } from "../constants/apiPath"

export const getRpcUrl = (chainId) => {
  const idAndUrls = evmRPCURL.split("~")

  for (let i = 0; i < idAndUrls?.length; ++i) {
    const [id, url] = idAndUrls[i].split(",")

    if (chainId.toString() === id) {
      return url
    }
  }

  return null
}
