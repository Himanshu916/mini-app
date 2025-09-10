import { useEffect } from "react"

import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useSDK } from "@metamask/sdk-react"

function ProtectedRoute({ children }) {
  const navigate = useNavigate()
  const { account } = useSDK()

  const { state } = useAuth()
  const { isAuthenticated } = state

  useEffect(
    function () {
      if (!isAuthenticated) navigate("/onboarding")
    },
    [isAuthenticated, navigate]
  )

  if (isAuthenticated) return children
}

export default ProtectedRoute
