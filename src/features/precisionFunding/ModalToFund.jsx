import { useEffect, useRef, useState } from "react"
import Overlay from "../../components/Overlay"
import { ArrowRight } from "lucide-react"
import BoltIcon from "../../assets/icons/BoltIcon"
import Dropdown from "../../components/ui/Dropdown"

import fundedAnimation from "../../assets/gifs/fundedAnimation.gif"
import { getTokens, registerFunding } from "../../apis/precisionFunding"
import { useController, useForm } from "react-hook-form"
import phantomImage from "../../assets/images/phantomImage.png"
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
import { onConnectionPhantom, useAuth } from "../../contexts/AuthContext"
import { IPsToDollar } from "../../constants/IPsToDollar"
import {
  getSPLTokenBalance,
  getTokenBalance,
} from "../../blockchain/minting/mintNFT"
import { metaConnection } from "../../helpers/metaConnection"
import { phantomConnection } from "../../helpers/phantomConnection"
import LinkWalletModal from "../linkWallet/LinkWalletModal"
import { linkProfileFromInside } from "../../apis/authApis"
import { formatNumberToK } from "../../helpers/convertIntoK"
const ensureSolanaConnection = async (wallet, adapterName = "Phantom") => {
  try {
    const phantom = wallet.wallets.find((w) => w.adapter.name === adapterName)
    if (!phantom) {
      console.error(`Wallet adapter "${adapterName}" not found`)
      return null
    }

    if (!wallet.wallet || wallet.wallet.adapter.name !== adapterName) {
      await wallet.select(adapterName)
    }

    if (!wallet.connected) {
      await wallet.connect()
    }

    // Wait for publicKey to be available
    let retries = 20
    while (!wallet.publicKey && retries > 0) {
      await new Promise((res) => setTimeout(res, 100))
      retries--
    }

    if (!wallet.publicKey) {
      console.error("Wallet publicKey still undefined after retries")
      return null
    }

    return wallet.publicKey.toBase58()
  } catch (error) {
    console.error("Wallet connection failed:", error)
    await wallet.disconnect()
    await wallet.select(null)
    return null
  }
}

function ModalToFund({
  close,
  recieverWalletAddress,
  totalRequested,
  recieverWalletAddressSolana,
  actualSelectedNFT,
  activeCollection,
  core,
  activity,
  landscape,
  bountyIds,
}) {
  const myRef = useRef({ close })
  const { account } = useSDK()
  const [isFunded, setIsFunded] = useState(false)
  const { state, dispatch } = useAuth()
  const wallet = useWallet()
  const [isFullyFunded, setIsFullyFunded] = useState(false)
  const [showLinkModal, setShowLinkModal] = useState("")
  const [walletToLink, setWalletToLink] = useState(null)
  const [pendingFormData, setPendingFormData] = useState(null)
  const { loading, startLoading, stopLoading } = useLoadingState()
  const { fetchData } = useHome()
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
  })

  const { field: tokenField } = useController({
    name: "token",
    control,
    rules: { required: "Please choose a token" },
  })

  const { field: totalRewardAmountField } = useController({
    name: "totalRewardAmount",
    control,
    defaultValue: totalRequested || "",
    rules: {
      required: "Please enter amount",
      validate: (value) => {
        // if (value < 50) {
        //   return "Please enter at least 50"
        // }
        // if (value % 50 !== 0) {
        //   return "You can only fund in multiples of 50"
        // }

        if (
          Number(value) + Number(actualSelectedNFT?.totalIPs) * IPsToDollar >
          actualSelectedNFT?.maxIPs * IPsToDollar
        ) {
          return `Amount is exceeding the required amount, max amount can be ${(
            actualSelectedNFT?.maxIPs * IPsToDollar -
            Number(actualSelectedNFT?.totalIPs) * IPsToDollar
          )?.toFixed(2)}`
        }
        return true
      },
    },
  })
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

    console?.log(data?.token, "chain check karo")

    try {
      startLoading()

      if (data?.token?.chainName === "solana") {
        const phantom = wallet.wallets.find((w) => w.adapter.name === "Phantom")

        const phantomConnectionResponse = await phantomConnection(
          state?.citizen?.walletAddress,
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
            startLoading()

            const tokenBalance = await getSPLTokenBalance(
              phantomConnectionResponse,
              data?.token?.address
            )

            if (tokenBalance < Number(data?.totalRewardAmount)) {
              toast.error(
                `Insufficient ${data?.token?.name}  : You need  ${Number(
                  data?.totalRewardAmount
                )} ${data?.token?.symbol}`
              )
              return
            }
            const transaction = await getTransferTransaction(
              data?.token?.address,
              phantomConnectionResponse,
              recieverWalletAddressSolana,
              data?.totalRewardAmount,
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

            // Register funding
            const registerPayload = {
              nftCollectionNumber: activeCollection,
              fundingDetails: {
                transactionHash: signature,
                tokenAddress: data?.token?.address,
                amount: Number(data?.totalRewardAmount),
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
              ...(core && { core }),
              ...(activity && { type: activity }),
              ...(bountyIds?.length > 0 && { bountyIds }),
            }

            const response = await registerFunding(registerPayload)

            if (response?.data?.success) {
              fetchData()
              setIsFunded(true)
              setTimeout(() => {
                close()
                navigate("/")
              }, 2000)
            }
          } catch (error) {
            console.log(error, "Transaction error")
            toast.error("Transaction failed. See console for details.")
          } finally {
            stopLoading()
          }

          return
        }
      } else {
        const metaConnectionResponse = await metaConnection(
          state?.citizen?.evmAddress,
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
          const requiredTokenAmount = data?.totalRewardAmount

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
            amount: data?.totalRewardAmount,
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
                amount: Number(data?.totalRewardAmount),
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
              ...(bountyIds &&
                bountyIds?.length > 0 && {
                  bountyIds,
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
                //     Number(actualSelectedNFT?.totalIPs) ===
                //   250
                // )
                //   navigate("/fund/fully-funded")
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

  return (
    <Overlay>
      <div
        className={`absolute rounded-lg left-[50%] p-6 w-[90%]    md:w-[40%]  ${
          isFunded ? "bg-[rgba(52,53,52)] backdrop-blur-3xl " : "bg-[#1C1C1C] "
        } border border-[#2a2a2a]    translate-x-[-50%] translate-y-[-50%] top-[50%]`}
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
                  const selectedContract = contractAddresses?.find(
                    (contract) => contract.chainName === data?.token?.chainName
                  )

                  let { chainId, contractAddress, chainName } = selectedContract
                  const phantom = wallet.wallets.find(
                    (w) => w.adapter.name === "Phantom"
                  )
                  const {
                    stateURIsForSolana,
                    name,
                    solanaTreasuryWalletAddress,
                  } = landscape
                  const metadataUri = stateURIsForSolana[1]
                  const collectionMintString =
                    selectedContract?.collectionAddress
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
                      startLoading()

                      const tokenBalance = await getSPLTokenBalance(
                        walletToLink,
                        data?.token?.address
                      )

                      if (tokenBalance < Number(data?.totalRewardAmount)) {
                        toast.error(
                          `Insufficient ${
                            data?.token?.name
                          }  : You need  ${Number(data?.totalRewardAmount)} ${
                            data?.token?.symbol
                          }`
                        )
                        return
                      }
                      const transaction = await getTransferTransaction(
                        data?.token?.address,
                        walletToLink,
                        recieverWalletAddressSolana,
                        data?.totalRewardAmount,
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

                      const success = Boolean(
                        confirmResult?.value?.err === null
                      )

                      if (!success) {
                        toast.error("Transaction failed")
                        return
                      }

                      // Register funding
                      const registerPayload = {
                        nftCollectionNumber: activeCollection,
                        fundingDetails: {
                          transactionHash: signature,
                          tokenAddress: data?.token?.address,
                          amount: Number(data?.totalRewardAmount),
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
                        ...(core && { core }),
                        ...(activity && { type: activity }),
                        ...(bountyIds?.length > 0 && { bountyIds }),
                      }

                      const response = await registerFunding(registerPayload)

                      if (response?.data?.success) {
                        fetchData()
                        setIsFunded(true)
                        setTimeout(() => {
                          close()
                          navigate("/")
                        }, 2000)
                      }
                    } catch (error) {
                      toast.error(
                        "Transaction failed. See console for details."
                      )
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

                    const requiredTokenAmount = data?.totalRewardAmount

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
                      amount: data?.totalRewardAmount,
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
                          amount: Number(data?.totalRewardAmount),
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
                        ...(bountyIds &&
                          bountyIds?.length > 0 && {
                            bountyIds,
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
                          //     Number(actualSelectedNFT?.totalIPs) ===
                          //   250
                          // )
                          //   navigate("/fund/fully-funded")
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
              <div className=" border-b border-[#2D2D2D] pb-4 ">
                <div className="flex items-center">
                  <p className="text-[#fff] text-2xl font-bold">
                    Fund Instantly
                  </p>
                  <BoltIcon color="#919191" />
                </div>
                <p className="text-[#B2B2B2] text-sm mt-2">
                  If no activities are available as per your preference, funding
                  will be directed to activities that are available
                </p>
              </div>
              <div className="mt-4">
                <div className=" flex items-center gap-4">
                  {core && (
                    <div className="mb-5">
                      <p className="text-[#B2B2B2] font-semibold">
                        Impact Core
                      </p>
                      <div className="flex items-center gap-2">
                        <img
                          className="w-5 h-5 object-contain"
                          src={cores?.find((c) => c?.label === core)?.image}
                          alt=""
                        />
                        <p>{core}</p>
                      </div>
                    </div>
                  )}
                  {activity && (
                    <div className="my-5">
                      <p className="text-[#B2B2B2] font-semibold">Activity</p>
                      <div className="flex items-center gap-2">
                        <I color={"#9B9B9B"} />

                        <p>{activity}</p>
                      </div>
                    </div>
                  )}
                </div>

                <form action="" onSubmit={handleSubmit(onSubmit)}>
                  <div className="">
                    <p className="text-[#B2B2B2] font-semibold">Total Amount</p>
                    <div className="flex items-center mt-1  ">
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
                          btnClass="rounded-e-none"
                          w="w-40"
                        />
                      </div>
                      <input
                        {...totalRewardAmountField}
                        type="number"
                        placeholder={"Amount..."}
                        step={
                          tokenField?.value?.decimals
                            ? (1 / 10 ** tokenField.value.decimals).toFixed(
                                tokenField.value.decimals
                              )
                            : "any"
                        }
                        onBeforeInput={(e) => {
                          const input = e.target
                          const decimals = tokenField?.value?.decimals ?? 0

                          if (decimals === 0 && e.data === ".") {
                            e.preventDefault() // block the decimal point input
                          }
                        }}
                        onInput={(e) => {
                          const input = e.target
                          const value = input.value
                          const decimals = tokenField?.value?.decimals ?? 0

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
                            const selectionStart = input.selectionStart ?? 0
                            const selectionEnd = input.selectionEnd ?? 0

                            input.value =
                              parts[0] + "." + parts[1].slice(0, decimals)
                            input.setSelectionRange(
                              selectionStart - 1,
                              selectionEnd - 1
                            )
                          }
                        }}
                        onWheel={(event) => event.target.blur()}
                        // onInput={restrictLength}
                        className={`w-[100%] rounded-s-none text-[#A3A3A3] border border-[#4E4E4E] outline-none  shadow-sm placeholder:text-[#A3A3A3]   bg-[#272727]   rounded-md px-3 py-2 `}
                      />
                    </div>
                    <p className="text-[#8C8C8C] text-sm font-semibold">
                      {Object.keys(errors)?.length === 2
                        ? "Please choose a token and enter an amount"
                        : errors?.token?.message ||
                          errors?.totalRewardAmount?.message}
                    </p>
                  </div>
                  <div className="flex flex-col gap-[.375rem] mt-5">
                    <p className="font-medium">Total Impact</p>
                    <div className="flex items-center gap-3">
                      <div className=" text-2xl  font-semibold flex items-center gap-1">
                        <span>
                          {totalRewardAmountField.value
                            ? formatNumberToK(
                                Number(
                                  Number(totalRewardAmountField.value) * 14.4
                                )?.toFixed(2)
                              )
                            : "0K"}
                        </span>
                        <span>IP</span>
                      </div>
                      <div className="bg-[#7F7F7F] w-3 h-3 rounded-full "></div>
                      <div className="text-whiteGrey flex items-center gap-1 font-semibold">
                        <div className=" text-2xl font-semibold flex items-center ">
                          <span>$</span>
                          <span>
                            {Number(totalRewardAmountField?.value) || 0}
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
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </Overlay>
  )
}

export default ModalToFund
