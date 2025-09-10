const Chip = ({ icon, label, className }) => {
  return (
    <div
      className={`flex items-center gap-1 h-[1.625rem] bg-innerGrey w-fit px-2 py-[0.5rem] rounded-sm  `}
    >
      {icon && icon}
      <p className="text-xs text-white">{label}</p>
    </div>
  )
}

export default Chip
