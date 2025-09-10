function ProgressBar({
  color,
  width = "45%",
  className = "",
  colorb,
  bPer = "35%'",
  cPer = "20%'",
  dPer = "15%'",
  colorc,
  colord,
  border = "",
  multiple = false,
  bgDefault = "bg-[#3E3E3E]",
}) {
  return (
    <div
      className={`w-full ${bgDefault} ${border} rounded-full h-2.5 flex-1 flex ${className} `}
    >
      <div
        style={{ width: width }}
        className={` ${color} h-full rounded-full ${
          multiple ? "rounded-r-none" : ""
        }  `}
      ></div>
      {multiple && (
        <>
          <div
            style={{ width: bPer }}
            className={` ${colorb} h-2.5 rounded-full rounded-s-none rounded-e-none  `}
          ></div>
          <div
            style={{ width: cPer }}
            className={` ${colorc} h-2.5 rounded-full rounded-s-none rounded-e-none   `}
          ></div>
          <div
            style={{ width: dPer }}
            className={` ${colord} h-2.5 rounded-full rounded-s-none  `}
          ></div>
        </>
      )}
    </div>
  )
}

export default ProgressBar
