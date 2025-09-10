import ProfileDetails from "./ProfileDetails"
import ProfileHeader from "./ProfileHeader"
import BgProfile from "../../assets/bgProfile.png"
function UserProfile() {
  return (
    <div
      style={{
        backgroundImage: `url(${BgProfile})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
      className="bg-fixed h-full"
    >
      <div className="w-[90%]  lg:w-[67%] mx-auto">
        <div className="pt-9 pb-9  ">
          <ProfileHeader />
          <ProfileDetails />
        </div>
      </div>
    </div>
  )
}

export default UserProfile
