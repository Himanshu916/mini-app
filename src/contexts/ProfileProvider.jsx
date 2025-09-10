import { createContext, useEffect, useReducer, useContext } from "react"

import { useLoadingState } from "../hooks/useLoader"

const initialState = []

function reducer(state, action) {
  switch (action.type) {
    case "ic/setImpactcertificates":
      return action.payload

    case "ic/mintImpactCertificate":
      const afterMint = state.map((ic) => {
        if (ic.id === action.payload) return { ...ic, status: "MINT_REQUESTED" }
        return ic
      })

      return afterMint

    case "ic/claimImpactCertificate":
      const afterClaim = state.map((ic) => {
        if (ic.id === action.payload.id) return { ...ic, ...action.payload }
        return ic
      })

      return afterClaim

    default:
      return state
  }
}

export const ProfileContext = createContext()

export const ProfileProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  // const { loading, startLoading, stopLoading } = useLoadingState();
  // const { loading: claiming, startLoading: startClaiming, stopLoading: stopClaiming } = useLoadingState();
  // const { loading: minting, startLoading: startMinting, stopLoading: stopMinting } = useLoadingState();
  // useEffect(function () {
  //     const fetchData = async () => {
  //         try {
  //             startLoading();
  //             const [response1] = await Promise.all([getAllCertificates()]);

  //             dispatch({ type: 'ic/setImpactcertificates', payload: response1 });
  //         } catch (error) {
  //             console.error(error, 'erroe');
  //         } finally {
  //             stopLoading();
  //         }
  //     };
  //     fetchData();
  // }, []);
  // const claimYourIc = async (id) => {
  //     try {
  //         startClaiming();
  //         const res = await claimIc(id);

  //         dispatch({ type: 'ic/claimImpactCertificate', payload: res });
  //     } catch (error) {
  //         console.log(error);
  //     } finally {
  //         stopClaiming();
  //     }
  // };

  // const mintYourIc = async (id, address) => {
  //     try {
  //         startMinting();
  //         const res = await mintIc(id, address);

  //         dispatch({ type: 'ic/mintImpactCertificate', payload: id });
  //     } catch (error) {
  //         console.log(error);
  //     } finally {
  //         stopMinting();
  //     }
  // };

  return (
    <ProfileContext.Provider
    //   value={{
    //     state,
    //     dispatch,
    //     claimYourIc,
    //     mintYourIc,
    //     loading,
    //     minting,
    //     claiming,
    //   }}
    >
      {children}
    </ProfileContext.Provider>
  )
}
