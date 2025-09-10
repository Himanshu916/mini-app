import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react"
import { getLandscapes } from "../apis/landscapes"
import { useLoadingState } from "../hooks/useLoader"

const GlobalStateContext = createContext()
const initialState = {
  landscapes: [],
}

function reducer(state, action) {
  switch (action.type) {
    case "global/setLandscapes":
      return {
        ...state,
        landscapes: action.payload?.landscapes,
      }

    default:
      return state
  }
}
export const GlobalStateProvider = function ({ children }) {
  const [showAnimation, setShowAnimation] = useState(false)
  const [state, dispatch] = useReducer(reducer, initialState)
  const { loading, startLoading, stopLoading } = useLoadingState()

  useEffect(function () {
    const fetchData = async () => {
      try {
        startLoading()
        const response1 = await getLandscapes()

        dispatch({
          type: "global/setLandscapes",
          payload: {
            landscapes: response1?.data,
          },
        })
      } catch (error) {
        console.error(error, "erroe")
      } finally {
        stopLoading()
      }
    }
    fetchData()
  }, [])
  return (
    <GlobalStateContext.Provider
      value={{
        showAnimation,
        setShowAnimation,
        firstTime: true,
        state,
        dispatch,
        loading,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  )
}

export const useGlobalState = () => {
  return useContext(GlobalStateContext)
}
