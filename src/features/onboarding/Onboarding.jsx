import { useEffect, useRef } from "react"
import AvatarImage from "../../components/AvatarImage"
import PillsMap from "../home/PillsMap"
import { useNavigate, useSearchParams } from "react-router-dom"
import logo from "../../assets/logoLandScapesWithName.png"
import defaultAvatar from "../../assets/images/defaultAvatar.png"
import onboardingBg from "../../assets/onboardingBg.png"
import monkeyCalling from "../../assets/gifs/monkeyCalling.gif"
import { SidebarProvider } from "@/components/ui/sidebar"
import Login from "../authentication/Login"
import { getLandscapes } from "../../apis/landscapes"
import { useGlobalState } from "../../contexts/GlobalState"
import { useHome } from "../../contexts/HomeContext"
import { useAuth } from "../../contexts/AuthContext"
import { useSDK } from "@metamask/sdk-react"
import useLoginAccount from "../../hooks/useLoginAccount"
import HeaderTab from "../../components/HeaderTab"
import CountdownTimer from "./CountdownTimer"
import ActivitiesYouCanFund from "../home/ActivitiesYouCanFund"
import { ArrowRightIcon } from "lucide-react"
const Onboarding = () => {
  const greenpillRef = useRef(null)
  const { state } = useHome()
  const { state: authState } = useAuth()
  const { state: landscapesState } = useGlobalState()
  const { account } = useLoginAccount()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const { isAuthenticated } = authState

  useEffect(function () {
    const fetchData = async () => {
      try {
        const response = await getLandscapes()
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  const handleClick = () => {
    greenpillRef.current.scrollIntoView({ behavior: "smooth" })
  }
  // useEffect(() => {
  //   if (uid) {
  //     localStorage.setItem("referrerUID", uid)
  //   }
  // }, [uid])
  // if (!isAuthenticated)

  return (
    <div className="">
      <HeaderTab />
      <SidebarProvider>
        <main className="overflow-hidden">
          <div className="min-w-[100vw]   overflow-y-auto ">
            <div
              style={{
                backgroundImage: `url(${onboardingBg})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
              className="bg-fixed h-[calc(100vh-4rem)]  mt-16 flex items-center justify-center"
            >
              <div className="w-[21.875rem] h-[32.375rem]">
                <img
                  className="w-full h-full cursor-pointer"
                  src={monkeyCalling}
                  alt="Onboarding GIF"
                  onClick={handleClick}
                />
              </div>
            </div>
            <div ref={greenpillRef} className="h-full ">
              <h1
                className=" mt-14    text-center px-4 md:px-0  text-textHeading"
                style={{
                  textShadow: "0px 0px 11.8px rgba(255, 255, 255, 0.59)",
                }}
              >
                <span className="text-[2rem] md:text-5xl font-semibold">
                  Green
                  <span className="font-pixer md:text-[3.5rem] font-normal ">
                    p
                  </span>
                  <span>ill</span>
                </span>
                &nbsp;&nbsp;
                <span className="text-[2rem] md:text-5xl font-semibold">
                  Lan
                  <span className="font-pixer md:text-[3.5rem] font-normal ">
                    d
                  </span>
                  sca
                  <span className="font-pixer md:text-[3.5rem] font-normal ">
                    p
                  </span>
                  es
                </span>
              </h1>
              <p className="text-sm text-center px-4 md:px-0 text-textSupportHeading mt-1">
                Moloch is opening portals of chaos across 10 Landscapes.Your
                mission : stop him.{" "}
                <a
                  href="https://www.impactlandscapes.xyz/about-greenpill"
                  target="_blank"
                  className="cursor-pointer"
                >
                  [
                  <span className="hover:underline underline-offset-4 ">
                    Read Lore
                  </span>
                  ]
                </a>
              </p>
            </div>

            <div
              className="bg-fixed    relative flex items-center justify-center" // Add padding to the top
            >
              <div className="w-full h-56  absolute z-[10] top-0 left-0 right-0 bg-pillsMap-upperGradient"></div>
              <div className="absolute   top-0 left-0 right-0 z-[50] pb-7 ">
                <div className="mt-10">
                  <p className="text-[#BFBFBF] text-2xl font-medium text-center mb-[.625rem] ">
                    Time left to Greenpill the World:
                  </p>
                  <CountdownTimer />
                </div>
              </div>
              {landscapesState?.loading ? (
                <p>loading</p>
              ) : landscapesState?.landscapes?.length === 0 ? (
                <p>no landscapes </p>
              ) : (
                <div className=" mt-32    overflow-auto ">
                  <PillsMap
                    landscapes={landscapesState?.landscapes}
                    toggleSidebarPanel={() => {}}
                    from="onboarding"
                  />
                </div>
              )}
              {/* <div className="absolute pb-44 pt-7 left-0 right-0 bottom-0 z-50 bg-pillsMap-downwardGradient"></div> */}
              <div className="w-full h-52 absolute z-[10] bottom-0 left-0 right-0 bg-pillsMap-downwardGradient"></div>
            </div>
          </div>
          <div className="w-[78rem] z-[20] relative  mx-auto  mb-[5.5rem] ">
            <div className=" w-full z-50">
              <div className={`  hidden md:block `}>
                <div className="-mt-24">
                  <ActivitiesYouCanFund />
                </div>
              </div>
              <a
                className=""
                href="https://www.impactlandscapes.xyz/about-greenpill"
                target="_blank"
              >
                <p className="font-instrument -mt-64  cursor-pointer w-fit text-xl pl-4 md:pl-0 md:text-5xl md:mt-[4.25rem] bg-clip-text bg-text-gradient text-transparent">
                  Learn about the story behind greenpill landscapes →
                </p>
              </a>
            </div>
          </div>
        </main>
      </SidebarProvider>
    </div>
  )
}

export default Onboarding
