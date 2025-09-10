import { Outlet, useNavigate } from "react-router-dom"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "../AppSidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import logo from "../assets/logoLandScapesWithName.png"
import AvatarImage from "../components/AvatarImage"

import notUpdated from "../assets/images/notupdated.png"
import { onConnection } from "../apis/metamaskHelper"
import GradientBorder from "../components/GradientBorder"
import metamaskImage from "../assets/images/metamaskImage.png"
import menu from "../assets/images/menu.png"
import { useState } from "react"
import { useGlobalState } from "../contexts/GlobalState"
import NavigationModal from "../features/home/NavigationModal"
import Login from "../features/authentication/Login"
import { useAuth } from "../contexts/AuthContext"
import Modal from "../components/Modal"
import FAQModal from "../features/faqs/FAQModal"
import { FAQIcon } from "../assets/icons/NavigationIcons"
import FeedbackModal from "../components/FeedbackModal"
import { FeedbackIcon } from "../assets/icons/FeedbackIcon"
function BasicLayout({ children }) {
  const isMobile = useIsMobile()
  const { state } = useAuth()
  const { setShowAnimation } = useGlobalState()
  const [isOpen, setIsOpen] = useState(false)
  const toggleSidebarPanel = () => {
    setIsOpen(!isOpen)
  }

  const navigate = useNavigate()
  const handleConnectMetamask = async () => {
    // Connect to Metamask wallet
    // Assuming you have a function to connect to Metamask
    await onConnection()

    // Show animation
    setShowAnimation(true)
    navigate("home")
  }
  return (
    <div className="">
      <header
        className=" z-[999] h-10vh bg-headerBg p-2 border-b-2 border-[#363636]

] flex items-center justify-between fixed w-full top-0 shadow-sm "
      >
        <div className="flex items-center">
          <button
            className="md:hidden"
            onClick={toggleSidebarPanel}
            type="button"
          >
            <img className="w-9 h-9 " src={menu} alt="" />
          </button>
          <img
            onClick={() => navigate("/")}
            className="  md:block h-12 cursor-pointer"
            src={logo}
            alt=""
          />
        </div>

        <div className="flex items-center gap-6 ">
          <div className="hidden md:block">
            <Modal>
              <Modal.Button opens={"faq"}>
                <button className="   py-2 flex items-center   ">
                  <span className="mr-[2px]">FAQs</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.625 1.5C5.1075 1.5 2.25 4.3575 2.25 7.875C2.25 11.3925 5.1075 14.25 8.625 14.25H9V16.5C12.645 14.745 15 11.25 15 7.875C15 4.3575 12.1425 1.5 8.625 1.5ZM9.375 12.375H7.875V10.875H9.375V12.375ZM9.67475 8.78904C9.66725 8.79654 9.65975 8.81154 9.65225 8.82654C9.61475 8.88654 9.57725 8.94654 9.54725 9.00654C9.53225 9.02904 9.52475 9.05904 9.51725 9.08904C9.49475 9.14154 9.47225 9.19404 9.45725 9.24654C9.40475 9.40404 9.38225 9.56904 9.38225 9.75654H7.87475C7.87475 9.37404 7.93475 9.05154 8.02475 8.78154C8.02475 8.77404 8.02475 8.76654 8.03225 8.75904C8.03975 8.72904 8.06225 8.71404 8.06975 8.68404C8.11475 8.56404 8.16725 8.45904 8.23475 8.35404C8.25725 8.31654 8.28725 8.27904 8.30975 8.24154C8.33225 8.21154 8.34725 8.17404 8.36975 8.15154L8.37725 8.15904C9.00725 7.33404 10.0348 7.07904 10.1173 6.14904C10.1848 5.41404 9.65975 4.70154 8.93975 4.55154C8.15975 4.38654 7.45475 4.84404 7.21475 5.51154C7.10975 5.78154 6.86225 5.99904 6.55475 5.99904H6.40475C5.95475 5.99904 5.62475 5.55654 5.75225 5.12154C6.16475 3.75654 7.52975 2.80404 9.07475 3.02904C10.3423 3.21654 11.3548 4.25904 11.5723 5.52654C11.9023 7.35654 10.3498 7.79904 9.67475 8.78904Z"
                      fill="#B7B7B7"
                    />
                  </svg>
                </button>
              </Modal.Button>
              <Modal.Window name={"faq"}>
                <FAQModal />
              </Modal.Window>
            </Modal>
          </div>

          {/* <Modal>
            <Modal.Button
              className="flex gap-2 cursor-pointer items-center"
              opens={"feedback"}
            >
              <FeedbackIcon />
            </Modal.Button>
            <Modal.Window name={"feedback"}>
              <FeedbackModal />
            </Modal.Window>
          </Modal> */}

          <Login />

          <div className="flex items-center gap-7  py-2">
            <AvatarImage
              className="cursor-pointer"
              onClick={() => {
                navigate("/profile")
              }}
              w="w-8"
              h="h-8"
              url={state?.citizen?.profileImage || notUpdated}
            />
          </div>
        </div>
      </header>
      <SidebarProvider>
        {/* {isMobile && (
          <>
            <AppSidebar />
            <SidebarTrigger />
          </>
        )} */}
        <main className="overflow-hidden">
          {children}

          <Outlet />
        </main>
      </SidebarProvider>
      <NavigationModal
        isOpen={isOpen}
        toggleSidebarPanel={toggleSidebarPanel}
      />
    </div>
  )
}

export default BasicLayout
