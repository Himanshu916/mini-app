export default function NoDataAvailable({
  text = "Spread your mission! Take the first step",
  minHeight = "min-h-[20vh]",
  className = "",
  imgClassName = "",
  marginTop = "mt-16",
}) {
  return (
    <div
      className={`${minHeight} flex flex-col ${marginTop}  justify-center items-center ${className} `}
    >
      {/* <img className={`${imgClassName}  `} src={emptyState} alt="" /> */}
      <p className="text-center text-lightBlack  font-medium ">
        {text} {":)"}{" "}
      </p>
    </div>
  )
}
