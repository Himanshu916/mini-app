export const getAccessToken = () => {
  const state = localStorage.getItem("myState")
  return JSON.parse(state)?.token
}
