import GradientBorder from "../../components/GradientBorder"

const LinkWalletModal = ({ onYes, onCancel, text }) => {
  return (
    <div>
      <div className="flex flex-col items-center">
        <p className="text-[#fff] text-2xl font-bold">Link Wallet</p>
        <p className="text-[#B2B2B2] text-sm  mt-2">
          This wallet is not linked with your profile. Would you like to link
          this wallet to your profile ?
        </p>
      </div>
      <div className="mt-6">
        <div className="flex justify-center gap-4">
          <GradientBorder
            radiusBorder={".25rem"}
            color2={"rgba(80, 108, 102, 0)"}
            color1={"rgba(105, 159, 132, 1)"}
            bg="bg-[#1E3D36]"
            shadow="shadow-button-shadow"
          >
            <button
              className="px-4 py-2 flex items-center gap-2   justify-between"
              onClick={onYes}
            >
              {text}
            </button>
          </GradientBorder>
          <GradientBorder
            radiusBorder=".25rem"
            color1="rgba(140, 140, 140, 1)"
            color2="rgba(90, 90, 90, 0)"
            bg="bg-[#2A2A2A]"
          >
            <button
              className="px-4 py-2 flex items-center gap-2   justify-between"
              onClick={onCancel}
            >
              Cancel
            </button>
          </GradientBorder>
        </div>
      </div>
    </div>
  )
}

export default LinkWalletModal
