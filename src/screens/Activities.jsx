import React from "react"
import { Outlet } from "react-router-dom"
import HeaderTab from "../components/HeaderTab"

const Activities = () => {
  return (
    <div className="min-w-[100vw] h-[calc(90vh)]    mt-16 overflow-y-auto ">
      <HeaderTab />
      <Outlet context={{}} />
    </div>
  )
}

export default Activities
