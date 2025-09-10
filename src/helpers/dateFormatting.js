export function formatDate(dateStr) {
  const date = new Date(dateStr)
  const day = date.getDate()
  const month = date.toLocaleString("en-US", { month: "short" })
  const year = date.getFullYear()
  return `${day} ${month}, ${year}`
}
