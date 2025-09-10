import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.jsx"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar.jsx"
import RouteNav from "./routes/Routes.jsx"
// import { MetaMaskProvider } from "@metamask/sdk-react" // Uncomment and wrap below if you need EVM wallet support
import { GlobalStateProvider } from "./contexts/GlobalState.jsx"
import { AuthProvider } from "./contexts/AuthContext.jsx"
import { HomeProvider } from "./contexts/HomeContext.jsx"
import { Toaster } from "sonner"

import "@solana/wallet-adapter-react-ui/styles.css"
import { Buffer } from "buffer"
import process from "process"

import { wagmiConfig } from "../wagmiConfig"

window.global = window
window.Buffer = Buffer
window.process = process
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Toaster
      toastOptions={{
        className:
          "p-3 bg-[#fff] text-black border border-[#A1D2FF] shadow-tooltipShadow font-medium text-xs",
      }}
      position="bottom-center"
    />
    <GlobalStateProvider>
      <RouteNav />
    </GlobalStateProvider>
  </StrictMode>
)
