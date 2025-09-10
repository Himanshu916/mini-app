import React from "react"
import Login from "../features/authentication/Login"
import logo from "../assets/logoLandScapesWithName.png"
import { useNavigate } from "react-router-dom"
const HeaderTab = () => {
  const navigate = useNavigate()
  return (
    <header
      className=" z-[999] h-10vh bg-headerBg p-2 border-b-2 border-[#363636]
    
    ] flex items-center justify-between fixed w-full top-0 shadow-sm "
    >
      <img
        onClick={() => navigate("/")}
        className=" h-12 cursor-pointer"
        src={logo}
        alt=""
      />
      <div className="flex items-center ">
        <Login />
      </div>
    </header>
  )
}

export default HeaderTab
