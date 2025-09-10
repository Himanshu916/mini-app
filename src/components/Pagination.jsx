import {
  ArrowBigLeftIcon,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import React from "react"
import Dropdown from "./ui/Dropdown"

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  entriesPerPage,
  entriesHandler,
}) => {
  const maxPagesToShow = 6
  const pageNumbers = []

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
    <div className="flex items-center justify-between">
      <div className="flex items-center justify-center space-x-2 p-4 text-white">
        <button
          className={`px-3 py-1 rounded-md  hover:text-white ${
            currentPage === 1
              ? "opacity-50 cursor-not-allowed text-white "
              : "text-[#8A8A8A]"
          }`}
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft size={14} />
        </button>

        {pageNumbers.map((page, index) => (
          <button
            key={index}
            className={`px-3  py-1  
             "rounded-md"
                ${
                  page === "..."
                    ? "cursor-default"
                    : page === currentPage
                    ? "bg-[#081B17] text-white border border-[#626262]  "
                    : "bg-transparent hover:border hover:border-[#626262]   text-[#8A8A8A] hover:text-white "
                }`}
            disabled={page === "..."}
            onClick={() => typeof page === "number" && onPageChange(page)}
          >
            {page}
          </button>
        ))}

        <button
          className={`px-3 py-1 rounded-md hover:text-white  ${
            currentPage === totalPages
              ? "opacity-50 cursor-not-allowed text-white "
              : "text-[#8A8A8A]"
          }`}
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center  gap-2">
        <div className="flex gap-2 items-center justify-between">
          <p className="text-[#8A8A8A]">Showing </p>
          <div className="relative ">
            <Dropdown
              modifyLabel={(listItem) => {
                return (
                  <div className="flex items-center gap-5 text-[#A3A3A3]">
                    <span>{listItem} </span>
                  </div>
                )
              }}
              data={[10, 20, 30]}
              selected={entriesPerPage}
              onSelected={(val) => {
                entriesHandler(val)
              }}
              noSelectedText="10"
              //   btnClass="rounded-e-none"
              w=" w-[71px]"
            />
          </div>
        </div>

        <p className="text-[#8A8A8A]"> of {totalPages * 10} items</p>
      </div>
    </div>
  )
}

export default Pagination
