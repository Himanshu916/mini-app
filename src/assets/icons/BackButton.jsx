function BackButton({ className, ...props }) {
  return (
    <button className={`${className}`} {...props}>
      <svg
        width="14"
        height="24"
        viewBox="0 0 14 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.8658 2.39801L11.8008 0.333008L0.134155 11.9997L11.8008 23.6663L13.8658 21.6013L4.26415 11.9997L13.8658 2.39801Z"
          fill="#B8B8B8"
        />
      </svg>
    </button>
  )
}

export default BackButton
