import { useEffect, useRef, useState } from "react"
import Overlay from "../../components/Overlay"
import { ArrowRight } from "lucide-react"
import BoltIcon from "../../assets/icons/BoltIcon"
import Dropdown from "../../components/ui/Dropdown"

import fundedAnimation from "../../assets/gifs/fundedAnimation.gif"
import { getTokens, registerFunding } from "../../apis/precisionFunding"
import {
  useController,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form"
import dollarSign from "../../assets/images/dollarSign.png"
import metamaskImage from "../../assets/images/metamaskImage.png"
import { useSDK } from "@metamask/sdk-react"
import { useLoadingState } from "../../hooks/useLoader"
import {
  fetchChainDetails,
  getMetaMaskProvider,
  getTransferTransaction,
  transferFund,
} from "../../blockchain/funding/transferFunds"
import { toast } from "sonner"
import { useHome } from "../../contexts/HomeContext"
import { useNavigate } from "react-router-dom"
import Loader from "../../components/Loader"
import { cores } from "./StepOne"
import { activityType } from "../../constants/activityType"
import { useWallet } from "@solana/wallet-adapter-react"
import { Connection } from "@solana/web3.js"
import { RPC_ENDPOINT } from "../../constants/apiPath"
import { formatNumberToK } from "../../helpers/convertIntoK"
import ExpandAndContractText from "../../components/ui/ExpandAndContractText"
import { fixTo2WithoutRoundOff } from "../../helpers/fixTo2WithoutRoundOff"
import {
  getSPLTokenBalance,
  getTokenBalance,
} from "../../blockchain/minting/mintNFT"
import { phantomConnection } from "../../helpers/phantomConnection"
import { metaConnection } from "../../helpers/metaConnection"
import { useAuth } from "../../contexts/AuthContext"
import LinkWalletModal from "../linkWallet/LinkWalletModal"
import { linkProfileFromInside } from "../../apis/authApis"

function ModalToFundStep3({
  close,
  recieverWalletAddress,
  actualSelectedNFT,
  activeCollection,
  recieverWalletAddressSolana,
  core,
  activity,
  landscape,
  bounties,
  bountyIds,
}) {
  const myRef = useRef({ close })
  const { account } = useSDK()
  const [isFunded, setIsFunded] = useState(false)
  const wallet = useWallet()
  const [showLinkModal, setShowLinkModal] = useState("")
  const [walletToLink, setWalletToLink] = useState(null)
  const [pendingFormData, setPendingFormData] = useState(null)
  const [isFullyFunded, setIsFullyFunded] = useState(false)
  const { state: authState, dispatch } = useAuth()
  const { loading, startLoading, stopLoading } = useLoadingState()
  const { fetchData, state, loading: gettingNFTs } = useHome()
  const navigate = useNavigate()
  const [tokens, setTokens] = useState([])
  const {
    register,
    handleSubmit,
    control,
    getValues,
    trigger,
    formState: { errors },
    setError,
    reset,
    setValue,

    clearErrors,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      bountiesAmount: bounties.map((bounty) => ({
        id: bounty.bountyId,
        amount: "",
        // amount: bounty?.amountRequired,
      })),
    },
  })

  const { field: tokenField } = useController({
    name: "token",
    control,
    rules: { required: "Please choose a token" },
  })
  // const totalRequested = bounties?.reduce(
  //   (acc, current) => acc + Number(current?.amountRequested),
  //   0
  // )
  //   const { field: totalRewardAmountField } = useController({
  //     name: "totalRewardAmount",
  //     control,
  //     defaultValue: totalRequested || "",
  //     rules: {
  //       required: "Please enter amount",
  //       validate: (value) => {
  //         // if (value < 50) {
  //         //   return "Please enter at least 50"
  //         // }
  //         // if (value % 50 !== 0) {
  //         //   return "You can only fund in multiples of 50"
  //         // }

  //         if (Number(value) + Number(actualSelectedNFT?.nftFund) > 250) {
  //           return `Amount is exceeding the required amount, max amount can be ${
  //             250 - Number(actualSelectedNFT?.nftFund)
  //           }`
  //         }
  //         return true
  //       },
  //     },
  //   })

  const {
    fields: bountiesAmountField,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "bountiesAmount", // Name of the field array
  })
  const watchedAmount = useWatch({ name: "bountiesAmount", control })
  useEffect(
    function () {
      const fetchData = async () => {
        try {
          const response = await getTokens()

          setTokens(response?.data)
        } catch (error) {
          console.log(error)
        }
      }
      fetchData()

      function handleClick(e) {
        if (myRef.current && !myRef.current.contains(e.target)) {
          close()
        }
      }

      document.addEventListener("click", handleClick, true)

      return () => document.removeEventListener("click", handleClick, true)
    },
    [close]
  )

  useEffect(() => {
    function handleClickOutside(e) {
      // Close the modal if the click is outside the modal content
      if (myRef.current && !myRef.current.contains(e.target)) {
        close()
      }
    }

    // Add the event listener to close modal on outside click
    document.addEventListener("mousedown", handleClickOutside, true)

    // Clean up the event listener when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true)
    }
  }, [close])

  const onSubmit = async (data) => {
    const tokenChainId = data?.token?.chainId

    const bountiesPayload = data?.bountiesAmount?.map((bounty) => {
      return {
        bountyId: bounty?.id,
        fundAmount: Number(bounty?.amount),
      }
    })
    const totalBountiesAmount = bountiesPayload?.reduce((acc, current) => {
      return acc + Number(current?.fundAmount)
    }, 0)

    try {
      startLoading()

      if (data?.token?.chainName === "solana") {
        const phantom = wallet.wallets.find((w) => w.adapter.name === "Phantom")

        const phantomConnectionResponse = await phantomConnection(
          authState?.citizen?.walletAddress,
          wallet
        )

        if (phantomConnectionResponse === "chainerror") {
          return
        } else if (!phantomConnectionResponse) {
          toast?.error("Please try to fund with wallet linked to profile")
          return
        } else if (phantomConnectionResponse?.text === "changewallet") {
          setWalletToLink(phantomConnectionResponse.wallet)
          setPendingFormData(data)
          setShowLinkModal("solana")
          return
        } else {
          try {
            const connection = new Connection(RPC_ENDPOINT, "confirmed")

            const tokenBalance = await getSPLTokenBalance(
              phantomConnectionResponse,
              data?.token?.address
            )

            if (tokenBalance < Number(totalBountiesAmount)) {
              toast.error(
                `Insufficient ${data?.token?.name}  : You need  ${Number(
                  totalBountiesAmount
                )} ${data?.token?.symbol}`
              )
              return
            }

            const transaction = getTransferTransaction(
              data?.token?.address,
              phantomConnectionResponse,
              recieverWalletAddressSolana,
              totalBountiesAmount,
              connection
            )

            const signature = await phantom.adapter.sendTransaction(
              transaction,
              connection
            )
            const confirmResult = await connection.confirmTransaction(
              signature,
              "confirmed"
            )

            const success = Boolean(confirmResult?.value?.err === null)
            if (!success) {
              toast.error("Transaction failed")
              return
            }

            // integrate api to register funding

            const registerPayload = {
              nftCollectionNumber: activeCollection,
              fundingDetails: {
                transactionHash: signature,
                tokenAddress: data?.token?.address,
                amount: totalBountiesAmount,
                chainName: data?.token?.chainName,
              },
              nftDetails: {
                chainName: actualSelectedNFT?.chainName,
                ...(actualSelectedNFT?.chainName === "solana"
                  ? {
                      collectionAddress: actualSelectedNFT?.collectionAddress,
                      assetId: actualSelectedNFT?.tokenId,
                    }
                  : {
                      chainId: actualSelectedNFT?.chainId,
                      contractAddress: actualSelectedNFT?.contractAddress,
                      tokenId: actualSelectedNFT?.tokenId,
                    }),
              },
              ...(core && {
                core,
              }),
              ...(activity && {
                type: activity,
              }),
              ...(bounties &&
                bounties?.length > 0 && { bounties: bountiesPayload }),
            }
            const response = await registerFunding(registerPayload)

            if (response?.data?.success) {
              fetchData()
              // toast.success("Funding registered successfully")

              setIsFunded(true)
              setTimeout(() => {
                close()
                navigate("/")
                // if (
                //   Number(data?.totalRewardAmount) +
                //     Number(actualSelectedNFT?.nftFund) ===
                //   250
                // )
                //   navigate("/fund/fully-funded")
                // else navigate("/home")
              }, 2000)
            }
          } catch (error) {
            console.log(error, "see the error")
          } finally {
            stopLoading()
          }

          return
        }
      } else {
        // Get MetaMask provider
        const metaMaskProvider = getMetaMaskProvider()
        const metaConnectionResponse = await metaConnection(
          authState?.citizen?.evmAddress,
          data?.token?.chainId
        )

        if (metaConnectionResponse === "chainerror") {
          return
        } else if (!metaConnectionResponse) {
          toast?.error("Please try to fund with wallet linked to profile")
          return
        } else if (metaConnectionResponse?.text === "changewallet") {
          setWalletToLink(metaConnectionResponse.wallet)
          setPendingFormData(data)
          setShowLinkModal("evm")
          return
        } else {
          const requiredTokenAmount = totalBountiesAmount

          const tokenBalance = await getTokenBalance(
            data?.token?.chainId,
            data?.token?.address,
            metaConnectionResponse
          )

          const tokenBalanceComparable = Number(
            Number(tokenBalance) / 10 ** data?.token?.decimals
          )

          if (tokenBalanceComparable < requiredTokenAmount) {
            toast.error(
              `Insufficient ${data?.token?.name}  : You need  ${Number(
                requiredTokenAmount
              )?.toFixed(2)} ${data?.token?.symbol}`
            )
            return
          }

          // Prepare payload
          const payload = {
            tokenAddress: data?.token?.address,
            recieverWalletAddress: recieverWalletAddress,
            amount: totalBountiesAmount,
            decimals: data?.token.decimals,
          }

          const { success, code, result } = await transferFund(payload)

          if (!success) {
            // toast.error(`May be winner has not linked metamask wallet in his "Impact Miner" account`);

            toast.error(code)
            return
          }
          if (success) {
            // integrate api to register funding

            const registerPayload = {
              nftCollectionNumber: activeCollection,
              fundingDetails: {
                transactionHash: result,
                chainId: tokenChainId,
                tokenAddress: data?.token?.address,
                amount: totalBountiesAmount,
                chainName: data?.token?.chainName,
              },
              nftDetails: {
                chainName: actualSelectedNFT?.chainName,
                ...(actualSelectedNFT?.chainName === "solana"
                  ? {
                      collectionAddress: actualSelectedNFT?.collectionAddress,
                      assetId: actualSelectedNFT?.tokenId,
                    }
                  : {
                      chainId: actualSelectedNFT?.chainId,
                      contractAddress: actualSelectedNFT?.contractAddress,
                      tokenId: actualSelectedNFT?.tokenId,
                    }),
              },
              ...(core && {
                core,
              }),
              ...(activity && {
                type: activity,
              }),
              ...(bounties &&
                bounties?.length > 0 && { bounties: bountiesPayload }),
            }
            const response = await registerFunding(registerPayload)

            if (response?.data?.success) {
              fetchData()
              // toast.success("Funding registered successfully")

              setIsFunded(true)
              setTimeout(() => {
                close()
                navigate("/")
                //   if (
                //     Number(data?.totalRewardAmount) +
                //       Number(actualSelectedNFT?.nftFund) ===
                //     250
                //   )
                //     navigate("/fund/fully-funded")
                // else navigate("/home")
              }, 2000)
            }
          }
        }
      }
    } catch (err) {
      console.warn("Failed to connect..", err)
      toast.error("An error occurred while processing your request")
    } finally {
      stopLoading()
    }
  }

  const I = activityType?.find((a) => a?.label === activity)?.Icon

  const totalRequested = watchedAmount?.reduce(
    (acc, current) => acc + Number(current?.amount),
    0
  )
  const nftsSpecificToLandscape =
    state?.greenPillNFTsHoldByWalletAddress?.filter(
      (nft) => nft?.collectionNo === activeCollection
    )

  return (
    <Overlay>
      <div
        className={`absolute rounded-lg left-[50%] p-6 w-[90%] ${
          isFunded ? "bg-[rgba(52,53,52)] backdrop-blur-3xl " : "bg-[#1C1C1C] "
        }  mt-6  md:w-[40%]   border border-[#2a2a2a]    translate-x-[-50%] translate-y-[-50%] top-[50%]`}
      >
        <div ref={myRef} className="relative w-full h-full">
          <button
            className="  absolute z-[9999] top-0 right-0  rounded-full  "
            onClick={() => {
              close()
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
            >
              <circle cx="15" cy="15" r="15" fill="#393939" />
              <path
                d="M20.5918 10L10.5914 20.0004"
                stroke="#F0F0F0"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M20 20L9.99964 9.99964"
                stroke="#F0F0F0"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {isFunded ? (
            <div className="flex flex-col relative items-center    justify-center">
              <div className="relative w-full h-[32.3125rem] ">
                {/* Background layer with opacity */}
                <div className="absolute inset-0 bg-nft-gradient opacity-15 pointer-events-none z-0"></div>

                {/* Content layer */}
                <div className="absolute top-[50%] w-full left-[50%]  translate-x-[-50%] translate-y-[-50%] z-10 text-center">
                  <div className="relative w-full">
                    <div className="flex flex-col items-center">
                      <p className="text-3xl absolute w-full top-0 left-[50%] translate-x-[-50%] md:text-5xl   font-semibold">
                        NFT Funded!
                      </p>
                      <img
                        className="w-[23.375rem]"
                        src={fundedAnimation}
                        alt="funded-animation"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : showLinkModal ? (
            showLinkModal === "solana" ? (
              <LinkWalletModal
                text={"Link & Fund"}
                onYes={async () => {
                  const data = pendingFormData

                  const phantom = wallet.wallets.find(
                    (w) => w.adapter.name === "Phantom"
                  )

                  try {
                    startLoading()
                    // const response = await updateWallet(
                    //   walletToLink,
                    //   undefined
                    // )

                    const response = await linkProfileFromInside(
                      false,
                      walletToLink
                    )

                    if (response?.response?.data?.code === 400) {
                      toast?.error(response?.response?.data?.message)
                      stopLoading()
                      return
                    }
                    if (response?.data?.success) {
                      dispatch({
                        type: "changeWalletSolana",
                        payload: walletToLink,
                      })
                    }

                    // continue transaction
                    try {
                      const connection = new Connection(
                        RPC_ENDPOINT,
                        "confirmed"
                      )

                      const tokenBalance = await getSPLTokenBalance(
                        walletToLink,
                        data?.token?.address
                      )

                      if (tokenBalance < Number(totalBountiesAmount)) {
                        toast.error(
                          `Insufficient ${
                            data?.token?.name
                          }  : You need  ${Number(totalBountiesAmount)} ${
                            data?.token?.symbol
                          }`
                        )
                        return
                      }

                      const transaction = getTransferTransaction(
                        data?.token?.address,
                        walletToLink,
                        recieverWalletAddressSolana,
                        totalBountiesAmount,
                        connection
                      )

                      const signature = await wallet.sendTransaction(
                        transaction,
                        connection
                      )
                      const confirmResult = await connection.confirmTransaction(
                        signature,
                        "confirmed"
                      )

                      const success = Boolean(
                        confirmResult?.value?.err === null
                      )

                      if (confirmResult?.value?.err !== null) {
                        // toast.error(`May be winner has not linked metamask wallet in his "Impact Miner" account`);

                        toast.error(code)
                        return
                      } else {
                        // integrate api to register funding

                        const registerPayload = {
                          nftCollectionNumber: activeCollection,
                          fundingDetails: {
                            transactionHash: signature,
                            tokenAddress: data?.token?.address,
                            amount: totalBountiesAmount,
                            chainName: data?.token?.chainName,
                          },
                          nftDetails: {
                            chainName: actualSelectedNFT?.chainName,
                            ...(actualSelectedNFT?.chainName === "solana"
                              ? {
                                  collectionAddress:
                                    actualSelectedNFT?.collectionAddress,
                                  assetId: actualSelectedNFT?.tokenId,
                                }
                              : {
                                  chainId: actualSelectedNFT?.chainId,
                                  contractAddress:
                                    actualSelectedNFT?.contractAddress,
                                  tokenId: actualSelectedNFT?.tokenId,
                                }),
                          },
                          ...(core && {
                            core,
                          }),
                          ...(activity && {
                            type: activity,
                          }),
                          ...(bounties &&
                            bounties?.length > 0 && {
                              bounties: bountiesPayload,
                            }),
                        }
                        const response = await registerFunding(registerPayload)

                        if (response?.data?.success) {
                          fetchData()
                          // toast.success("Funding registered successfully")

                          setIsFunded(true)
                          setTimeout(() => {
                            close()
                            navigate("/")
                            // if (
                            //   Number(data?.totalRewardAmount) +
                            //     Number(actualSelectedNFT?.nftFund) ===
                            //   250
                            // )
                            //   navigate("/fund/fully-funded")
                            // else navigate("/home")
                          }, 2000)
                        }
                      }
                    } catch (error) {
                      console.log(error, "see the error")
                    } finally {
                      stopLoading()
                    }

                    return
                  } catch (err) {
                    console.error(err)
                    toast.error("Something went wrong during minting")
                  } finally {
                    setShowLinkModal("") // ✅ Close modal only at the end
                    stopLoading()
                  }
                }}
                onCancel={() => {
                  setShowLinkModal("")
                  setWalletToLink(null)
                  setPendingFormData(null)
                }}
              />
            ) : (
              <LinkWalletModal
                text={"Link & Fund"}
                onYes={async () => {
                  const data = pendingFormData

                  try {
                    startLoading()
                    // const response = await updateWallet(
                    //   walletToLink,
                    //   undefined
                    // )

                    const response = await linkProfileFromInside(
                      true,
                      walletToLink
                    )

                    if (response?.response?.data?.code === 400) {
                      toast?.error(response?.response?.data?.message)
                      stopLoading()
                      return
                    }
                    if (response?.data?.success) {
                      dispatch({
                        type: "changeWalletEVM",
                        payload: walletToLink,
                      })
                    }

                    // continue transaction
                    const requiredTokenAmount = totalBountiesAmount

                    const tokenBalance = await getTokenBalance(
                      data?.token?.chainId,
                      data?.token?.address,
                      walletToLink
                    )

                    const tokenBalanceComparable = Number(
                      Number(tokenBalance) / 10 ** data?.token?.decimals
                    )

                    if (tokenBalanceComparable < requiredTokenAmount) {
                      toast.error(
                        `Insufficient ${
                          data?.token?.name
                        }  : You need  ${Number(requiredTokenAmount)?.toFixed(
                          2
                        )} ${data?.token?.symbol}`
                      )
                      return
                    }

                    // Prepare payload
                    const payload = {
                      tokenAddress: data?.token?.address,
                      recieverWalletAddress: recieverWalletAddress,
                      amount: totalBountiesAmount,
                      decimals: data?.token.decimals,
                    }

                    const { success, code, result } = await transferFund(
                      payload
                    )

                    if (!success) {
                      // toast.error(`May be winner has not linked metamask wallet in his "Impact Miner" account`);

                      toast.error(code)
                      return
                    }
                    if (success) {
                      // integrate api to register funding

                      const registerPayload = {
                        nftCollectionNumber: activeCollection,
                        fundingDetails: {
                          transactionHash: result,
                          chainId: tokenChainId,
                          tokenAddress: data?.token?.address,
                          amount: totalBountiesAmount,
                          chainName: data?.token?.chainName,
                        },
                        nftDetails: {
                          chainName: actualSelectedNFT?.chainName,
                          ...(actualSelectedNFT?.chainName === "solana"
                            ? {
                                collectionAddress:
                                  actualSelectedNFT?.collectionAddress,
                                assetId: actualSelectedNFT?.tokenId,
                              }
                            : {
                                chainId: actualSelectedNFT?.chainId,
                                contractAddress:
                                  actualSelectedNFT?.contractAddress,
                                tokenId: actualSelectedNFT?.tokenId,
                              }),
                        },
                        ...(core && {
                          core,
                        }),
                        ...(activity && {
                          type: activity,
                        }),
                        ...(bounties &&
                          bounties?.length > 0 && {
                            bounties: bountiesPayload,
                          }),
                      }
                      const response = await registerFunding(registerPayload)

                      if (response?.data?.success) {
                        fetchData()
                        // toast.success("Funding registered successfully")

                        setIsFunded(true)
                        setTimeout(() => {
                          close()
                          navigate("/")
                          //   if (
                          //     Number(data?.totalRewardAmount) +
                          //       Number(actualSelectedNFT?.nftFund) ===
                          //     250
                          //   )
                          //     navigate("/fund/fully-funded")
                          // else navigate("/home")
                        }, 2000)
                      }
                    }
                  } catch (err) {
                    console.error(err)
                    toast.error("Something went wrong during minting")
                  } finally {
                    setShowLinkModal("") // ✅ Close modal only at the end
                    stopLoading()
                  }
                }}
                onCancel={() => {
                  setShowLinkModal("")
                  setWalletToLink(null)
                  setPendingFormData(null)
                }}
              />
            )
          ) : (
            <div>
              <div className="flex flex-col  border-b border-[#2D2D2D] pb-4 ">
                <p className="text-[#fff] text-2xl font-bold">Fund Now</p>

                <p className="text-cardGreyBounty">
                  You will be funding {bounties?.length}{" "}
                  {bounties?.length > 1 ? "bounties" : "bounty"} under the
                  impact core of ‘{core}’ for activities regarding ‘{activity}’
                </p>
              </div>

              <div className="mt-4">
                <form action="" onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#B2B2B2] font-semibold">
                        Connect Your Wallet
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <img
                          className="w-4 h-4 object-cover"
                          src={metamaskImage}
                          alt="wallet-logo"
                        />
                        <p className="text-[#fff] font-semibold">
                          Linked Wallet :{" "}
                        </p>
                        <p className="text-[#fff]">
                          {account?.slice(0, 4)}...{account?.slice(-4)}
                        </p>
                      </div>
                    </div>
                    <div className="relative ">
                      <Dropdown
                        modifyLabel={(listItem) => {
                          return (
                            <div className="flex items-center gap-5 text-[#A3A3A3]">
                              <div className=" relative  ">
                                <img
                                  className="w-5 h-5 rounded-full "
                                  src={listItem?.image}
                                  alt=""
                                />
                                <img
                                  className="w-3 h-3 absolute -top-1 -right-1 rounded-full "
                                  src={listItem?.chainImage}
                                  alt=""
                                />
                              </div>
                              <span>{listItem?.symbol} </span>
                            </div>
                          )
                        }}
                        data={tokens}
                        isSymbol={true}
                        selected={tokenField.value}
                        onSelected={tokenField.onChange}
                        noSelectedText="Choose Token"
                        //   btnClass="rounded-e-none"
                        w="w-40"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    {errors?.token && (
                      <p className="text-[#D48080]">{errors?.token?.message}</p>
                    )}
                  </div>

                  <div className="mt-5">
                    <div className="h-[30vh] overflow-auto main">
                      <div className="flex  flex-col bounties flex-grow overflow-y-auto items-center gap-5 main md:pr-4">
                        {bountiesAmountField.map((field, index) => (
                          <div
                            key={field?.bountyId}
                            className="bg-[#3C3C3C] w-full gap-3 flex flex-col  rounded-lg px-5 py-4"
                          >
                            <div>
                              <input
                                {...register(`bountiesAmount.${index}.amount`, {
                                  required: "Please enter an amount",
                                  validate: (value) => {
                                    if (
                                      Number(value) +
                                        Number(actualSelectedNFT?.totalIPs) /
                                          14.4 >
                                      250
                                    ) {
                                      return `Amount is exceeding the required amount, max amount can be ${fixTo2WithoutRoundOff(
                                        Number(
                                          250 -
                                            Number(
                                              actualSelectedNFT?.totalIPs
                                            ) /
                                              14.4
                                        )
                                      )}`
                                    }
                                    return true
                                  },
                                })}
                                type="number"
                                placeholder={"Amount..."}
                                step={
                                  tokenField?.value?.decimals
                                    ? (
                                        1 /
                                        10 ** tokenField.value.decimals
                                      ).toFixed(tokenField.value.decimals)
                                    : "any"
                                }
                                onBeforeInput={(e) => {
                                  const input = e.target
                                  const decimals =
                                    tokenField?.value?.decimals ?? 0

                                  if (decimals === 0 && e.data === ".") {
                                    e.preventDefault() // block the decimal point input
                                  }
                                }}
                                onInput={(e) => {
                                  const input = e.target
                                  const value = input.value
                                  const decimals =
                                    tokenField?.value?.decimals ?? 0

                                  if (decimals === 0) {
                                    input.value = value.split(".")[0]
                                    input.setSelectionRange(
                                      input.value.length,
                                      input.value.length
                                    )
                                    return
                                  }

                                  const parts = value.split(".")
                                  if (
                                    parts.length === 2 &&
                                    parts[1].length > decimals
                                  ) {
                                    const selectionStart =
                                      input.selectionStart ?? 0
                                    const selectionEnd = input.selectionEnd ?? 0

                                    input.value =
                                      parts[0] +
                                      "." +
                                      parts[1].slice(0, decimals)
                                    input.setSelectionRange(
                                      selectionStart - 1,
                                      selectionEnd - 1
                                    )
                                  }
                                }}
                                onWheel={(event) => event.target.blur()}
                                // onInput={restrictLength}
                                className={`w-[100%]  text-[#A3A3A3] border border-[#4E4E4E] outline-none  shadow-sm placeholder:text-[#A3A3A3]   bg-[#272727]   rounded-md px-3 py-2 `}
                              />
                              <p className="text-[#D48080] text-sm font-semibold">
                                {Object.keys(errors)?.length > 0
                                  ? errors?.bountiesAmount?.[index] &&
                                    errors?.bountiesAmount?.[index]?.amount
                                      ?.message
                                  : null}
                              </p>
                            </div>

                            <div className="flex items-center gap-1">
                              <p className="capitalize font-semibold">
                                {bounties[index]?.title}
                              </p>
                            </div>
                            <ExpandAndContractText
                              isActivity={true}
                              textColor={"text-cardGreyBounty"}
                              text={bounties[index]?.description}
                              wordLimit={20}
                            />
                            <div className="flex items-center gap-4">
                              <div className="text-whiteGrey flex items-center gap-1 font-medium">
                                <span>
                                  <span>$</span>
                                  <span>
                                    {bounties[index]?.amountRequired?.toFixed(
                                      2
                                    )}
                                  </span>
                                </span>
                              </div>
                              <div className="flex items-center text-whiteGrey font-medium gap-1">
                                <img
                                  className="w-5 h-5 rounded-full"
                                  src={bounties[index]?.organisationLogo}
                                  alt="org-logo"
                                />
                                <span>{bounties[index]?.organisationName}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-col gap-[.375rem] mt-5">
                      <p className="font-bold">Total Impact</p>
                      <div className="flex items-center gap-2">
                        <div className=" text-2xl md:text-4xl font-semibold flex items-center gap-4">
                          <span>
                            {totalRequested
                              ? formatNumberToK(
                                  Number(totalRequested * 14.4)?.toFixed(2)
                                )
                              : "0K"}
                          </span>
                          <span>IP</span>
                        </div>
                        <div className="bg-[#D9D9D9] w-3 h-3 rounded-full "></div>
                        <div className="text-whiteGrey flex items-center gap-1 font-semibold">
                          {/* <img
                            className="w-8 h-8 "
                            src={dollarSign}
                            alt="dollar-sign"
                          /> */}
                          <div className=" text-2xl md:text-4xl font-semibold flex items-center ">
                            <span>$</span>
                            <span>
                              {Number(totalRequested)?.toFixed(2) || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 flex items-center justify-end">
                      <button className=" bg-[#426A61] flex items-center py-3 px-4 justify-center gap-1 text-white border w-[11rem] border-[#699F84] rounded-lg ">
                        {loading ? (
                          <Loader color={"fill-[#326F58]"} />
                        ) : (
                          <>
                            {" "}
                            <span>Fund Now</span> <ArrowRight size={14} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </Overlay>
  )
}

export default ModalToFundStep3
