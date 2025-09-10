const variations = {
  fulllarge: {
    fontSize: "text-8xl ",
  },
  xxlarge: {
    fontSize: "text-3xl md:text-5xl",
    fontWeight: "font-medium",
  },
  xlarge: {
    fontSize: "text-3xl",
    fontWeight: "font-semibold",
  },
  large: {
    fontSize: "text-2xl",
    fontWeight: "font-medium",
  },
  medium: {
    fontSize: "text-base md:text-xl",
    fontWeight: "font-semibold",
  },
  small: {
    fontSize: "text-lg",
  },
  xsmall: {
    fontSize: "text-base",
    fontWeight: "font-semibold",
  },
  xxsmall: {
    fontSize: "text-xs",
    fontWeight: "font-semibold",
  },
  pageHeading: {
    fontSize: "text-2xl",
    fontWeight: "font-medium",
  },
}

function Heading({ type, children, className }) {
  switch (type) {
    case "fulllarge":
      return (
        <h1 className={`${variations[type].fontSize}    ${className} `}>
          {children}
        </h1>
      )
    case "pageHeading":
      return (
        <h1
          className={`${variations[type].fontSize} ${variations[type].fontWeight}     ${className} `}
        >
          {children}
        </h1>
      )
    case "xlarge":
      return (
        <h1
          className={`${variations[type].fontSize} ${variations[type].fontWeight}   ${className} `}
        >
          {children}
        </h1>
      )
    case "xxlarge":
      return (
        <h1
          className={`${variations[type].fontSize}  ${variations[type].fontWeight}   ${className} `}
        >
          {children}
        </h1>
      )
    case "large":
      return (
        <h1 className={`${variations[type].fontSize}   ${className} `}>
          {children}
        </h1>
      )

    case "medium":
      return (
        <h2
          className={`${variations[type].fontSize}   ${variations[type].fontWeight}  ${className} `}
        >
          {children}
        </h2>
      )
    case "xxsmall":
      return (
        <h2
          className={`${variations[type].fontSize}   ${variations[type].fontWeight}  ${className} `}
        >
          {children}
        </h2>
      )
    case "xsmall":
      return (
        <h2
          className={`${variations[type].fontSize}   ${variations[type].fontWeight}  ${className} `}
        >
          {children}
        </h2>
      )

    case "small":
      return (
        <h3 className={`${variations[type].fontSize}   ${className} `}>
          {children}
        </h3>
      )

    default:
      return (
        <h2 className={`${variations[type].fontSize}   ${className} `}>
          {children}
        </h2>
      )
  }
}

export default Heading
