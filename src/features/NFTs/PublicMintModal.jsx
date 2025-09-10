import { useEffect, useMemo, useRef, useState } from "react"
import Overlay from "../../components/Overlay"
import { ArrowRight } from "lucide-react"
import mintedAnimation from "../../assets/gifs/mintedAnimation.gif"
import Dropdown from "../../components/ui/Dropdown"
import { getChains2, getTokens2 } from "../../apis/precisionFunding"
import { useController, useForm } from "react-hook-form"
import { useLoadingState } from "../../hooks/useLoader"
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
  mintNftWithToken,
} from "../../blockchain/minting/mintNFT"
import { useHome } from "../../contexts/HomeContext"
import Loader from "../../components/Loader"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { MINTPRICE_USD, RPC_ENDPOINT } from "../../constants/apiPath"
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js"

import { useGlobalState } from "../../contexts/GlobalState"
import {
  useConnect,
  useAccount,
  useWalletClient,
  useSwitchChain,
  useSendTransaction,
} from "wagmi"
import { ethers } from "ethers"
import { getRpcUrl } from "../../apis/getRPCURL"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
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

function PublicMintModal({
  close,
  contractAddresses,
  landscape,
  dataAfterRedirect,
  isMinted,
  loading,
  startLoading,
  stopLoading,
  setIsMinted,
  address,
  walletClient,
  isConnected,
}) {
  const myRef = useRef({ close })
  const wallet = useWallet()
  const { publicKey } = wallet
  const solanaAddress = publicKey?.toBase58() ?? ""
  const { state: landscapesState } = useGlobalState()
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain()

  const [whitelistedTokens, setWhitelistedTokens] = useState([])
  const {
    sendTransaction,
    error: sendTxError,
    isError: isSendTxError,
    isPending: isSendTxPending,
  } = useSendTransaction()
  const { fetchData } = useHome()
  const [tokens, setTokens] = useState([])
  const [chains, setChains] = useState([])

  const { state, dispatch } = useAuth()

  const navigate = useNavigate()

  const [balanceEth, setBalanceEth] = useState(0)

  // useAutoSelectPhantom(close)
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      chain: dataAfterRedirect?.chain || null,
      token: dataAfterRedirect?.token || null,
    },
  })

  const { field: chainField } = useController({
    name: "chain",
    control,
    rules: { required: "Please choose a chain" },
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
    return contractAddresses?.map((contract) => contract?.chainId) || []
  }, [contractAddresses])

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
          getTokens2(),
          getChains2(),
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
          contractAddresses.find(
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
  }, [chainField?.value?.chainId])

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

  useEffect(() => {
    async function fetchBalance() {
      if (isConnected && address && chainField.value?.chainId) {
        try {
          console.log(chainField.value.chainId, "chain id value")
          const rpcUrl = getRpcUrl(chainField.value.chainId)
          console.log(rpcUrl, "rpc url ")
          const provider = new ethers.JsonRpcProvider(rpcUrl)
          const rawBalance = await provider.getBalance(address)
          console.log(rawBalance, "raw balance")
          console.log(Number(ethers.formatEther(rawBalance)), "setting balance")
          setBalanceEth(Number(ethers.formatEther(rawBalance)))
        } catch (err) {
          setBalanceEth(0)
        }
      } else {
        setBalanceEth(0)
      }
    }
    fetchBalance()
  }, [isConnected, address, chainField.value?.chainId])

  const onSubmitMint = async (data) => {
    const selectedContract = contractAddresses?.find(
      (contract) => contract.chainName === data?.token?.chainName
    )

    let { chainId, contractAddress, chainName } = selectedContract

    const uid = localStorage.getItem("referrerUID")

    if (chainName !== "solana") {
      try {
        startLoading()
        // Smooth chain switch for EVM using wagmi's useSwitchChain

        // Check if Farcaster wallet is connected
        if (!isConnected || !walletClient) {
          toast.error("Please connect your Farcaster wallet first")
          return
        }

        // Get the user address from wagmi
        const userAddress = address
        console.log(data, data?.token, "this is data token where is undefined")
        if (data?.token?.isUSDStableCoin) {
          const requiredTokenAmount = await getMintPriceForEVMInStableCoin(
            contractAddress,
            chainId,
            data?.token?.address
          )

          const tokenBalance = await getTokenBalance(
            chainId,
            data?.token?.address,
            userAddress
          )

          if (tokenBalance < requiredTokenAmount) {
            toast.error(
              `Insufficient ${data?.token?.name}  : You need  ${Number(
                Number(requiredTokenAmount) / 10 ** data?.token?.decimals
              )?.toFixed(2)} ${data?.token?.symbol}`
            )
            return
          }

          // Use wagmi wallet client for minting
          const { success, code, result } = await mintNftWithToken(
            data?.token?.address,
            contractAddress,
            chainId,
            walletClient
          )

          if (!success) {
            toast.error(code)
            return
          }
          if (success) {
            setIsMinted(true)
            setTimeout(() => {
              close()
              setIsMinted(false)
            }, 5000)
          }
        } else {
          const requiredEth = await getMintPriceForEVM(contractAddress, chainId)

          if (balanceEth < requiredEth) {
            toast.error(
              `Insufficient ${
                chainId === 42220 ? "CELO" : "ETH"
              } : You need at least ${requiredEth}${
                chainId === 42220
                  ? ` CELO  and you have ${balanceEth}  `
                  : " ETH"
              }`
            )
            return
          }

          // Use wagmi wallet client for minting
          const { success, code, result } = await mintNFT(
            contractAddress,
            chainId,
            walletClient
          )

          if (!success) {
            toast.error(code)
            return
          }
          if (success) {
            setIsMinted(true)
            setTimeout(() => {
              close()
              setIsMinted(false)
            }, 5000)
          }
        }
      } catch (err) {
        console.log(err, "1alphas")
        toast.error("An error occurred while processing your request")
      } finally {
        stopLoading()
      }
    } else {
      // For Solana, we only want to use Farcaster wallet

      if (solanaAddress) {
        // Continue with minting logic...
        const { stateURIsForSolana, name, solanaTreasuryWalletAddress } =
          landscape
        const metadataUri = stateURIsForSolana[1]
        const collectionMintString = selectedContract?.collectionAddress

        try {
          const connection = new Connection(RPC_ENDPOINT, "confirmed")

          startLoading()
          if (data?.token?.isUSDStableCoin) {
            const tokenBalance = await getSPLTokenBalance(
              solanaAddress,
              data?.token?.address
            )

            if (tokenBalance < MINTPRICE_USD) {
              toast.error(
                `Insufficient ${data?.token?.name}  : You need  ${MINTPRICE_USD} ${data?.token?.symbol}`
              )
              return
            }

            console.log(
              wallet,
              "before get mint transaction",
              metadataUri,
              name,
              collectionMintString,
              solanaTreasuryWalletAddress,
              connection,
              wallet,
              data?.token?.address,
              data?.token?.decimals
            )
            // Use wallet from useWallet() for Farcaster
            const transaction = await getMintTransactionWithStableCoin(
              metadataUri,
              name,
              collectionMintString,
              solanaTreasuryWalletAddress,
              connection,
              wallet,
              data?.token?.address,
              data?.token?.decimals
            )

            console.log("m>>>>>>>>>>>>", transaction)

            const signature = await wallet.sendTransaction(
              transaction,
              connection
            )
            console.log("n>>>>>>>>>>>>", signature)
            // const confirmResult = await connection.confirmTransaction(
            //   signature,
            //   "confirmed"
            // )
            // console.log("o>>>>>>>>>>>>", confirmResult)
            if (!signature) {
              toast.error("Unable to get signature")
              return
            } else {
              setIsMinted(true)
              setTimeout(() => {
                close()
                setIsMinted(false)
              }, 5000)
            }
          } else {
            const lamports = await connection.getBalance(wallet?.publicKey)
            const solBalance = lamports / LAMPORTS_PER_SOL
            const mintPrice = await getMintPriceForSolana()

            if (solBalance < mintPrice) {
              toast.error(
                `Insufficient SOL : You need at least ${mintPrice} SOL`
              )
              return
            }

            // Use wallet from useWallet() for Farcaster
            const transaction = await getMintTransaction(
              metadataUri,
              name,
              collectionMintString,
              solanaTreasuryWalletAddress,
              connection,
              wallet
            )

            const signature = await wallet.sendTransaction(
              transaction,
              connection
            )
            if (!signature) {
              toast.error("Unable to get signature")
              return
            } else {
              setIsMinted(true)
              setTimeout(() => {
                close()
                setIsMinted(false)
              }, 5000)
            }
          }
        } catch (error) {
          console.log(error, "see the error")
        } finally {
          stopLoading()
        }

        return
      } else {
        toast.error("Please connect your Farcaster wallet to mint on Solana")
        return
      }
    }
  }

  const onSubmit = async (data) => {
    if (data?.token?.chainName === "solana") {
      // For Solana, we only want to use Farcaster wallet
      if (publicKey) {
        // Check if this is actually a Farcaster wallet (not Phantom)
        const isFarcasterWallet =
          publicKey?.adapter?.name === "Farcaster" ||
          publicKey?.adapter?.name === "FarcasterSolanaWallet"

        if (isFarcasterWallet) {
          onSubmitMint(data)
        } else {
          toast.error("Please use Farcaster wallet for Solana transactions")
          return
        }
      } else {
        toast.error("Please connect your Farcaster wallet to mint on Solana")
        return
      }
    } else {
      onSubmitMint(data)
    }
  }
  useEffect(() => {
    console.log(solanaAddress, "solana inside use")
  }, [solanaAddress])

  console.log(solanaAddress, "hero", publicKey, "testing solana now")
  console.log(
    walletClient,
    isConnected,
    address,
    "this is wallet client inside modal"
  )
  return (
    <Overlay>
      <div
        className={`absolute rounded-lg left-[50%] p-6 w-[90%]   md:w-[40%] ${
          isMinted ? " bg-[rgba(52,53,52)] backdrop-blur-3xl" : "bg-[#1C1C1C] "
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
          ) : (
            <div>
              <div className="flex flex-col  border-b border-[#2D2D2D] pb-4 ">
                <p className="text-[#fff] text-2xl font-bold">Mint Now</p>
                <p className="text-[#B2B2B2] text-sm ">
                  A $5 mint price will be required to mint a new NFT
                </p>
              </div>
              <div className="mt-4">
                <form action="" onSubmit={handleSubmit(onSubmitMint)}>
                  <div className="flex items-center w-full gap-6 mt-5 ">
                    <div className="w-full">
                      <p className="text-[#B2B2B2] font-semibold">
                        Chain to Mint on
                      </p>
                      <div className="relative w-full ">
                        <Dropdown
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
                          onSelected={async (selected) => {
                            chainField.onChange(selected)
                            setValue("token", null)
                            clearErrors("token")
                            if (walletClient?.chain?.id !== selected?.chainId) {
                              try {
                                await switchChain({
                                  chainId: selected?.chainId,
                                })
                                await new Promise((res) => setTimeout(res, 500))
                              } catch (err) {
                                toast.error(
                                  "Automatic chain switch failed. Please switch to the correct chain in your Farcaster wallet and try again." +
                                    walletClient?.chain?.id
                                )
                              }
                            }
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
                          btnClass=""
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
                    <button
                      className=" bg-[#426A61] flex items-center py-3 px-4 justify-center gap-1 text-white border w-[11rem] border-[#699F84] rounded-lg "
                      disabled={loading || isSwitchingChain}
                    >
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

export default PublicMintModal
