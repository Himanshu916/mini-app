import { useEffect, useRef, useState } from "react"

import TextWithTooltip from "./TextWithTooltip"
import { getValueOfKey } from "../../helpers/isObjectContainsKeysAndStrings"

const listItems = [
  "General Feedback",
  "Feature Request",
  "Bug Report",
  "UI Suggestion",
]

function Dropdown({
  w = "w-64",
  data = listItems,
  withCheckBox = false,
  selected,
  onSelected,
  render,
  id,
  modifyTooltiptext,
  disabled = false,
  btnClass = "",
  indexType,
  noSelectedText = "Assign Roles",
  error,
  className = "",
  name,
  modifyLabel,
  modifySelected,
  noProject = false,
  withDivision = false,
  isSymbol = false,
  withTooltip = false,
  data1 = [],
  data1Heading = "",
  data2Heading = "",
  data2 = [],
  ...props
}) {
  const [open, setOpen] = useState(false)
  const myRef = useRef()

  useEffect(() => {
    function handleClick(e) {
      if (myRef.current && !myRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("click", handleClick, true)
    return () => document.removeEventListener("click", handleClick, true)
  }, [])

  const arr = getValueOfKey(selected, id)

  return (
    <div className={`${className}`} ref={myRef}>
      <button
        {...props}
        onClick={() => setOpen((prev) => !prev)}
        disabled={disabled}
        className={`border bg-[#272727] border-[#4E4E4E] text-[#A3A3A3] ${w} justify-between rounded-lg ${
          open ? "rounded-b-none " : ""
        }  px-3 py-2 text-left flex items-center ${btnClass}`}
        type="button"
      >
        {withCheckBox ? (
          arr?.length > 0 ? (
            modifySelected ? (
              <span className="flex text-primaryInput items-center gap-2">
                {modifySelected(arr)}
              </span>
            ) : (
              <span className="text-primaryInput capitalize ">
                {arr
                  ?.map((text) => text.split("_").join(" ").toLowerCase())
                  .join(",")}
              </span>
            )
          ) : (
            <span className="text-secondaryInput font-semibold">
              {noSelectedText}
            </span>
          )
        ) : selected ? (
          isSymbol ? (
            <div className="flex items-center gap-5">
              <div className="relative">
                <img
                  className="w-5 h-5 rounded-full "
                  src={selected?.image}
                  alt=""
                />
                <img
                  className="w-3 h-3 absolute -top-1 -right-1 rounded-full "
                  src={selected?.chainImage}
                  alt=""
                />
              </div>

              <span>{selected.symbol}</span>
            </div>
          ) : (
            <span className="text-primaryInput capitalize ">
              {modifySelected ? modifySelected(selected) : selected}
            </span>
          )
        ) : (
          <span className="text-secondaryInput font-semibold">
            {noSelectedText}
          </span>
        )}
        <svg
          className="w-2.5 h-2.5 ms-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>
      {error && <p className="text-[#D48080]">{error}</p>}
      <div
        className={`z-[2000] ${w} ${
          open ? "absolute" : "hidden"
        } bg-[#272727] border-[#4E4E4E] max-h-56 overflow-auto main rounded-lg rounded-t-none shadow px-3`}
      >
        {noProject && (
          <p className="pt-2 px-3">
            There are no projects in this organisation. Proceed with no project
            or create a new project.
          </p>
        )}
        <ul
          className="py-2 text-sm text-[#A3A3A3] "
          aria-labelledby="dropdownDefaultButton"
        >
          {withCheckBox && data.map(render)}
          {!withCheckBox &&
            (withDivision ? (
              <>
                <p className="font-bold px-2 underline underline-offset-2 text-[#737373] ">
                  {data1Heading}
                </p>
                {data1.map((listItem, index) => (
                  <li
                    onClick={() => {
                      if (listItem === selected) {
                        onSelected(null, name, indexType) // Deselect if the same item is clicked
                      } else {
                        onSelected(listItem, name, indexType) // Select new item
                      }
                      setOpen(false)
                    }}
                    key={listItem + index}
                    className={`block px-2 py-2 cursor-pointer rounded-md hover:bg-gray-700   ${
                      listItem === selected ? "font-bold text-primaryInput" : ""
                    }`}
                  >
                    {withTooltip ? (
                      <TextWithTooltip
                        expandedTextWidth="w-96"
                        expandedClassName="pt-3 pb-3"
                        heading={
                          <>{modifyLabel ? modifyLabel(listItem) : listItem}</>
                        }
                      >
                        <p className="text-sm w- ">
                          {modifyTooltiptext(listItem)}
                        </p>
                      </TextWithTooltip>
                    ) : modifyLabel ? (
                      modifyLabel(listItem)
                    ) : (
                      listItem
                    )}
                  </li>
                ))}
                <p className="font-bold px-2 underline underline-offset-2 text-[#737373] ">
                  {data2Heading}
                </p>
                {data2.map((listItem, index) => (
                  <li
                    onClick={() => {
                      if (listItem === selected) {
                        onSelected(null, name, indexType) // Deselect if the same item is clicked
                      } else {
                        onSelected(listItem, name, indexType) // Select new item
                      }
                      setOpen(false)
                    }}
                    key={listItem + index}
                    className={`block px-2 py-2 cursor-pointer rounded-md hover:bg-gray-100   ${
                      listItem === selected ? "font-bold text-primaryInput" : ""
                    }`}
                  >
                    {withTooltip ? (
                      <TextWithTooltip
                        expandedTextWidth="w-96"
                        expandedClassName="pt-3 pb-3"
                        heading={
                          <>{modifyLabel ? modifyLabel(listItem) : listItem}</>
                        }
                      >
                        <p className="text-sm w- ">
                          {modifyTooltiptext(listItem)}
                        </p>
                      </TextWithTooltip>
                    ) : modifyLabel ? (
                      modifyLabel(listItem)
                    ) : (
                      listItem
                    )}
                  </li>
                ))}
              </>
            ) : (
              data.map((listItem, index) => (
                <li
                  onClick={() => {
                    if (listItem === selected) {
                      onSelected(null, name, indexType) // Deselect if the same item is clicked
                    } else {
                      onSelected(listItem, name, indexType) // Select new item
                    }
                    setOpen(false)
                  }}
                  key={listItem + index}
                  className={`block px-2 py-2 cursor-pointer rounded-md hover:bg-[#333]   ${
                    listItem === selected ? "font-bold text-primaryInput" : ""
                  }`}
                >
                  {withTooltip ? (
                    <TextWithTooltip
                      expandedTextWidth="w-96"
                      expandedClassName="pt-3 pb-3"
                      heading={
                        <>{modifyLabel ? modifyLabel(listItem) : listItem}</>
                      }
                    >
                      <p className="text-sm w- ">
                        {modifyTooltiptext(listItem)}
                      </p>
                    </TextWithTooltip>
                  ) : modifyLabel ? (
                    modifyLabel(listItem)
                  ) : (
                    listItem
                  )}
                </li>
              ))
            ))}
        </ul>
      </div>
    </div>
  )
}

export default Dropdown
