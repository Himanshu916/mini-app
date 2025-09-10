import {
  ArrowBigLeftIcon,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import React from "react"
import { useHome } from "../contexts/HomeContext"

const Upperpaging = ({
  currentPage,
  totalPages,
  onPageChange,
  goToPrev,
  goToSpecific,
  goToNext,
  className = "md:hidden",
}) => {
  const maxPagesToShow = 6
  const pageNumbers = []
  const { dispatch } = useHome()
  if (totalPages <= maxPagesToShow) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i)
    }
  } else {
    pageNumbers.push(1)
    if (currentPage > 3) pageNumbers.push("...")

    let start = Math.max(2, currentPage - 1)
    let end = Math.min(totalPages - 1, currentPage + 1)

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i)
    }

    if (currentPage < totalPages - 2) pageNumbers.push("...")
    pageNumbers.push(totalPages)
  }

  return (
    <div className={`flex mt-4 items-center  justify-start ${className} `}>
      <div className="flex items-center  space-x-2 p-4 md:px-0 text-white">
        <button
          className={`px-3 py-1 rounded-full  hover:text-white ${
            currentPage === 1
              ? "opacity-50 cursor-not-allowed text-white "
              : "text-[#8A8A8A]"
          }`}
          disabled={currentPage === 1}
          onClick={() => {
            dispatch({
              type: "home/setActiveCollection",
              payload: currentPage - 1,
            })
            goToPrev()
            onPageChange(currentPage - 1)
          }}
        >
          <ChevronLeft size={14} />
        </button>

        {pageNumbers.map((page, index) => (
          <button
            key={index}
            className={`px-3  py-1  
               rounded-full
                  ${
                    page === "..."
                      ? "cursor-default"
                      : page === currentPage
                      ? "bg-[#081B17] text-white border-2 border-[#ABABAB]  "
                      : "bg-transparent hover:border-2 hover:border-[#ABABAB]   text-[#8A8A8A] hover:text-white "
                  }`}
            disabled={page === "..."}
            onClick={() => {
              if (typeof page === "number") {
                dispatch({
                  type: "home/setActiveCollection",
                  payload: page,
                })
                onPageChange(page)
                goToSpecific(page - 1)
              }
            }}
          >
            {page}
          </button>
        ))}

        <button
          className={`px-3 py-1 rounded-full hover:text-white  ${
            currentPage === totalPages
              ? "opacity-50 cursor-not-allowed text-white "
              : "text-[#8A8A8A]"
          }`}
          disabled={currentPage === totalPages}
          onClick={() => {
            dispatch({
              type: "home/setActiveCollection",
              payload: currentPage + 1,
            })
            goToNext()
            onPageChange(currentPage + 1)
          }}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}

export default Upperpaging
