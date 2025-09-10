import { useState } from "react"

export const useLoadingState = () => {
  const [loading, setLoading] = useState(false)

  const startLoading = () => {
    setLoading(true)
  }

  const stopLoading = () => {
    setLoading(false)
  }

  return { loading, startLoading, stopLoading }
}
