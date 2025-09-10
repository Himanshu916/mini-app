import { useEffect, useRef, useState } from "react"

import RadioButtonComponent from "../../components/RadioButtonComponent"
import { useGlobalState } from "../../contexts/GlobalState"

const LeaderboardFilter = ({
  selectedLandscapes,
  setSelectedLandscapes,
  onChangingLandscape,
}) => {
  const [open, setOpen] = useState(false)
  const [isAll, setIsAll] = useState("All")
  //   const [landscapes, setLandscapes] = useState([])
  const { state: landscapesState } = useGlobalState()

  const radioHandler = (collection) => {
    if (selectedLandscapes.includes(collection))
      setSelectedLandscapes((initial) =>
        initial.filter((i) => i !== collection)
      )
    else setSelectedLandscapes((initial) => [...initial, collection])
  }

  const myRef = useRef()
  const { landscapes } = landscapesState
  useEffect(() => {
    function handleClick(e) {
      if (myRef.current && !myRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("click", handleClick, true)
    return () => document.removeEventListener("click", handleClick, true)
  }, [])

  const filteredBy =
    selectedLandscapes?.length === 0
      ? "Global"
      : landscapes?.find((l) => l.nftCollectionNumber === selectedLandscapes[0])
          ?.name
  // console.log("selectedLandscapes", selectedLandscapes)
  return (
    <div className="relative" ref={myRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        // disabled={disabled}
        className="flex items-center gap-2  w-fit min-w-44 font-medium justify-between bg-[#1E3D36] rounded-lg px-4 py-2 "
        type="button"
      >
        <span>{filteredBy}</span>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="16"
          viewBox="0 0 14 16"
          fill="none"
        >
          <path
            d="M9.62464 15.0024C9.65963 15.269 9.57214 15.5534 9.37092 15.7401C9.28998 15.8225 9.19384 15.8878 9.08801 15.9324C8.98217 15.977 8.86871 16 8.75413 16C8.63955 16 8.52609 15.977 8.42026 15.9324C8.31442 15.8878 8.21828 15.8225 8.13734 15.7401L4.62908 12.1761C4.53371 12.0813 4.4612 11.9654 4.41719 11.8375C4.37318 11.7095 4.35887 11.573 4.37536 11.4384V6.88795L0.184694 1.4398C0.0426205 1.25452 -0.0214858 1.01965 0.00638272 0.786498C0.0342512 0.553349 0.151829 0.340884 0.333423 0.195529C0.49965 0.0711015 0.683375 0 0.875848 0H13.1242C13.3166 0 13.5003 0.0711015 13.6666 0.195529C13.8482 0.340884 13.9657 0.553349 13.9936 0.786498C14.0215 1.01965 13.9574 1.25452 13.8153 1.4398L9.62464 6.88795V15.0024ZM2.6606 1.77754L6.12512 6.2747V11.1807L7.87488 12.9582V6.26582L11.3394 1.77754H2.6606Z"
            fill="#E8E8E8"
          />
        </svg>
      </button>

      <div
        className={`z-[2000] w-64 ${
          open ? "absolute" : "hidden"
        } bg-[#353535]  overflow-auto h-[40vh] main rounded-lg rounded-t-none shadow px-4 py-3`}
      >
        <div>
          <RadioButtonComponent
            className={"flex-col mt-2"}
            selectedOption={isAll}
            onSelectOption={(option) => {
              setIsAll(option)
              setSelectedLandscapes([])
              onChangingLandscape()
              setOpen(false)
            }}
            options={["All"]}
          />
        </div>
        <p className="text-[#ADADAD] my-2 ">Landscapes</p>
        <div>
          <RadioButtonComponent
            className={"flex-col mt-2"}
            selectedOption={isAll}
            onSelectOption={(option) => {
              setIsAll(option)
              const found = landscapes?.find((l) => l.name === option)
              onChangingLandscape()
              setSelectedLandscapes([found?.nftCollectionNumber])
              setOpen(false)
            }}
            options={landscapes?.map((landscape) => landscape?.name)}
          />
        </div>
      </div>
    </div>
  )
}

export default LeaderboardFilter
