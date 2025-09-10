import { toast } from "sonner"

export const copyToClipboard = (text) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      toast.success(`${text} copied to clipboard `)
    })
    .catch((error) => {
      console.error("Failed to copy text: ", error)
    })
}
