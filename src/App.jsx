import { useState } from "react"
import reactLogo from "./assets/react.svg"
import viteLogo from "/vite.svg"
import "./App.css"
import { Button } from "@/components/ui/button"
import Bg from "./assets/bg.png"
import { LeaderboardTable } from "./LeaderboardTable"

function App() {
  const [count, setCount] = useState(0)

  const sidebarWidth = "16rem"

  return (
    <div>
      <div
        style={{
          backgroundImage: `url(${Bg})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "repeat",
        }}
        className="w-screen h-screen mx-0 border-0"
      >
        <h1>Landscapes</h1>
        <div className="w-[67%] mx-auto">
          <LeaderboardTable />
        </div>
      </div>
    </div>
  )
}

export default App
