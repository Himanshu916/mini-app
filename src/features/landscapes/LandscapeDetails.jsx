import GradientBorder from "../../components/GradientBorder"
import { useNavigate } from "react-router-dom"
import ImpactCores from "./ImpactCores"
import { useAuth } from "../../contexts/AuthContext"
import notUpdated from "../../assets/images/notupdated.png"
import { fundText, getColor } from "../../constants/colors"
import ExpandAndContractText from "../../components/ui/ExpandAndContractText"
import Loader from "../../components/Loader"
import { ArrowRightIcon } from "lucide-react"
const LandscapeDetails = ({
  details,
  coreWiseFunding,
  greenPillNFTsCountInLandscape,
  loading,
  gettingGreenpillCounts,
  actualSelectedNFT,
  leaderboardData,
  gettingCores,
  isNFTPresent,
}) => {
  const navigate = useNavigate()

  const { state: authState } = useAuth()

  const { citizen } = authState

  const myInfo = leaderboardData?.find(
    (leader) => leader?.evmAddress === citizen?.evmAddress
  )

  return (
    <div className="">
      <div className="flex  flex-col-reverse lg:flex-row   w-full ">
        <div className=" w-full lg:w-[65%] rounded-t-3xl lg:rounded-none  bg-[#272727] md:bg-inherit p-4  md:p-0  gap-6">
          <h1
            className="text-[1.75rem] font-bold text-textHeading"
            style={{
              textShadow: "0px 0px 11.8px rgba(255, 255, 255, 0.59)",
            }}
          >
            {details?.name}
          </h1>
          <ExpandAndContractText text={details?.description} wordLimit={20} />
          <div className="flex items-center my-4">
            {leaderboardData?.length > 0 ? (
              <div className="text-xl  flex flex-col  gap-2 font-bold">
                <div className="flex items-center gap-2">
                  {gettingGreenpillCounts ? (
                    <Loader color="fill-[#326F58]" />
                  ) : (
                    <span
                      className={`${
                        fundText[
                          getColor(
                            Number(
                              (greenPillNFTsCountInLandscape / 400) * 100
                            )?.toFixed(2)
                          )
                        ]?.perFundText
                      }`}
                    >
                      {Number(
                        (greenPillNFTsCountInLandscape / 400) * 100
                      )?.toFixed(2)}
                    </span>
                  )}
                  <span
                    className={`${
                      fundText[
                        getColor(
                          Number(
                            (greenPillNFTsCountInLandscape / 400) * 100
                          )?.toFixed(2)
                        )
                      ]?.perFundText
                    }`}
                  >
                    {" "}
                    % of the landscape is funded
                  </span>
                </div>
                {myInfo ? (
                  <p className="flex text-[#CFCFCF] text-sm items-center font-medium gap-1">
                    <span>by</span>
                    <img
                      className="w-6 h-6 rounded-full"
                      src={citizen?.profileImage || notUpdated}
                      alt="not-updated"
                    />
                    <span className="">
                      you +{leaderboardData?.length - 1} others
                    </span>
                  </p>
                ) : (
                  <p className="text-[#CFCFCF] text-sm font-medium">
                    <span>by</span>
                    <span className="px-2">
                      {leaderboardData?.length} others{" "}
                    </span>
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xl  flex flex-col  gap-2 font-bold">
                <span className="text-[#EB9E9E]">{0}% funded</span>
              </p>
            )}
          </div>
          <div className=" hidden lg:flex items-center gap-3">
            <GradientBorder
              radiusBorder={".313rem"}
              color2={"#506C6600"}
              color1={"#699F84"}
              bg="bg-[#1E3D36]"
              // shadow="shadow-button-shadow"
            >
              <button
                onClick={() => navigate("mintNew")}
                className=" px-4 py-[.35rem] flex items-center gap-2  "
              >
                <span>Mint a New NFT</span>
              </button>
            </GradientBorder>
            {isNFTPresent &&
              actualSelectedNFT?.totalIPs < actualSelectedNFT?.maxIPs && (
                <GradientBorder
                  radiusBorder={".313rem"}
                  color2={"#506C6600"}
                  color1={"#699F84"}
                  bg="bg-[#1E3D36]"
                >
                  <button
                    onClick={() => navigate("fund")}
                    className=" px-4 py-[.35rem] flex items-center gap-2  "
                  >
                    <span>Fund Existing NFT</span>
                  </button>
                </GradientBorder>
              )}
          </div>
          <p
            onClick={() => navigate("/activities")}
            className="text-[#D1EFE0] cursor-pointer text-sm mt-2 flex items-center gap-1 border-b border-[#D1EFE0] w-fit pb-[2px]"
          >
            <span>or explore activities you can fund</span>
            <ArrowRightIcon strokeWidth={4} size={14} />
          </p>

          <ImpactCores
            coreWiseFunding={coreWiseFunding?.data}
            loading={gettingCores}
          />
        </div>
        <div className=" w-full lg:w-[35%]  bg-mint-mobile-gradient flex  rounded-t-3xl lg:rounded-t-none justify-center md:bg-none">
          <div className="w-[30%] lg:w-full  md:h-[26.5rem]  flex  justify-center">
            <img
              className="h-[16.56rem]  lg:h-full object-cover"
              src={details?.pillImage}
              alt="Red NFT"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandscapeDetails
