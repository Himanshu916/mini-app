import React, { useState } from "react"
import LinkRefIcon from "../../assets/icons/LinkRefIcon"
import { ArrowRightIcon, InfoIcon } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"

const RefferalLink = () => {
  const [copiedLink, setCopiedLink] = useState("")
  const { state, dispatch } = useAuth()
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(
      `https://greenpill.impactlandscapes.xyz/onboarding?uid=${text}`
    )
    setCopiedLink(text)
    setTimeout(() => setCopiedLink(""), 1500)
  }
  console.log(state.citizen._id, "implement refferal")
  return (
    <div
      onClick={() => copyToClipboard(state.citizen._id)}
      style={{ boxShadow: "none" }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow =
          "0 4px 17px 0 rgba(117,117,117,0.25)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
      className="flex items-center cursor-pointer bg-[#292929] py-3 px-5 rounded-md group transition-shadow duration-200 gap-5"
    >
      <div>
        <LinkRefIcon />
      </div>
      <div>
        <p className="text-lg font-semibold flex items-center gap-1 text-white">
          <span> Greenpill Referrals, Get Rewarded! </span>{" "}
          <ArrowRightIcon size={18} />
        </p>

        <p className="text-[#cfcfcf] mt-[.375rem]">
          Click here to copy and share your link, get 10% of every $5 Greenpill
          mint, 20% after 100 NFTs
        </p>
      </div>
      {copiedLink && (
        <div
          style={{
            boxShadow: "0 0 21.5px 0 rgba(0,255,174,0.25)",
          }}
          className="fixed z-[9999] rounded-sm py-2 px-3 bg-[#36544D] bottom-4 left-[50%] translate-x-[-50%] "
        >
          <div className="flex items-center gap-3">
            <InfoIcon color="#A7AFAD" size={16} />
            <span className="text-xs"> Referral link copied to clipboard!</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default RefferalLink
