import { Outlet } from "react-router-dom"
import { useState } from "react"

import { useLoadingState } from "../hooks/useLoader"

function User() {
  //   const { state } = useContext(AuthContext)
  const { loading, startLoading, stopLoading } = useLoadingState()
  const [yourImpacts, setYourImpacts] = useState([])

  const [coreWiseDistribution, setCoreWiseDistribution] = useState([])
  const [selectedPowers, setSelectedPowers] = useState([])
  //   const { user } = state
  const userProfile = []
  // const { impactPoints, impactCertificatesIssued } = userProfile;
  const impactPoints = yourImpacts[0]?.impactPoints

  const impactCertificatesIssued = yourImpacts[0]?.impactCertificatesIssued

  // useEffect(function () {
  //   const fetchData = async () => {
  //     try {
  //       startLoading()
  //       const [response1, response2] = await Promise.all([
  //         getYourImpacts(userProfile?.uid),
  //         getCoreWiseDistribution(),
  //       ])
  //       setYourImpacts(response1)
  //       setCoreWiseDistribution(response2)

  //       setSelectedPowers(response1[0]?.primarySkills)
  //     } catch (error) {
  //       console.error(error, "erroe")
  //     } finally {
  //       stopLoading()
  //     }
  //   }
  //   fetchData()
  // }, [])
  return (
    <div className="min-w-[100vw] min-h-[90vh] overflow-hidden  mt-16 ">
      <Outlet
        context={
          {
            //   loading,
            //   yourImpacts,
            //   myOrgs,
            //   coreWiseDistribution,
            //   userProfile,
            //   impactCertificatesIssued,
            //   impactPoints,
            //   selectedPowers,
            //   setSelectedPowers,
          }
        }
      />
    </div>
  )
}

export default User
