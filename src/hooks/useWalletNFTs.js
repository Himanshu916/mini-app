import React from "react"
import { getWalletNFTs } from "../blockchain/homepage/nftsHoldByWalletAddress"

const useWalletNFTs = (contractAddress, walletAddress, chainId) => {
  useEffect(function () {
    const fetchData = async () => {
      const response = await getWalletNFTs()
    }

    fetchData()
  }, [])
  return <div></div>
}

export default useWalletNFTs
