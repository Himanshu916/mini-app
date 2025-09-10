import { useNavigate, useOutletContext } from "react-router-dom"

import { CopyIcon } from "../../assets/icons/CopyIcon"
import { EditIcon } from "../../assets/icons/EditIcon"
import { copyToClipboard } from "../../helpers/copyText"
import Heading from "../../components/Heading"
import Button from "../../components/Button"
import AvatarImage from "../../components/AvatarImage"
import defaultAvatar from "../../assets/images/defaultAvatar.png"
import notUpdated from "../../assets/images/notupdated.png"
import { useIsMobile } from "../../hooks/isMobile"
import { useAuth } from "../../contexts/AuthContext"
import { toast } from "sonner"

const userProfile = {
  profileImage: defaultAvatar,
  userName: "Ninja Boggie",
  uid: "t4xbjwhefdfjfjehfhejfj",
}

function ProfileHeader() {
  const navigate = useNavigate()
  const [isMobile] = useIsMobile()
  const { state } = useAuth()

  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-5  items-center  ">
        <AvatarImage
          w="w-20"
          h="h-20"
          url={state?.citizen?.profileImage || notUpdated}
        />

        <div>
          <Heading type={"xxlarge"}>{state?.citizen?.userName || ""}</Heading>

          {/* <div className="flex items-center mt-3 gap-2">
            <Heading className={"text-secondaryText "} type="medium">
              User ID :{" "}
              <span className="font-normal">
                {" "}
                {state?.citizen?.id.slice(0, 8)}...
              </span>
            </Heading>
            <div
              onClick={() => {
                copyToClipboard(userProfile.uid)
                toast.success("Text copied to clipboard.")
              }}
              className="cursor-pointer"
            >
              <CopyIcon />
            </div>
          </div> */}
        </div>
      </div>
      <div className="flex gap-3 items-center">
        {!isMobile ? (
          <Button
            className="flex items-center justify-center gap-[10px]"
            onClick={() => navigate("editprofile")}
            variant="white"
            size="xsmall"
          >
            <span> Edit Profile </span> <EditIcon />
          </Button>
        ) : (
          <EditIcon onClick={() => navigate("editprofile")} />
        )}
      </div>
    </div>
  )
}

export default ProfileHeader
