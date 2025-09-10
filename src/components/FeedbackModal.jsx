import { useEffect, useRef, useState } from "react"
import { useLoadingState } from "../hooks/useLoader"
import { useController, useForm } from "react-hook-form"
import { toast } from "sonner"
import Overlay from "./Overlay"
import Heading from "./Heading"
import Dropdown from "./ui/Dropdown"
import Input from "./Input"
import Loader from "./Loader"
import GradientBorder from "./GradientBorder"

const issuesData = [
  "General Feedback",
  "Feature Request",
  "Bug Report",
  "User Interface (UI) Suggestions",
  "User Experience (UX) Improvements",
  "Performance Issues",
  "Content Feedback",
  "Integration Issues",
  "Security Concerns",
  "Billing and Payments",
  "Accessibility Suggestions",
  "Other",
]

function FeedbackModal({ close }) {
  const myRef = useRef(null)
  const { loading, startLoading, stopLoading } = useLoadingState()
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    control,
    formState: { errors },
  } = useForm()
  const { field: issueField } = useController({
    name: "issue",
    control,
    rules: { required: "Please choose an issue" },
  })
  const { field: feedbackField } = useController({
    name: "feedback",
    control,
    rules: {
      required: "Please enter a feedback",
      maxLength: {
        value: 1000,
        message: "The maximum length is 1,000 characters",
      },
    },
  })
  // const [selectedIssue, setSelectedIssue] = useState('');
  // const [feedbackContent, setFeedbackContent] = useState('');
  // const [email, setEmail] = useState('');
  // const [status, setStatus] = useState('');

  useEffect(() => {
    function handleClick(e) {
      if (myRef.current && !myRef.current.contains(e.target)) {
        close()
      }
    }

    document.addEventListener("click", handleClick, true)
    return () => document.removeEventListener("click", handleClick, true)
  }, [close])

  const onSubmit = async (data) => {
    try {
      startLoading()
      const res = await submitFeedback({
        feedback: `${data.issue}: ${data.feedback}`,
      })

      if (res?.success) {
        toast?.success("Feedback submitted successfully")
      }
    } catch (error) {
      console.error(error)
    } finally {
      stopLoading()

      close()
    }
  }

  return (
    <Overlay>
      <div
        ref={myRef}
        className="absolute rounded-lg left-[50%] w-[588px] bg-[#1c1c1c] translate-x-[-50%] translate-y-[-50%] top-[50%]"
      >
        <div className="relative modal overflow-hidden p-7">
          <button
            className="  absolute z-[9999] top-4 right-4  rounded-full  "
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
          <div className="rounded-md overflow-hidden">
            {/* <img className="w-[100%]" src={feedback} alt="feedback-banner" /> */}
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 "
          >
            <Heading className="font-bold text-modalHeading" type="small">
              We'd Love to Hear from you
            </Heading>

            <div className="relative">
              <Dropdown
                data={issuesData}
                w="w-full"
                selected={issueField.value}
                onSelected={issueField.onChange}
                noSelectedText={
                  <span className="flex items-center gap-[7px]">
                    <span>Select issue</span>
                  </span>
                }
              />
              <p className="text-foundryRed w-64 ">
                {errors?.issue?.message && errors?.issue?.message}
              </p>
            </div>

            <div>
              <Input
                {...feedbackField}
                type="textArea"
                placeholder="Tell us more about it"
                className="w-[100%] h-44"
              />
              <p className="text-foundryRed w-64 ">
                {errors?.feedback?.message && errors?.feedback?.message}
              </p>
            </div>

            <div className="flex justify-end">
              <GradientBorder
                radiusBorder={".313rem"}
                color2={"#506C6600"}
                color1={"#699F84"}
                bg="bg-[#1E3D36]"
                // shadow="shadow-button-shadow"
              >
                <button
                  type="submit"
                  onClick={() => navigate("mintNew")}
                  className=" px-4 w-[8.5rem] py-2 flex items-center justify-center gap-2  "
                >
                  {loading ? <Loader /> : "Submit"}
                </button>
              </GradientBorder>
            </div>
            {/* {status && <p className="text-sm text-center mt-4">{status}</p>} */}
          </form>
        </div>
      </div>
    </Overlay>
  )
}

export default FeedbackModal
