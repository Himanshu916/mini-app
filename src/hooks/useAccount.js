import { useSDK } from "@metamask/sdk-react"
import React, { useEffect, useState } from "react"

const useAccount = () => {
  const sdk = useSDK()
  const [account, setAccount] = useState()

  useEffect(
    function () {
      setAccount(sdk?.account)
    },
    [sdk?.account]
  )

  return { account }
}

export default useAccount
