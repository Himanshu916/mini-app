export const fixTo2WithoutRoundOff = (num) => {
  if (!isFinite(num)) return null
  const parts = num.toString().split(".")
  if (parts.length === 1) return num.toFixed(2) // No decimal part

  const decimalPart = parts[1].slice(0, 2).padEnd(2, "0")
  return `${parts[0]}.${decimalPart}`
}
