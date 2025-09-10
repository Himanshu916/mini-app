import { useEffect, useRef, useState } from "react"
import GradientBorder from "../../components/GradientBorder"
import { sharingSocials } from "../../constants/sharingSocials"

// const SHARE_URL = 'https://www.appstore.com';
// const SHARE_TEXT = 'Check out my achievement for leading climate action on Impact Foundry!';
// const SHARE_IMAGE = 'https://yourdomain.com/path-to-share-image.png'; // Replace with actual image link

const handleShare = (label, shareId) => {
  const SHARE_URL = encodeURIComponent(
    `Join:https://greenpill.impactlandscapes.xyz/activities/${shareId}`
  )
  const SHARE_TEXT = encodeURIComponent(
    `Heyy I think you can support Greenpill Network’s mission, help them reach their funding goal !`
  )
  const LINE_BREAK = "%0A"
  let shareLink = ""

  switch (label.toLowerCase()) {
    case "whatsapp":
      shareLink = `https://web.whatsapp.com/send?text=${SHARE_TEXT}${LINE_BREAK}${LINE_BREAK}%20${SHARE_URL}`
      break
    case "telegram":
      shareLink = `https://t.me/share/url?url=${SHARE_URL}&text=${SHARE_TEXT}`
      break
    case "facebook":
      shareLink = `https://www.facebook.com/sharer/sharer.php?u=${SHARE_URL}`
      break
    case "twitter":
      shareLink = `https://twitter.com/intent/tweet?url=${SHARE_URL}&text=${SHARE_TEXT}`
      break
    case "reddit":
      shareLink = `https://www.reddit.com/submit?url=${SHARE_URL}&title=${SHARE_TEXT}`
      break
    case "messages":
      shareLink = `sms:&body=${SHARE_TEXT}%20${SHARE_URL}`
      break
    case "copy link":
      navigator.clipboard.writeText(decodeURIComponent(SHARE_URL))
      alert("Link copied to clipboard!")
      return
    case "discord":
      alert("Please paste the link manually in Discord.")
      return
    case "snapchat":
    case "instagram":
    case "stories":
      alert(
        `${label} does not support direct web sharing. Please share manually.`
      )
      return
    default:
      return
  }

  window.open(shareLink, "_blank")
}

// OG-enabled share URL: https://app.impactfoundry.xyz/greenpill/share/1234
// Sample hosted image: https://cdn.impactfoundry.xyz/images/funding_preview.png

const Share = ({ isText = false, bountyId }) => {
  const [open, setOpen] = useState(false)
  const myRef = useRef()
  useEffect(() => {
    function handleClick(e) {
      if (myRef.current && !myRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("click", handleClick, true)
    return () => document.removeEventListener("click", handleClick, true)
  }, [])

  return (
    <div className="" ref={myRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        type="button"
        className={` px-4 py-2 flex items-center gap-2 w-full  justify-center`}
      >
        {isText && (
          <span className="text-sm font-medium">Share Achievment</span>
        )}
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="35"
            viewBox="0 0 30 35"
            fill="none"
          >
            <path
              d="M25 24.7514C23.7333 24.7514 22.6 25.2788 21.7333 26.105L9.85 18.8096C9.93333 18.4053 10 18.001 10 17.5791C10 17.1572 9.93333 16.7529 9.85 16.3486L21.6 9.12356C22.5 10.0025 23.6833 10.5475 25 10.5475C26.3261 10.5475 27.5979 9.99184 28.5355 9.00282C29.4732 8.01381 30 6.67241 30 5.27373C30 3.87505 29.4732 2.53366 28.5355 1.54464C27.5979 0.555624 26.3261 0 25 0C23.6739 0 22.4021 0.555624 21.4645 1.54464C20.5268 2.53366 20 3.87505 20 5.27373C20 5.69563 20.0667 6.09995 20.15 6.50427L8.4 13.7293C7.5 12.8503 6.31667 12.3054 5 12.3054C3.67392 12.3054 2.40215 12.861 1.46447 13.85C0.526784 14.839 0 16.1804 0 17.5791C0 18.9778 0.526784 20.3192 1.46447 21.3082C2.40215 22.2972 3.67392 22.8528 5 22.8528C6.31667 22.8528 7.5 22.3079 8.4 21.4289L20.2667 28.7243C20.1833 29.0934 20.1333 29.4802 20.1333 29.8845C20.1333 32.7147 22.3167 35 25 35C27.6833 35 29.8667 32.7147 29.8667 29.8845C29.8667 28.5231 29.3539 27.2175 28.4413 26.2548C27.5286 25.2922 26.2907 24.7514 25 24.7514Z"
              fill="#A6A6A6"
            />
          </svg>
        </span>
      </button>

      <div
        className={`z-[2000] w-full ${
          open ? "absolute" : "hidden"
        } bg-[#60606070] backdrop-blur-[62.5px] overflow-auto main rounded-lg rounded-t-none shadow px-4 py-3`}
      >
        <div className="grid grid-cols-7 gap-5">
          {sharingSocials?.map((social) => {
            return (
              <div
                onClick={() => handleShare(social.label, bountyId)}
                className="flex flex-col items-center cursor-pointer "
                key={social?.label}
              >
                <img
                  className="w-11 h-11   "
                  src={social?.image}
                  alt={social?.label}
                />
                <span className="text-white text-[.65rem]">
                  {social?.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Share
