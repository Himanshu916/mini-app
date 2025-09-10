const variations = {
  preview: {
    bgColor: "bg-[#1e429f]",
    textColor: "text-white",
    hoverColor: "bg-primaryColorHover",
  },
  primary: {
    bgColor: "bg-primaryColor",
    textColor: "text-white",
    hoverColor: "",
  },
  secondary: {
    bgColor: "bg-secondaryColor",
    textColor: "text-white",
    hoverColor: "bg-primaryColorHover",
  },
  miner: {
    bgColor: "bg-[#1A56DB]",
    textColor: "text-white",
    hoverColor: "",
  },
  white: {
    bgColor: "bg-headerBg  ",
    textColor: "text-lightBlack font-medium ",
    hoverColor: "bg-primaryColorHover",
  },
  tertiarySuccess: {
    bgColor: "bg-foundryGreenL border border-foundryGreen",
    textColor: " text-base text-foundryGreen font-medium",
    hoverColor: "hover:bg-gray-50",
  },
  tertiaryFail: {
    bgColor: "bg-foundryRedL border border-foundryRed",
    textColor: " text-base text-foundryRed font-medium",
    hoverColor: "hover:bg-gray-50",
  },
  tertiary: {
    bgColor: "bg-transparent border border-borderColor",
    textColor: " text-base font-medium",
    hoverColor: "hover:bg-gray-50",
  },
  transparent: {
    bgColor: "bg-transparent ",
    textColor: "text-[#7CBAA6]  font-medium",
    hoverColor: "",
  },
  wallet: {
    bgColor: "bg-red-300",
    textColor: "text-white",
    hoverColor: "bg-primaryColorHover",
  },
  approve: {
    bgColor: "bg-alertGreen",
    textColor: "text-white",
    // hoverColor: 'hover:bg-foundryGreenL',
  },
  approveVoting: {
    bgColor: { [false]: "bg-alertGreen", [true]: "bg-foundryGreenL" },
    textColor: "text-white",
    // hoverColor: 'hover:bg-foundryGreenL',
  },
  denyVoting: {
    bgColor: { [false]: "bg-alertRed", [true]: "bg-foundryRedL" },
    textColor: "text-white",
    // hoverColor: 'hover:bg-foundryGreenL',
  },
  deny: {
    bgColor: "bg-alertRed",
    textColor: "text-white",
    // hoverColor: 'hover:bg-foundryRedL',
  },
}

const sizes = {
  xsmall: {
    x: "px-2",
    y: "py-2",
    w: "w-36",
    radius: "rounded-lg",
  },
  fit: {
    x: "px-2",
    y: "py-2",
    w: "w-fit",
    radius: "rounded-lg",
  },
  none: {
    x: "",
    y: "",
    w: "",
  },
  circle: {
    x: "px-2",
    y: "py-2",
    w: "w-fit",
  },
  small: {
    x: "px-2",
    y: "py-2",
    w: "w-32",
    radius: "rounded-lg",
  },
  medium: {
    x: "px-2",
    y: "py-2",
    w: "",
    radius: "rounded-lg",
  },
  large: {
    x: "",
    y: "py-3",
    w: "w-full",
    radius: "rounded-lg",
  },
  adjustLarge: {
    x: "",
    y: "py-2",
    w: "w-full",
    radius: "rounded-lg",
  },
  largeMiner: {
    x: "",
    y: "",
    w: "w-full",
    radius: "rounded-lg",
  },
  roundPreview: {
    x: "px-2",
    y: "py-2",
    w: "w-full",
    radius: "rounded-full",
  },
  round: {
    x: "px-4",
    y: "py-2",
    w: "w-32",
  },
}

function Button({
  variant = "primary",
  size = "large",
  radius = "rounded-lg",
  width = "",
  children,
  disabled = false,
  className = "",
  fadeOut,
  ...props
}) {
  if (variant === "approveVoting" || variant === "denyVoting")
    return (
      <button
        disabled={disabled}
        className={`${variations[variant].bgColor[fadeOut]}  ${
          variations[variant].textColor
        } ${variations[variant].hoverColor} ${width ? width : sizes[size].w} ${
          sizes[size].x
        }  ${sizes[size].y} ${
          sizes[size].radius
        }  transition duration-300 ease-in-out ${className} `}
        {...props}
      >
        {children}
      </button>
    )
  if (variant === "wallet")
    return (
      <button
        className={`${variations[variant].bgColor}    ${variations[variant].textColor} hover:${variations[variant].hoverColor} ${sizes[size].w} ${sizes[size].y} ${sizes[size].radius}  transition duration-300 ease-in-out ${className}`}
        disabled={disabled}
        style={props.style}
        onClick={props.onClick}
        tabIndex={props.tabIndex || 0}
        type="button"
      >
        {props.startIcon && (
          <i className="wallet-adapter-button-start-icon  ">
            {props.startIcon}
          </i>
        )}
        {children}
        {props.endIcon && (
          <i className="wallet-adapter-button-end-icon">{props.endIcon}</i>
        )}
      </button>
    )

  return (
    <button
      disabled={disabled}
      className={`${variations[variant].bgColor}   ${
        variations[variant].textColor
      } ${variations[variant].hoverColor} ${width ? width : sizes[size]?.w} ${
        sizes[size].x
      }  ${
        sizes[size].y
      } ${radius}  transition duration-300 ease-in-out ${className} `}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
