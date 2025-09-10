import { useEffect, useMemo, useRef, useState } from "react"
import Overlay from "../../components/Overlay"
import { BrowserProvider, formatEther } from "ethers"
import { ArrowRight } from "lucide-react"
import BoltIcon from "../../assets/icons/BoltIcon"
import mintedAnimation from "../../assets/gifs/mintedAnimation.gif"
import Dropdown from "../../components/ui/Dropdown"
import {
  getChains,
  getTokens,
  registerFunding,
} from "../../apis/precisionFunding"
import { useController, useForm } from "react-hook-form"
import dollarSign from "../../assets/images/dollarSign.png"
import metamaskImage from "../../assets/images/metamaskImage.png"
import phantomImage from "../../assets/images/phantomImage.png"
import { useSDK } from "@metamask/sdk-react"
import { useLoadingState } from "../../hooks/useLoader"
import {
  fetchChainDetails,
  getMetaMaskProvider,
  transferFund,
} from "../../blockchain/funding/transferFunds"
import { toast } from "sonner"
import {
  getMintPriceForEVM,
  getMintPriceForEVMInStableCoin,
  getMintPriceForSolana,
  getMintTransaction,
  getMintTransactionWithStableCoin,
  getSPLTokenBalance,
  getTokenBalance,
  getWhitelistedTokenAddresses,
  mintNFT,
  mintNFTP,
  mintNftWithToken,
} from "../../blockchain/minting/mintNFT"
import { useHome } from "../../contexts/HomeContext"
import Loader from "../../components/Loader"
import { useNavigate } from "react-router-dom"
import { getProvider, useAuth } from "../../contexts/AuthContext"
import { MINTPRICE_USD, RPC_ENDPOINT } from "../../constants/apiPath"
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { useWallet } from "@solana/wallet-adapter-react"
import { useGlobalState } from "../../contexts/GlobalState"
import { phantomConnection } from "../../helpers/phantomConnection"
import { metaConnection } from "../../helpers/metaConnection"
import LinkWalletModal from "../linkWallet/LinkWalletModal"
import { linkProfileFromInside } from "../../apis/authApis"

const ethTokenList = [
  {
    _id: "00001",
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
    image:
      "https://atlantis-staging-bucket.s3.ap-south-1.amazonaws.com/auxiliary/images/image1748428174954.png",
    chainId: 10,
    chainImage:
      "https://atlantis-staging-bucket.s3.ap-south-1.amazonaws.com/auxiliary/images/image1730537606524.png",
    isUSDStableCoin: false,
    chainName: "optimism",
  },
  {
    _id: "00002",
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
    image:
      "https://atlantis-staging-bucket.s3.ap-south-1.amazonaws.com/auxiliary/images/image1748428174954.png",
    chainId: 8453,
    chainImage:
      "https://atlantis-staging-bucket.s3.ap-south-1.amazonaws.com/auxiliary/images/image1743617007174.jpg",
    isUSDStableCoin: false,
    chainName: "base",
  },
  {
    _id: "00003",
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
    image:
      "https://atlantis-staging-bucket.s3.ap-south-1.amazonaws.com/auxiliary/images/image1748428174954.png",
    chainId: 42161,
    chainImage:
      "https://atlantis-staging-bucket.s3.ap-south-1.amazonaws.com/auxiliary/images/image1743616326342.png",
    isUSDStableCoin: false,
    chainName: "arbitrum",
  },
  {
    _id: "00004",
    name: "Sol",
    symbol: "SOL",
    decimals: 9,
    image:
      "https://atlantis-staging-bucket.s3.ap-south-1.amazonaws.com/auxiliary/images/image1743616935585.jpg",

    chainImage:
      "https://atlantis-staging-bucket.s3.ap-south-1.amazonaws.com/auxiliary/images/image1743616935585.jpg",
    isUSDStableCoin: false,
    chainName: "solana",
  },
  {
    _id: "00005",
    name: "Celo",
    symbol: "CELO",
    decimals: 18,
    chainId: 42220,
    image:
      "https://atlantis-staging-bucket.s3.ap-south-1.amazonaws.com/auxiliary/images/image1744055426551.png",

    chainImage:
      "https://atlantis-staging-bucket.s3.ap-south-1.amazonaws.com/auxiliary/images/image1744055426551.png",
    isUSDStableCoin: false,
    chainName: "celo",
  },
]

function MintNFTFromMyCollection({ close }) {
  const myRef = useRef({ close })
  const { account } = useSDK()
  const { loading, startLoading, stopLoading } = useLoadingState()
  const wallet = useWallet()
  const { fetchData } = useHome()
  const [showLinkModal, setShowLinkModal] = useState("")
  const [walletToLink, setWalletToLink] = useState(null)
  const [pendingFormData, setPendingFormData] = useState(null)
  const [tokens, setTokens] = useState([])
  const [whitelistedTokens, setWhitelistedTokens] = useState([])
  const [chains, setChains] = useState([])
  const [isMinted, setIsMinted] = useState(false)
  const { state } = useAuth()
  const { state: landscapesState } = useGlobalState()

  const navigate = useNavigate()

  // useAutoSelectPhantom(close)
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
  const { landscapes } = landscapesState

  const { field: landscapeField } = useController({
    name: "landscape",
    control,
    rules: { required: "Please choose a landscape" },
  })

  const { field: chainField } = useController({
    name: "chain",
    control,
    rules: {
      validate: (value) => {
        if (!landscapeField.value) return "Please choose a landscape first"
        if (!value) return "Please choose a chain"
        return true
      },
    },
  })

  const { field: tokenField } = useController({
    name: "token",
    control,
    rules: {
      validate: (value) => {
        if (!chainField.value) return "Please choose a chain first"
        if (!value) return "Please choose a token"
        return true
      },
    },
  })

  const allowedChains = useMemo(() => {
    return (
      landscapeField.value?.contractAddresses?.map(
        (contract) => contract?.chainId
      ) || []
    )
  }, [landscapeField.value])

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

  useEffect(() => {
    async function fetchDataWrapper() {
      try {
        const [tokensRes, chainsRes] = await Promise.all([
          getTokens(),
          getChains(),
        ])
        const chainPresents = chainsRes?.data?.filter((chain) =>
          allowedChains.includes(chain?.chainId)
        )
        setTokens([...tokensRes?.data, ...ethTokenList])
        setChains(chainPresents)
      } catch (error) {
        console.log(error)
      }
    }
    fetchDataWrapper()
  }, [allowedChains])

  useEffect(() => {
    async function fetchAllowedTokens() {
      // Example: fetch tokens for the selected chain
      if (chainField?.value?.chainId) {
        const response = await getWhitelistedTokenAddresses(
          chainField.value.chainId,
          landscapeField.value?.contractAddresses.find(
            (c) => c.chainId === chainField?.value?.chainId
          )?.contractAddress
        )

        const arrayResponse = [...response]?.map((address) =>
          address?.toLowerCase()
        )

        setWhitelistedTokens(arrayResponse)
      } else {
      }
    }
    if (chainField?.value?.chainId) fetchAllowedTokens()
  }, [chainField?.value?.chainId, landscapeField.value?.contractAddresses])
  const allowedTokens = useMemo(() => {
    return tokens?.filter((token) => {
      if (
        token?.isUSDStableCoin &&
        token?.chainName?.toLowerCase() !== "solana"
      ) {
        return (
          token?.chainName === chainField?.value?.name &&
          whitelistedTokens?.includes(token?.address?.toLowerCase())
        )
      } else {
        return token?.chainName === chainField?.value?.name
      }
    })
  }, [tokens, chainField?.value?.name, whitelistedTokens])

  const onSubmit = async (data) => {
    const selectedContract = data?.landscape?.contractAddresses?.find(
      (contract) => contract.chainName === data?.token?.chainName
    )

    let { chainId, contractAddress, chainName } = selectedContract
    const uid = localStorage.getItem("referrerUID")

    if (chainName === "solana") {
      const phantom = wallet.wallets.find((w) => w.adapter.name === "Phantom")

      const phantomConnectionResponse = await phantomConnection(
        state?.citizen?.walletAddress,
        wallet
      )

      if (phantomConnectionResponse === "chainerror") {
        return
      } else if (!phantomConnectionResponse) {
        toast?.error(
          "Please try minting using the wallet linked to your profile"
        )
        return
      } else if (phantomConnectionResponse?.text === "changewallet") {
        setWalletToLink(phantomConnectionResponse.wallet)
        setPendingFormData(data)
        setShowLinkModal("solana")
        return
      } else {
        const { stateURIsForSolana, name, solanaTreasuryWalletAddress } =
          data?.landscape
        const metadataUri = stateURIsForSolana[1]
        const collectionMintString = selectedContract?.collectionAddress

        try {
          const connection = new Connection(RPC_ENDPOINT, "confirmed")

          startLoading()
          if (data?.token?.isUSDStableCoin) {
            const tokenBalance = await getSPLTokenBalance(
              phantomConnectionResponse,
              data?.token?.address
            )

            if (tokenBalance < MINTPRICE_USD) {
              toast.error(
                `Insufficient ${data?.token?.name}  : You need  ${MINTPRICE_USD} ${data?.token?.symbol}`
              )
              return
            }

            const transaction = await getMintTransactionWithStableCoin(
              metadataUri,
              name,
              collectionMintString,
              solanaTreasuryWalletAddress,
              connection,
              phantom?.adapter,
              data?.token?.address,
              data?.token?.decimals
            )

            const signature = await phantom.adapter.sendTransaction(
              transaction,
              connection
            )

            const confirmResult = await connection.confirmTransaction(
              signature,
              "confirmed"
            )

            if (confirmResult?.value?.err !== null) {
              toast.error(confirmResult?.value?.err)
              return
            } else {
              setTimeout(fetchData, 3000)
              if (uid) {
                navigate(`/minted?uid=${uid}`)
              } else {
                navigate("/minted")
              }
              // setIsMinted(true)
              // setTimeout(() => {
              //   close()
              //   navigate("/fund?from=minting")
              // }, 5000)
            }
          } else {
            const lamports = await connection.getBalance(
              phantom.adapter.publicKey
            )
            const solBalance = lamports / LAMPORTS_PER_SOL
            const mintPrice = await getMintPriceForSolana()

            if (solBalance < mintPrice) {
              toast.error(
                `Insufficient SOL : You need at least ${mintPrice} SOL`
              )
              return
            }

            const transaction = await getMintTransaction(
              metadataUri,
              name,
              collectionMintString,
              solanaTreasuryWalletAddress,
              connection,
              phantom?.adapter
            )

            const signature = await phantom.adapter.sendTransaction(
              transaction,
              connection
            )

            const confirmResult = await connection.confirmTransaction(
              signature,
              "confirmed"
            )

            if (confirmResult?.value?.err !== null) {
              toast.error(confirmResult?.value?.err)
              return
            } else {
              setTimeout(fetchData, 3000)
              if (uid) {
                navigate(`/minted?uid=${uid}`)
              } else {
                navigate("/minted")
              }
              // setIsMinted(true)
              // setTimeout(() => {
              //   close()
              //   navigate("/fund?from=minting")
              // }, 5000)
            }
          }
        } catch (error) {
          console.log(error, "see the error")
        } finally {
          stopLoading()
        }

        return
      }
    } else {
      try {
        startLoading()
        const metaMaskProvider = getMetaMaskProvider()

        const metaConnectionResponse = await metaConnection(
          state?.citizen?.evmAddress,
          chainId
        )

        if (metaConnectionResponse === "chainerror") {
          return
        } else if (!metaConnectionResponse) {
          toast?.error(
            "Please try minting using the wallet linked to your profile"
          )
          return
        } else if (metaConnectionResponse?.text === "changewallet") {
          setWalletToLink(metaConnectionResponse.wallet)
          setPendingFormData(data)
          setShowLinkModal("evm")
          return
        } else {
          if (data?.token?.isUSDStableCoin) {
            const requiredTokenAmount = await getMintPriceForEVMInStableCoin(
              contractAddress,
              chainId,
              data?.token?.address
            )

            const tokenBalance = await getTokenBalance(
              chainId,
              data?.token?.address,
              metaConnectionResponse
            )

            if (tokenBalance < requiredTokenAmount) {
              toast.error(
                `Insufficient ${data?.token?.name}  : You need  ${Number(
                  Number(requiredTokenAmount) / 10 ** data?.token?.decimals
                )?.toFixed(2)} ${data?.token?.symbol}`
              )
              return
            }

            const { success, code, result } = await mintNftWithToken(
              data?.token?.address,
              contractAddress,
              chainId
            )

            if (!success) {
              // toast.error(`May be winner has not linked metamask wallet in his "Impact Miner" account`);

              toast.error(code)
              return
            }
            if (success) {
              // integrate api to register funding

              setTimeout(() => {
                fetchData()
              }, 3000)

              if (uid) {
                navigate(`/minted?uid=${uid}`)
              } else {
                navigate("/minted")
              }
              // setIsMinted(true)
              // setTimeout(() => {
              //   close()
              //   navigate("/fund?from=minting")
              // }, 5000)
            }
          } else {
            const provider = new BrowserProvider(metaMaskProvider)
            console?.log("see balance")
            const signer = await provider.getSigner()
            const address = await signer.getAddress()
            const balance = await provider.getBalance(address)
            const balanceEth = parseFloat(formatEther(balance))

            const requiredEth = await getMintPriceForEVM(
              contractAddress,
              chainId
            )

            if (balanceEth < requiredEth) {
              toast.error(
                `Insufficient ${
                  chainId === 42220 ? "CELO" : "ETH"
                } : You need at least ${requiredEth}${
                  chainId === 42220 ? " CELO" : " ETH"
                }`
              )
              return
            }

            const { success, code, result } = await mintNFT(
              contractAddress,
              chainId
            )

            if (!success) {
              // toast.error(`May be winner has not linked metamask wallet in his "Impact Miner" account`);

              toast.error(code)
              return
            }
            if (success) {
              // integrate api to register funding

              setTimeout(() => {
                fetchData()
              }, 3000)

              if (uid) {
                navigate(`/minted?uid=${uid}`)
              } else {
                navigate("/minted")
              }
              // setIsMinted(true)
              // setTimeout(() => {
              //   close()
              //   navigate("/fund?from=minting")
              // }, 5000)
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
  }

  return (
    <Overlay>
      <div
        className={`absolute rounded-lg left-[50%] p-6 w-[90%]   md:w-[40%] ${
          isMinted ? "bg-[rgba(52,53,52)] backdrop-blur-3xl" : "bg-[#1C1C1C] "
        }  border border-[#2a2a2a]   translate-x-[-50%] translate-y-[-50%] top-[50%]`}
      >
        <div ref={myRef} className="relative w-full ">
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
          {isMinted ? (
            <div className="flex flex-col relative items-center    justify-center">
              <div className="relative w-full h-[32.3125rem] ">
                {/* Background layer with opacity */}
                <div className="absolute inset-0 bg-nft-gradient opacity-15 pointer-events-none z-0"></div>

                {/* Content layer */}
                <div className="absolute top-[50%] w-full left-[50%]  translate-x-[-50%] translate-y-[-50%] z-10 text-center">
                  <div className="relative w-full">
                    <div className="flex flex-col items-center">
                      <p className="text-3xl absolute w-full top-0 left-[50%] translate-x-[-50%] md:text-5xl   font-semibold">
                        New NFT Minted
                      </p>
                      <img
                        className="w-[23.375rem]"
                        src={mintedAnimation}
                        alt="minted-animation"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : showLinkModal ? (
            showLinkModal === "solana" ? (
              <LinkWalletModal
                text={"Link & Mint"}
                onYes={async () => {
                  const data = pendingFormData
                  const selectedContract =
                    data?.landscape?.contractAddresses?.find(
                      (contract) =>
                        contract.chainName === data?.token?.chainName
                    )

                  let { chainId, contractAddress, chainName } = selectedContract
                  const phantom = wallet.wallets.find(
                    (w) => w.adapter.name === "Phantom"
                  )
                  const {
                    stateURIsForSolana,
                    name,
                    solanaTreasuryWalletAddress,
                  } = data?.landscape
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

                    const connection = new Connection(RPC_ENDPOINT, "confirmed")

                    if (data?.token?.isUSDStableCoin) {
                      const tokenBalance = await getSPLTokenBalance(
                        walletToLink,
                        data?.token?.address
                      )

                      if (tokenBalance < MINTPRICE_USD) {
                        toast.error(
                          `Insufficient ${data?.token?.name}  : You need  ${MINTPRICE_USD} ${data?.token?.symbol}`
                        )
                        return
                      }

                      const transaction =
                        await getMintTransactionWithStableCoin(
                          metadataUri,
                          name,
                          collectionMintString,
                          solanaTreasuryWalletAddress,
                          connection,
                          phantom?.adapter,
                          data?.token?.address,
                          data?.token?.decimals
                        )

                      const signature = await phantom.adapter.sendTransaction(
                        transaction,
                        connection
                      )

                      const confirmResult = await connection.confirmTransaction(
                        signature,
                        "confirmed"
                      )

                      if (confirmResult?.value?.err !== null) {
                        toast.error(confirmResult?.value?.err)
                        return
                      } else {
                        setTimeout(fetchData, 3000)
                        if (uid) {
                          navigate(`/minted?uid=${uid}`)
                        } else {
                          navigate("/minted")
                        }
                        // setIsMinted(true)
                        // setTimeout(() => {
                        //   close()
                        //   navigate("/fund?from=minting")
                        // }, 5000)
                      }
                    } else {
                      const lamports = await connection.getBalance(
                        phantom.adapter.publicKey
                      )
                      const solBalance = lamports / LAMPORTS_PER_SOL
                      const mintPrice = await getMintPriceForSolana()

                      if (solBalance < mintPrice) {
                        toast.error(
                          `Insufficient SOL : You need at least ${mintPrice} SOL`
                        )
                        return
                      }

                      const transaction = await getMintTransaction(
                        metadataUri,
                        name,
                        collectionMintString,
                        solanaTreasuryWalletAddress,
                        connection,
                        phantom?.adapter
                      )

                      const signature = await phantom.adapter.sendTransaction(
                        transaction,
                        connection
                      )

                      const confirmResult = await connection.confirmTransaction(
                        signature,
                        "confirmed"
                      )

                      if (confirmResult?.value?.err !== null) {
                        toast.error(confirmResult?.value?.err)
                        return
                      } else {
                        setTimeout(fetchData, 3000)
                        if (uid) {
                          navigate(`/minted?uid=${uid}`)
                        } else {
                          navigate("/minted")
                        }
                        // setIsMinted(true)
                        // setTimeout(() => {
                        //   close()
                        //   navigate("/fund?from=minting")
                        // }, 5000)
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
            ) : (
              <LinkWalletModal
                text={"Link & Mint"}
                onYes={async () => {
                  const data = pendingFormData
                  const selectedContract =
                    data?.landscape?.contractAddresses?.find(
                      (contract) =>
                        contract.chainName === data?.token?.chainName
                    )

                  let { chainId, contractAddress, chainName } = selectedContract
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

                    if (data?.token?.isUSDStableCoin) {
                      const requiredTokenAmount =
                        await getMintPriceForEVMInStableCoin(
                          contractAddress,
                          chainId,
                          data?.token?.address
                        )

                      const tokenBalance = await getTokenBalance(
                        chainId,
                        data?.token?.address,
                        walletToLink
                      )

                      if (tokenBalance < requiredTokenAmount) {
                        toast.error(
                          `Insufficient ${
                            data?.token?.name
                          }  : You need  ${Number(
                            Number(requiredTokenAmount) /
                              10 ** data?.token?.decimals
                          )?.toFixed(2)} ${data?.token?.symbol}`
                        )
                        return
                      }

                      const { success, code, result } = await mintNftWithToken(
                        data?.token?.address,
                        contractAddress,
                        chainId
                      )

                      if (!success) {
                        // toast.error(`May be winner has not linked metamask wallet in his "Impact Miner" account`);

                        toast.error(code)
                        return
                      }
                      if (success) {
                        // integrate api to register funding

                        setTimeout(() => {
                          fetchData()
                        }, 3000)

                        if (uid) {
                          navigate(`/minted?uid=${uid}`)
                        } else {
                          navigate("/minted")
                        }
                        // setIsMinted(true)
                        // setTimeout(() => {
                        //   close()
                        //   navigate("/fund?from=minting")
                        // }, 5000)
                      }
                    } else {
                      const metaMaskProvider = await getMetaMaskProvider()
                      const provider = new BrowserProvider(metaMaskProvider)
                      console?.log("see balance")
                      const signer = await provider.getSigner()
                      const address = await signer.getAddress()
                      const balance = await provider.getBalance(address)
                      const balanceEth = parseFloat(formatEther(balance))

                      const requiredEth = await getMintPriceForEVM(
                        contractAddress,
                        chainId
                      )

                      if (balanceEth < requiredEth) {
                        toast.error(
                          `Insufficient ${
                            chainId === 42220 ? "CELO" : "ETH"
                          } : You need at least ${requiredEth}${
                            chainId === 42220 ? " CELO" : " ETH"
                          }`
                        )
                        return
                      }

                      const { success, code, result } = await mintNFT(
                        contractAddress,
                        chainId
                      )

                      if (!success) {
                        // toast.error(`May be winner has not linked metamask wallet in his "Impact Miner" account`);

                        toast.error(code)
                        return
                      }
                      if (success) {
                        // integrate api to register funding

                        setTimeout(() => {
                          fetchData()
                        }, 3000)

                        if (uid) {
                          navigate(`/minted?uid=${uid}`)
                        } else {
                          navigate("/minted")
                        }
                        // setIsMinted(true)
                        // setTimeout(() => {
                        //   close()
                        //   navigate("/fund?from=minting")
                        // }, 5000)
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
                <p className="text-[#fff] text-2xl font-bold">Mint Now</p>
                <p className="text-[#B2B2B2] text-sm ">
                  A $5 mint price will be required to mint a new NFT
                </p>
              </div>
              <div className="mt-4">
                <form action="" onSubmit={handleSubmit(onSubmit)}>
                  <div className="w-full">
                    <div className="w-full">
                      <p className="text-[#B2B2B2] font-semibold">
                        Choose Landscape
                      </p>
                      <div className="relative w-full ">
                        <Dropdown
                          data1Heading={
                            <div className="sticky top-0  bg-primaryBg z-10 ">
                              <p className="text-white">
                                Progress in Landscapes:
                              </p>
                              <p className="text-[#ADADAD] text-sm">
                                Each landscape can only accommodate 400 fully
                                transformed green pills. Ex, 50% means 200/400
                                slots for green pills have been filled
                              </p>
                            </div>
                          }
                          modifyLabel={(listItem) => {
                            return (
                              <span className="flex items-center text-[#A3A3A3] gap-5">
                                <span>{listItem?.name} </span>
                              </span>
                            )
                          }}
                          data={landscapes}
                          selected={landscapeField.value}
                          onSelected={(selected) => {
                            landscapeField.onChange(selected)
                            setValue("chain", null)
                            setValue("token", null)
                            clearErrors(["chain", "token"])
                          }}
                          modifySelected={(selected) => {
                            return (
                              <div className="flex items-center gap-5">
                                <span className="text-[#A3A3A3]">
                                  {selected.name}
                                </span>
                              </div>
                            )
                          }}
                          noSelectedText="Choose Landscape"
                          btnClass=""
                          w="w-full"
                        />
                      </div>
                    </div>
                    <p className="text-[#8C8C8C] text-sm font-semibold">
                      {errors?.landscape && errors?.landscape?.message}
                    </p>
                  </div>

                  <div className="flex items-center w-full gap-6 mt-5 ">
                    <div className="w-full">
                      <p className="text-[#B2B2B2] font-semibold">
                        Chain to Mint on
                      </p>
                      <div className="relative w-full ">
                        <Dropdown
                          disabled={!landscapeField.value}
                          modifyLabel={(listItem) => {
                            return (
                              <span className="flex items-center text-[#A3A3A3] gap-5">
                                <img
                                  className="w-5 h-5 rounded-full "
                                  src={listItem?.image}
                                  alt=""
                                />
                                {/* chainImage */}
                                <span>{listItem?.name} </span>
                              </span>
                            )
                          }}
                          data={chains}
                          selected={chainField.value}
                          onSelected={(selected) => {
                            chainField.onChange(selected)
                            setValue("token", null)
                            clearErrors("token")
                          }}
                          modifySelected={(selected) => {
                            return (
                              <div className="flex items-center gap-5">
                                <div className="relative">
                                  <img
                                    className="w-5 h-5 rounded-full "
                                    src={selected?.image}
                                    alt=""
                                  />
                                  {/* <img
                                    className="w-2 h-2 absolute top-0 right-0 rounded-full "
                                    src={selected?.chainImage}
                                    alt=""
                                  /> */}
                                </div>

                                <span>{selected.name}</span>
                              </div>
                            )
                          }}
                          noSelectedText="Choose Chain"
                          btnClass={`${
                            !landscapeField.value ? "cursor-not-allowed" : " "
                          }`}
                          w="w-full"
                        />
                      </div>
                    </div>
                    <div className="w-full">
                      <p className="text-[#B2B2B2] font-semibold">Token</p>

                      <div className="flex items-center">
                        <div className="relative w-full ">
                          <Dropdown
                            disabled={!chainField.value}
                            modifyLabel={(listItem) => {
                              return (
                                <div className="flex items-center text-[#A3A3A3] gap-5">
                                  <div className="relative">
                                    <img
                                      className="w-5 h-5 rounded-full "
                                      src={listItem?.image}
                                      alt=""
                                    />

                                    <img
                                      className="w-3 h-3 absolute -top-1 -right-1 object-cover rounded-full "
                                      src={listItem?.chainImage}
                                      alt=""
                                    />
                                  </div>

                                  <span>{listItem?.symbol} </span>
                                </div>
                              )
                            }}
                            data={allowedTokens}
                            isSymbol={true}
                            selected={tokenField.value}
                            onSelected={(selected) =>
                              tokenField.onChange(selected)
                            }
                            noSelectedText="Choose Token"
                            btnClass={`${
                              !chainField.value ? "cursor-not-allowed" : ""
                            }`}
                            w="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mt-1 ">
                    <p className="text-[#8C8C8C] w-[50%] text-sm font-semibold">
                      {Object.keys(errors)?.length
                        ? errors?.chain?.message
                        : ""}
                    </p>
                    <p className="text-[#8C8C8C] w-[50%] text-sm font-semibold">
                      {Object.keys(errors)?.length
                        ? errors?.token?.message
                        : ""}
                    </p>
                  </div>

                  <div className="mt-5">
                    <p className="text-[#B2B2B2] font-semibold">Total Amount</p>
                    <p className="text-3xl ">$5</p>
                  </div>

                  <div className="mt-5 flex items-center justify-end">
                    <button className=" bg-[#426A61] flex items-center py-3 px-4 justify-center gap-1 text-white border w-[11rem] border-[#699F84] rounded-lg ">
                      {loading ? (
                        <Loader color="fill-[#326F58]" />
                      ) : (
                        <>
                          <span>Mint Now</span> <ArrowRight size={14} />
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

export default MintNFTFromMyCollection
