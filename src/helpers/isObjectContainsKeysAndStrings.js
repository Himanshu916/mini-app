// Function to check the condition
export function containsObjectWithKeyAndString(array, key, searchString) {
  return array.some(
    (obj) => Array.isArray(obj[key]) && obj[key].includes(searchString)
  )
}

export function getValueOfKey(array, key) {
  if (!key) return array
  if (typeof array === "string") return
  return array
    .filter((obj) => obj.hasOwnProperty(key)) // Optional: Filter objects that have the key
    .flatMap((obj) => obj[key])
}
