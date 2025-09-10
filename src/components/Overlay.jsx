function Overlay({ children, isBlur = true }) {
  return (
    <div
      className={`fixed w-[100%]  h-full overflow-hidden ${
        isBlur ? "bg-[rgb(0,0,0,0.3)]  backdrop-blur-sm" : "bg-[#00000080]  "
      }   top-0 left-0 bottom-0 right-0 transition-all duration-500 z-[9999]`}
    >
      {children}
    </div>
  )
}

export default Overlay
