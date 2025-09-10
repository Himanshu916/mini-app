import React, { useState } from "react"
import { useController, useForm } from "react-hook-form"
import Input from "../../components/Input"
import GradientBorder from "../../components/GradientBorder"
import Loader from "../../components/Loader"
import { useLoadingState } from "../../hooks/useLoader"
import { useNavigate } from "react-router-dom"
import {
  emailExistOrNot,
  linkEmailProfile,
  sendOtpEmail,
  verifyOtpEmail,
} from "../../apis/otpApis"

import { getAuth, signInWithCustomToken } from "firebase/auth"
import { toast } from "sonner"
import { useAuth } from "../../contexts/AuthContext"
import { verifyProfile } from "../../apis/authApis"

import { useSDK } from "@metamask/sdk-react"
import { useGlobalState } from "../../contexts/GlobalState"
const auth = getAuth()
const EmailForm = ({ isEVM, wallet, close }) => {
  const { state, dispatch, setIsNoUserFound } = useAuth()
  const { sdk } = useSDK()
  const { setShowAnimation } = useGlobalState()
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm()
  const { loading, startLoading, stopLoading } = useLoadingState()
  const [otpView, setOtpView] = useState(false)

  const [otp, setOtp] = useState("")
  const [otpToken, setOtpToken] = useState("")
  const {
    loading: requesting,
    startLoading: startRequesting,
    stopLoading: stopRequesting,
  } = useLoadingState()
  const [OtpError, setOtpError] = useState(false)
  const navigate = useNavigate()
  const { field: emailField } = useController({
    name: "email",
    control,
    rules: {
      required: "Please enter your email",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Please enter a valid email address",
      },
    },
  })

  const { field: otpField } = useController({
    name: "otp",
    control,
    rules: {
      required: otpView ? "Please enter your otp" : false,
    },
  })

  const getOtpCall = async (email) => {
    try {
      startRequesting()
      const otpCall = await sendOtpEmail(email)

      setOtpToken(otpCall.otpToken)

      setOtpView(true)
    } catch (err) {
      console.log("error", err)
    } finally {
      stopRequesting()
    }
  }

  const verifyOtp = async (email, otp) => {
    try {
      startRequesting()
      const verified = await verifyOtpEmail(email, otp, otpToken)
      if (!verified) {
        const error = new Error("Please enter correct OTP")
        error.code = 404
        throw error
      }

      if (verified.customToken && verified.customToken.length > 0) {
        await signInWithCustomToken(auth, verified.customToken)
          .then(async (userCredential) => {
            // Get the ID token
            const idToken = await userCredential.user.getIdToken(true) // Force refresh token

            // Link email profile and pass ID token
            try {
              const response = await linkEmailProfile(isEVM, wallet, idToken)
              if (response?.response?.data?.code === 400) {
                setIsNoUserFound(false)
                dispatch({
                  type: "logout",
                  payload: {
                    citizen: null,
                    token: null,
                    firstTime: true,
                  },
                })
                toast.error(response?.response?.data?.message)
                return
              }

              if (response?.data?.success) {
                const timeStamp2 = new Date().toISOString()
                const message2 = `impact-landscapes:${timeStamp2}`
                let signature2

                if (state?.walletType === "metamask") {
                  signature2 = await sdk.connectAndSign({ msg: message2 })
                }
                if (state?.walletType === "phantom") {
                  const encodedMessage = new TextEncoder().encode(message2)
                  const signedMessage = await window.solana.signMessage(
                    encodedMessage,
                    "utf8"
                  )

                  signature2 = Array.from(signedMessage.signature).join(",")
                }
                const verifiedAfterLinking = await verifyProfile({
                  wallet: wallet,
                  timestamp: timeStamp2,
                  signature: signature2,
                  isEVM: isEVM,
                })

                dispatch({
                  type: "login",
                  payload: {
                    citizen: verifiedAfterLinking?.userInfo?.citizen,
                    token: verifiedAfterLinking?.userInfo?.token,
                    walletType: state?.walletType,
                    firstTime:
                      verifiedAfterLinking?.status === 200 ? false : true,
                    loginAccount: wallet,
                  },
                })
                setShowAnimation(true)
                navigate("/", { replace: true })
              }
            } catch (error) {
              console.error("Error linking email profile:", error)
            }
          })
          .catch((error) => {
            console.error("Error signing in with custom token:", error)
          })
      } else {
        // setLoader(false)
        alert(verified.message + "him")
      }
    } catch (err) {
      stopRequesting()
      // setOtpView(false);

      if (err?.code === 404) {
        setOtpError(true)
        setValue("otp", "")
        // setTimeout(() => {
        //     setOtpError(false);
        // }, 3000);
        setOtp("")
        toast.error("Invalid OTP , Please enter correct OTP")
        return
      }
      toast.error(
        "Mismatch between email and otp,Please enter your email again!"
      )
    } finally {
    }
  }

  const onSubmit = async (data) => {
    const response = await emailExistOrNot(data?.email)

    if (state?.chainType === "Solana") {
      if (response?.data?.walletAddress) {
        setIsNoUserFound(false)
        dispatch({
          type: "logout",
          payload: {
            citizen: null,
            token: null,
            firstTime: true,
          },
        })
        close()
        toast.error("Another solana wallet is already linked to the profile")
        return
      }
    }

    if (state?.chainType === "EVM") {
      if (response?.data?.evmAddress) {
        setIsNoUserFound(false)
        dispatch({
          type: "logout",
          payload: {
            citizen: null,
            token: null,
            firstTime: true,
          },
        })
        close()
        toast.error("Another EVM wallet is already linked to the profile")
        return
      }
    }

    if (response?.response?.data?.code === 404) {
      setIsNoUserFound(false)
      dispatch({
        type: "logout",
        payload: {
          citizen: null,
          token: null,
          firstTime: true,
        },
      })
      toast.error(response?.response?.data?.message)
      close()
      return
    }

    if (otpView) {
      verifyOtp(data?.email, data?.otp)
    } else {
      setOtpError(false)
      getOtpCall(data?.email)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className=" text-black ">
        {!otpView ? (
          <div>
            <div className="">
              <p className={"text-white font-semibold leading-5 mb-1 "}>
                Email
              </p>
              <div>
                <Input
                  {...emailField}
                  error={errors?.email?.message}
                  type="text"
                  placeholder={"Type email here"}
                  className={"w-[100%]"}
                />
              </div>
            </div>
            <div className="flex flex-col mt-7 ">
              <p className={"text-white font-semibold leading-5 mb-1"}>
                Get OTP
              </p>
              <GradientBorder
                radiusBorder={".60rem"}
                color2={"#506C6600"}
                color1={"#699F84"}
                bg="bg-[#426A61]"
                width="w-full"
              >
                <button className=" px-4 w-full text-center text-white  py-2 flex justify-center items-center gap-2  ">
                  {loading ? <Loader /> : "Request OTP"}
                </button>
              </GradientBorder>
            </div>
          </div>
        ) : (
          <div>
            <div className="">
              <p className={"text-white font-medium mb-1"} type={"large"}>
                Email
              </p>
              <div>
                <Input
                  {...emailField}
                  error={errors?.email?.message}
                  disabled={true}
                  type="text"
                  placeholder={"Enter your email"}
                  className={"w-[100%]"}
                />
              </div>
            </div>
            <div className="">
              <p className={"text-white font-medium mb-1"} type={"large"}>
                Enter OTP
              </p>
              <div>
                <Input
                  {...otpField}
                  // error={errors?.otp?.message}
                  type="number"
                  maxLength={6}
                  placeholder={"Enter your otp"}
                  error={
                    OtpError
                      ? " Invalid OTP,please try again"
                      : errors?.otp?.message
                  }
                  restrictLength={(e) => {
                    if (e.target.value.length > 6) {
                      e.target.value = e.target.value.slice(0, 6)
                    }
                  }}
                  helpUser={
                    <span
                      onClick={() => {
                        setOtpError(false)
                        getOtpCall(emailField?.value)
                      }}
                      className=" ml-auto text-white underline cursor-pointer "
                    >
                      Resend Code
                    </span>
                  }
                  className={"w-[100%]"}
                />
              </div>
            </div>
            <div className="flex mt-7 items-center justify-end">
              <GradientBorder
                radiusBorder={".60rem"}
                color2={"#506C6600"}
                color1={"#699F84"}
                bg="bg-[#426A61]"
                width="w-full"
              >
                <button className=" px-4 w-full text-center text-white  py-2 flex justify-center items-center gap-2  ">
                  {loading ? <Loader /> : "Submit"}
                </button>
              </GradientBorder>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

export default EmailForm
