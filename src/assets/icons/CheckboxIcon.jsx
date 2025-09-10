import React from "react"

const CheckboxIcon = ({ checked, onSelection }) => {
  if (!checked)
    return (
      <svg
        onClick={onSelection}
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
      >
        <g clip-path="url(#clip0_727_1865)">
          <path
            d="M12.4444 1.69618V12.5851H1.55556V1.69618H12.4444ZM12.4444 0.140625H1.55556C0.7 0.140625 0 0.840625 0 1.69618V12.5851C0 13.4406 0.7 14.1406 1.55556 14.1406H12.4444C13.3 14.1406 14 13.4406 14 12.5851V1.69618C14 0.840625 13.3 0.140625 12.4444 0.140625Z"
            fill="#4C4C4C"
          />
        </g>
        <defs>
          <clipPath id="clip0_727_1865">
            <rect width="14" height="14" fill="white" />
          </clipPath>
        </defs>
      </svg>
    )

  return (
    <svg
      onClick={onSelection}
      className="cursor-pointer"
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
    >
      <g clip-path="url(#clip0_727_1853)">
        <path
          d="M12.4444 1.69618V12.5851H1.55556V1.69618H12.4444ZM12.4444 0.140625H1.55556C0.7 0.140625 0 0.840625 0 1.69618V12.5851C0 13.4406 0.7 14.1406 1.55556 14.1406H12.4444C13.3 14.1406 14 13.4406 14 12.5851V1.69618C14 0.840625 13.3 0.140625 12.4444 0.140625Z"
          fill="#4C4C4C"
        />
        <rect x="3" y="3.14062" width="8" height="8" fill="#3CAB80" />
      </g>
      <defs>
        <clipPath id="clip0_727_1853">
          <rect width="14" height="14" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default CheckboxIcon
