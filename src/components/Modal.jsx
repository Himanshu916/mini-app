import {
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import { createPortal } from "react-dom"

const ModalContext = createContext()

function Modal({ children }) {
  const [open, setOpen] = useState("")

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  const close = () => setOpen("")
  return (
    <ModalContext.Provider value={{ open, setOpen, close }}>
      {children}
    </ModalContext.Provider>
  )
}

function ModalButton({ children, opens, className = "" }) {
  const { setOpen } = useContext(ModalContext)

  return (
    <div
      onClick={(e) => {
        e?.stopPropagation()
        setOpen(opens)
      }}
      className={`${className}`}
    >
      {children}
    </div>
  )
}

function ModalWindow({ name, children }) {
  const { open, close } = useContext(ModalContext)

  if (open !== name) return null

  return createPortal(cloneElement(children, { close }), document.body)
}

Modal.Button = ModalButton
Modal.Window = ModalWindow

export default Modal
