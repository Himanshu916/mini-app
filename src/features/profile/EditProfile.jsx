import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { useLoadingState } from "../../hooks/useLoader"
import { useController, useForm } from "react-hook-form"
import { toast } from "sonner"
import AvatarImage from "../../components/AvatarImage"
import { EditIcon } from "../../assets/icons/EditIcon"
import Input from "../../components/Input"
import GradientBorder from "../../components/GradientBorder"
import { updateProfile } from "../../apis/userProfile"
import { uploader } from "../../helpers/uploader"
import BackButton from "../../assets/icons/BackButton"
import { useNavigate } from "react-router-dom"
import Bg from "../../assets/bgProfile.png"
import Loader from "../../components/Loader"
function EditProfile() {
  const { state, dispatch } = useAuth()
  const navigate = useNavigate()
  const { citizen } = state

  const {
    loading: saving,
    startLoading: startSaving,
    stopLoading: stopSaving,
  } = useLoadingState()
  const [imageObject, setImage] = useState({
    image: null,
    imageURL: citizen?.profileImage,
  })

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      bio: citizen?.bio,
      userName: citizen?.userName,
    },
  })
  const { field: profileImageField } = useController({
    name: "profileImage",
    control,
    rules: {
      required: citizen?.profileImage
        ? false
        : "Please upload a profile picure",
    },
  })
  const { field: bioField } = useController({
    name: "bio",
    control,
    rules: {
      required: "Please enter your bio",
      maxLength: {
        value: 130,
        message: "The maximum length is 130 characters",
      },
    },
  })
  const { field: userNameField } = useController({
    name: "userName",
    control,
    rules: {
      required: "Please enter your name",
      maxLength: {
        value: 130,
        message: "The maximum length is 130 characters",
      },
    },
  })

  const onSubmit = async (data) => {
    const profileToEdit = {
      bio: data?.bio,
      ...(data?.userName !== citizen?.userName && { userName: data?.userName }),
      profileImage: imageObject?.imageURL,
    }

    try {
      startSaving()

      const response = await updateProfile(profileToEdit)

      if (response.status === 400) {
        throw new Error(response?.response?.data?.message)
      }
      if (response?.data?.id) {
        toast.success("Profile successfully updated. ")

        dispatch({
          type: "editProfile",
          payload: {
            bio: response?.data?.bio,
            userName: response?.data?.userName,
            profileImage: response?.data?.profileImage,
          },
        })
        navigate(-1)
      }
      // if(Object.keys())
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)

      toast?.error(errorMessage)
    } finally {
      stopSaving()
    }
  }
  const handleFileChange = async (event) => {
    const file = event.target.files[0] // Get the selected file

    if (file) {
      profileImageField.onChange(event)
      await uploadFile(file)
    } else {
      //   setUploadStatus("Please select a valid file.")
    }
  }

  const uploadFile = async (file) => {
    try {
      //   startUploading()

      const res = await uploader(file)

      if (res.files.length) {
        setImage({
          image: file,
          imageURL: res.files[0],
        })

        // toast.success("Image is successfully uploaded.")
      } else {
        // toast.error("Sorry unable to upload logo")
      }
      //   stopUploading()
    } catch (error) {
      console.error("Error uploading file:", error)
    }
  }

  return (
    <div
      style={{
        backgroundImage: `url(${Bg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
      className="min-w-[100vw] h-[100vh] overflow-hidden bg-fixed  flex items-center justify-center "
      // className="w-full h-[90vh]  overflow-hidden flex items-center justify-center"
    >
      <div className=" w-[90%] md:w-[50%] lg:w-[30%]  mx-auto ">
        <div className="flex w-full items-start  gap-4">
          <BackButton className={"mt-1 "} onClick={() => navigate(-1)} />

          <div className="flex-grow">
            <p className="text-3xl mb-8 font-medium">Edit Profile</p>
            <div className="flex flex-col gap-2 mb-8">
              <div className="relative w-[76px] h-[76px]   ">
                <AvatarImage
                  w="w-full"
                  h="h-full"
                  className=" "
                  url={imageObject?.imageURL}
                />
                <div className="absolute bottom-2 -right-2  rounded-full border  border-borderColor bg-white hover:bg-gray-50">
                  <div className="flex items-center justify-center w-7 h-7   ">
                    <label className="cursor-pointer  " for="avatar">
                      <EditIcon />
                    </label>
                    <Input
                      type="file"
                      accept="image/*"
                      {...profileImageField}
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </div>
              {errors?.profileImage && (
                <p className="text-[#D48080]">
                  {errors?.profileImage?.message}
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className=" text-black ">
              <div className="mb-6">
                <p className={"text-white font-medium mb-1"} type={"large"}>
                  Username
                </p>
                {/* <div className="flex  gap-3 py-2 px-3 border cursor-not-allowed rounded-lg border-[#242424;] bg-[#141414]   ">
                  <p className={` text-white   leading-6 `}>
                    <span>{citizen?.userName}</span>
                  </p>
                </div> */}
                <div>
                  <Input
                    {...userNameField}
                    error={errors?.userName?.message}
                    type="text"
                    placeholder={"Enter your name"}
                    className={"w-[100%]"}
                  />
                </div>
              </div>
              <div className="">
                <p className={"text-white font-medium mb-1"} type={"large"}>
                  Bio
                </p>
                <div>
                  <Input
                    {...bioField}
                    error={errors?.bio?.message}
                    type="textArea"
                    placeholder={"Tell us something about yourself"}
                    className={"w-[100%]"}
                  />
                  {/* <CharacterLimit
              min={bioField?.value ? bioField.value?.length : 0}
              max={130}
            /> */}
                </div>
              </div>
              <div className="flex mt-7 items-center justify-end">
                <GradientBorder
                  radiusBorder={".60rem"}
                  color2={"#506C6600"}
                  color1={"#699F84"}
                  bg="bg-[#426A61]"
                >
                  <button className=" px-4 w-24 text-center text-white  py-2 flex justify-center items-center gap-2  ">
                    {saving ? <Loader /> : "Save"}
                  </button>
                </GradientBorder>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditProfile
