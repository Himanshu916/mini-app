import {
  RouterProvider,
  createBrowserRouter,
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom"

import BasicLayout from "../basiclayout"
import Leaderboard from "../screens/Leaderboard"
import { ProfileProvider } from "../contexts/ProfileProvider"
import UserProfile from "../features/profile/UserProfile"
import User from "../screens/User"
import MintNFT from "../features/NFTs/MintNFT"
import FundExistingNFTs from "../features/NFTs/FundExistingNFTs"
import PrecisionFunding from "../features/NFTs/PrecisionFunding"
import FundExistingHome from "../features/NFTs/FundExistingHome"
import Home from "../features/home/Home"
import Onboarding from "../features/onboarding/Onboarding"
import Animation from "../features/onboarding/Animation"
import ProtectedRoute from "./ProtectedRoute"
import { HomeProvider } from "../contexts/HomeContext"
import EditProfile from "../features/profile/EditProfile"
import FullyFunded from "../features/NFTs/FullyFunded"
import { AuthProvider } from "../contexts/AuthContext"
import Activities from "../screens/Activities"
import ExploreActivities from "../screens/ExploreActivities"
import IndividualActivity from "../screens/IndividualActivity"
import PublicMinting from "../features/miner/PublicMinting"
import PhantomRedirect from "../features/miner/PhantomRedirect"
import { useEffect } from "react"
import { useIsMobile } from "../hooks/isMobile"
import { isMobile } from "../helpers/isMobile"
import SuccessfulMint from "../features/NFTs/SuccessfulMint"
import { sdk } from "@farcaster/miniapp-sdk"
import { wagmiConfig } from "../../wagmiConfig"
import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
const queryClient = new QueryClient()
function ProvidersWrapper() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams() // Use useSearchParams to access query parameters
  const uidFromReferral = searchParams.get("uid")

  // Check if we are on the onboarding page
  const isOnboardingPage = location.pathname === "/onboarding"

  // Check if the UID is already in localStorage
  const storedUid = localStorage.getItem("referrerUID")

  // Check if this is the first page visit in the session (using sessionStorage)
  const isFirstPageVisit = sessionStorage.getItem("isFirstPageVisit") === null

  useEffect(() => {
    // Mark the first page as visited
    console.log(isFirstPageVisit, storedUid, "dekho referrer")

    if (isFirstPageVisit) {
      sessionStorage.setItem("isFirstPageVisit", "true")

      // If the user is not on the onboarding page, clear the `uid` from localStorage
      if (!isOnboardingPage) {
        localStorage.removeItem("referrerUID")
      }
    }

    // If on the onboarding page, store the `uid` from the referral link if present
    if (isOnboardingPage && uidFromReferral && !storedUid) {
      localStorage.setItem("referrerUID", uidFromReferral)
    }
  }, [
    isFirstPageVisit,
    isOnboardingPage,
    uidFromReferral,
    storedUid,
    location.pathname,
  ])

  useEffect(() => {
    // Notify Farcaster when the app is ready
    const initializeApp = async () => {
      try {
        await sdk.actions.ready() // Tells Farcaster the app is ready
        console.log("App is ready to be embedded in Farcaster!")
      } catch (error) {
        console.error("Error initializing Farcaster SDK:", error)
      }
    }

    initializeApp()
  }, [])
  useEffect(() => {
    // Inject Hotjar script only once
    const hotjarScript = document.createElement("script")
    hotjarScript.innerHTML = `
      (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:6440081,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
      })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    `
    document.head.appendChild(hotjarScript)
  }, [])

  useEffect(() => {
    // Tell Hotjar about route change
    if (window.hj) {
      window.hj("stateChange", location.pathname)
    }
  }, [location])

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <WalletModalProvider>
          <AuthProvider>
            <HomeProvider>
              <Outlet />
            </HomeProvider>
          </AuthProvider>
        </WalletModalProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProvidersWrapper />, // wrap everything in Auth + Home context
    children: [
      {
        path: "/",
        element: <PublicMinting />,
      },
      {
        path: "/phantom/redirect",
        element: <PhantomRedirect />,
      },
      {
        path: "/minted",
        element: <SuccessfulMint />,
      },
    ],
  },
])

function RouteNav() {
  return <RouterProvider router={router} />
}

export default RouteNav
