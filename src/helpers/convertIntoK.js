export const formatNumberToK = (value) => {
  // Convert to number if it's not already
  let num = Number(value)

  // Return the original value if it's NaN
  if (isNaN(num)) return 0

  // If the number is less than 100, return it as is
  if (num < 1000) return num.toString()

  // Convert to "K" format
  return (num / 1000).toFixed(2).replace(/\.0$/, "") + "K"
}
