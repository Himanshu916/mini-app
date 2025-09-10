import { useNavigate } from "react-router-dom"
import logo from "../../assets/logoLandScapesWithName.png"
import { FAQIcon, LeaderboardIcon } from "../../assets/icons/NavigationIcons"

import notUpdated from "../../assets/images/notupdated.png"
import AvatarImage from "../../components/AvatarImage"
import Modal from "../../components/Modal"
import FAQModal from "../faqs/FAQModal"
import { useAuth } from "../../contexts/AuthContext"
const NavigationModal = ({ toggleSidebarPanel, isOpen }) => {
  const navigate = useNavigate()
  const { state } = useAuth()
  return (
    <>
      {isOpen && (
        <div
          onClick={toggleSidebarPanel}
          className="fixed inset-0  bg-black opacity-75 z-[9999]"
        ></div>
      )}

      <div
        style={{
          background:
            "radial-gradient(222.11% 65.82% at 50% 100%, rgba(50, 95, 86, 0.33) 0%, rgba(50, 95, 86, 0.00) 100%), #161616",
        }}
        className={`fixed z-[99999] backdrop-blur-lg   transition-transform duration-300 
        top-0
    w-[80%]
    left-0
          bottom-0 lg:top-0 
          transform 
          ${isOpen ? "-translate-x-0" : "-translate-x-full"}
        `}
      >
        <button
          className=" bg-[#393939] absolute z-[9999] top-4 right-4  rounded-full  "
          onClick={() => {
            toggleSidebarPanel()
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
          >
            <circle cx="15.5894" cy="15.5894" r="15.5894" fill="#353535" />
            <path
              d="M22.6211 9.22656L9.91269 21.935"
              stroke="#9B9B9B"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M21.8711 21.9336L9.16269 9.22519"
              stroke="#9B9B9B"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <div className="p-5">
          <img
            onClick={() => {
              toggleSidebarPanel()
              navigate("/")
            }}
            className="  md:block h-12 cursor-pointer"
            src={logo}
            alt=""
          />
        </div>
        <div className="px-5">
          <ul className="flex flex-col gap-4 p-3">
            <div className="flex items-center gap-7 px-4 py-2"></div>
            <li
              onClick={() => {
                toggleSidebarPanel()
                navigate("/profile")
              }}
              className="text-white text-2xl flex items-center gap-3 font-medium"
            >
              <AvatarImage
                className="cursor-pointer"
                w="w-8"
                h="h-8"
                url={state?.citizen?.profileImage || notUpdated}
              />

              <span> Profile</span>
            </li>
            <li
              onClick={() => {
                if (isOpen) toggleSidebarPanel()
              }}
              className="text-white flex items-center gap-3 text-2xl font-medium"
            >
              <FAQIcon />

              <Modal>
                <Modal.Button opens={"faq"}>
                  <button className=" px-4  py-2 flex items-center gap-2  ">
                    <span>FAQs</span>
                  </button>
                </Modal.Button>
                <Modal.Window name={"faq"}>
                  <FAQModal />
                </Modal.Window>
              </Modal>
            </li>

            <li
              onClick={() => {
                toggleSidebarPanel()
                navigate("/profile/leaderboard")
              }}
              className="text-white flex items-center gap-3 text-2xl font-medium"
            >
              <LeaderboardIcon />
              <span>Leaderboard</span>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default NavigationModal
