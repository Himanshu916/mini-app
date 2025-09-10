import React from "react"

function InputText(
  {
    type = "text",
    label,
    transparentTextSize = "text-3xl",
    transparentFontWeight = "font-semibold",
    isMandatory = false,
    placeholder = "",
    error = "",
    containerClass = "",
    step = ".000000001",
    className,
    helpUser,
    restrictLength,
    ...props
  },
  ref
) {
  switch (type) {
    case "search":
      return (
        <div>
          <label className="mb-1" htmlFor={label}></label>
          <input
            id={label}
            type="text"
            ref={ref}
            placeholder={placeholder}
            className={`   bg-transparent  outline-none rounded-md  ${className}`}
            {...props}
          />
          {error && <p className="text-[#D48080]">{error}</p>}
        </div>
      )
    case "text":
      return (
        <div className={`${containerClass}`}>
          <label className="text-primaryText block mb-1" htmlFor={label}>
            {label}
            {isMandatory && (
              <sup className="text-white relative -top-[2px] left-1 ">*</sup>
            )}
          </label>
          <input
            id={label}
            type="text"
            ref={ref}
            placeholder={placeholder}
            className={` border border-[#4E4E4E] outline-none  text-white
                             placeholder:text-[#FFFFFF80]   bg-headerBg rounded-lg px-3 py-2 ${className}`}
            {...props}
          />
          {error && (
            <div className="flex items-center mt-1 gap-1">
              <p className="text-[#D48080]">{error}</p>
              {helpUser && <span>{helpUser}</span>}
            </div>
          )}
        </div>
      )
    case "number":
      return (
        <div className={`${containerClass}`}>
          <label className="text-primaryText block mb-1" htmlFor={label}>
            {label}
            {isMandatory && (
              <sup className="text-white relative -top-[2px] left-1 ">*</sup>
            )}
          </label>
          <input
            type="number"
            min={"0"}
            ref={ref}
            step={step}
            onWheel={(event) => event.target.blur()}
            onInput={restrictLength}
            placeholder={placeholder}
            className={` border border-borderColor text-white shadow-sm placeholder:text-tertiaryInput   bg-headerBg rounded-md px-3 py-2 ${className}`}
            {...props}
          />
          {error && (
            <div className="flex items-center justify-between gap-1">
              <p className="text-[#D48080]">{error}</p>
              {helpUser && <span>{helpUser}</span>}
            </div>
          )}
        </div>
      )
    case "textArea":
      return (
        <>
          <textarea
            rows="3"
            ref={ref}
            placeholder={placeholder}
            {...props}
            className={`  border border-[#4E4E4E] text-white placeholder:text-[#A3A3A3] shadow-sm  bg-[#272727] rounded-md py-2 px-3 ${className}`}
            id=""
          />
          {error && <p className="text-[#D48080]">{error}</p>}
        </>
      )
    case "file":
      return (
        <>
          <input
            ref={ref}
            type="file"
            id="avatar"
            name="avatar"
            accept="image/png, image/jpeg"
            className="hidden"
            {...props}
          />
          {error && <p className="text-[#D48080]">{error}</p>}
        </>
      )
    case "transparent":
      return (
        <>
          <input
            ref={ref}
            type="text"
            placeholder={placeholder}
            className={`  ${transparentTextSize} outline-none text-white placeholder:text-tertiaryInput bg-transparent ${transparentFontWeight}  ${className}`}
            {...props}
          />
          {error && <p className="text-[#D48080]">{error}</p>}
        </>
      )
    case "transparentNumber":
      return (
        <>
          <input
            ref={ref}
            type="number"
            placeholder={placeholder}
            min={props.min}
            className={`  ${transparentTextSize} outline-none placeholder:text-tertiaryInput bg-transparent ${transparentFontWeight}  ${className}`}
            {...props}
          />
          {error && <p className="text-[#D48080]">{error}</p>}
        </>
      )
    case "hidden":
      return (
        <>
          <input
            ref={ref}
            type="text"
            placeholder={placeholder}
            className={`  ${transparentTextSize} border border-[#4E4E4E]  outline-none placeholder:text-uploadText bg-transparent ${transparentFontWeight}  ${className}`}
            {...props}
          />
          {error && <p className="text-[#D48080]">{error}</p>}
        </>
      )
    default:
      return (
        <>
          <input
            ref={ref}
            type="text"
            placeholder="Add Bio"
            className={` border border-[#4E4E4E]   bg-headerBg rounded-md p-4 ${className}`}
            {...props}
          />
          {error && (
            <div>
              <p className="text-[#D48080]">{error}</p>
              {helpUser && <span>{helpUser}</span>}
            </div>
          )}
        </>
      )
  }
}
const Input = React.forwardRef(InputText)
export default Input
