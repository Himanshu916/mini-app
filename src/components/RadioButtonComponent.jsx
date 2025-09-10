const RadioButtonComponent = ({
  selectedOption,
  onSelectOption,
  options,
  className,
  disabled,
  inputClassName,
}) => {
  const handleOptionChange = (event) => {
    onSelectOption(event.target.value)
  }

  return (
    <div className={`flex  gap-3 ${className}`}>
      {options.map((option, i) => (
        <label className="cursor-pointer flex items-center" key={option + i}>
          <input
            type="radio"
            disabled={disabled}
            value={option}
            checked={selectedOption === option}
            onChange={handleOptionChange}
            className={`hidden ${inputClassName}`}
          />
          <span className="bg-[#4C4C4C] rounded-full p-2">
            <span
              className={`w-4 h-4 border-2 border-[#3CAB80] rounded-full flex items-center justify-center`}
            >
              <span
                className={`w-2 h-2 bg-[#3CAB80] rounded-full ${
                  selectedOption === option ? "block" : "hidden"
                }`}
              ></span>
            </span>
          </span>

          <span className="capitalize ml-2">{option}</span>
        </label>
      ))}
    </div>
  )
}

export default RadioButtonComponent
