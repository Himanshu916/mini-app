import { useNavigate } from "react-router-dom"
import GradientBorder from "./GradientBorder"
import monkeyIllustration from "../assets/images/monkeyIllustration.png"

const EmptyArray = () => {
  const navigate = useNavigate()
  return (
    <div className="flex w-full relative items-center justify-center">
      <img
        className="w-48 h-72 cursor-pointer"
        src={monkeyIllustration}
        alt="Onboarding GIF"
      />

      <div className="absolute left-[50%] translate-x-[-50%] bottom-0">
        <GradientBorder
          radiusBorder={".60rem"}
          color2={"#506C6600"}
          color1={"#699F84"}
          bg="bg-[#1E3D36]"
          // shadow="shadow-button-shadow"
        >
          <button
            onClick={() => {
              navigate("/mintNew")
            }}
            className=" px-4 py-2 flex items-center gap-2  "
          >
            <span>Mint a New NFT</span>
          </button>
        </GradientBorder>
      </div>
    </div>
  )
}

export default EmptyArray
