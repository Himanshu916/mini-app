import defaultAvatar from "../assets/images/defaultAvatar.png"
function AvatarImage({
  url,
  w = "w-16",
  h = "h-16",
  className = "",
  defaultImage,
  ...props
}) {
  return (
    <img
      className={`${w}  ${h} rounded-[50%] ${className} `}
      src={url ? url : defaultAvatar}
      alt="coimg"
      {...props}
    />
  )
}

export default AvatarImage
