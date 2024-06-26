import { useState } from "react"
import { UserType } from "../definitions"
import Loader from "./Loader"
import { updateProfile, updateImage, deleteProfileImage } from "../api"
import toast from "react-hot-toast"
import { CiEdit } from "react-icons/ci"
import { useAppDispatch, useAppSelector } from "../hooks"
import { logout, updateUser } from "../features/userSlice"
import { TbPhotoPlus } from "react-icons/tb"
import { MdDeleteOutline } from "react-icons/md"
import confirm from "./ConfirmationComponent"
import { LogOutIcon } from "lucide-react"
import ButtonSecondary from "./ButtonSecondary"
import { useNavigate } from "react-router-dom"

const defUser: UserType = {
  userId: "",
  name: "",
  email: "",
  profileImage: "",
  socketToken: "",
  phoneNo: "",
  isVendor: false,
  vendorProfile: null,
  events: [],
  myChats: [],
  notifications: [],
  serviceEvents: [],
  createdAt: "",
  updatedAt: "",
}

const MyProfile = () => {
  const [edit, setEdit] = useState(false)
  const [editedUser, setEditedUser] = useState<UserType>(defUser)
  const [loadingProfileImage, setLoadingProfileImage] = useState<boolean>(false)

  const dispatch = useAppDispatch()
  const { user: originalUser, loading } = useAppSelector((state) => state.user)
  const navigate = useNavigate()

  const handleEdit = () => {
    if (originalUser) {
      setEdit(true)
      setEditedUser(originalUser)
    }
  }

  const handleCancel = () => {
    // If new interest was being added but not confirmed, discard it
    setEdit(false)
  }
  const handleUpdate = async () => {
    updateProfile(editedUser)
      .then((_response) => {
        toast.success("Profile updated successfully")
        dispatch(updateUser(editedUser))
      })
      .catch((error) => console.log(error))
      .finally(() => handleCancel())
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }))
  }

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (!originalUser) return
      toast.loading("Uploading new profile photo", {
        id: "uploading-profile-image",
      })
      setLoadingProfileImage(true)
      updateImage(e.target.files[0])
        .then((response) => {
          dispatch(
            updateUser({
              ...originalUser,
              profileImage: response.data.profileImage,
            }),
          )
          setEditedUser((prevUser) => ({
            ...prevUser,
            profileImage: response.data.profileImage,
          }))
        })
        .catch((error) => console.log(error))
        .finally(() => {
          toast.success("Profile image updated successfully", {
            id: "uploading-profile-image",
          })
          setLoadingProfileImage(false)
        })
    }
  }

  const handleProfileImageDelete = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault()
    if (!originalUser) return
    setLoadingProfileImage(true)
    deleteProfileImage()
      .then((response) => {
        dispatch(
          updateUser({
            ...originalUser,
            profileImage: response.data.defaultProfileImage,
          }),
        )
        setEditedUser((prevUser) => ({
          ...prevUser,
          profileImage: "",
        }))
        toast.success("Profile image deleted successfully")
      })
      .catch((error) => console.log(error))
      .finally(() => setLoadingProfileImage(false))
  }
  const handleLogout = async () => {
    const confirmLogout = await confirm("Are you sure you want to logout?", {
      title: "Logout",
      deleteButton: "Logout",
      cancelButton: "Cancel",
    })
    if (confirmLogout === false) return
    dispatch(logout())
  }

  const user = edit ? editedUser : originalUser

  if (loading) return <Loader />

  if (user === null)
    return (
      <div className="text-red-500 font-bold text-center">
        You are not authorized to view this page.
      </div>
    )

  return (
    <div className="flex flex-col  w-full sm:mx-6">
      <nav className="pb-5 px-5 rounded-xl flex flex-col justify-between sm:flex-row ">
        <div className=" text-center sm:text-left">
          <h1 className="text-2xl font-medium">My Profile</h1>
          <span className="text-sm text-slate-500 ">
            Manage your profile settings
          </span>
        </div>

        {!edit ? (
          <button
            onClick={handleEdit}
            type="button"
            className="w-fit text-dark hover:text-blue-700 border border-dark hover:bg-highlight hover:border-highlight font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-purple-900 duration-150 flex items-center justify-center gap-1 mx-auto sm:mr-0 mt-3 sm:mt-0"
          >
            <CiEdit className="text-base" />
            Edit profile
          </button>
        ) : (
          <div className="flex mx-auto sm:mr-0 mt-3 sm:mt-0">
            <button
              onClick={handleUpdate}
              type="button"
              className="text-dark hover:text-blue-700 border border-dark hover:bg-highlight hover:border-highlight font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:focus:ring-purple-900 duration-150 flex items-center justify-center gap-1"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              type="button"
              className="text-dark hover:text-blue-700 border border-dark hover:bg-highlight hover:border-highlight font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:focus:ring-purple-900 duration-150 flex items-center justify-center gap-1"
            >
              Cancel
            </button>
          </div>
        )}
      </nav>
      <hr />
      <main className="flex flex-col md:flex-row">
        <section className="p-5 md:mx-auto">
          <form action="" className="flex flex-col">
            <label className="text-lg my-2 font-medium text-center md:text-left">
              Your profile photo
            </label>
            <div className="flex flex-col md:flex-row">
              <div className="relative flex w-full md:w-fit">
                {loadingProfileImage && (
                  <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-70 flex items-center justify-center rounded-lg z-50">
                    <Loader />
                  </div>
                )}
                <img
                  className="h-40 w-40 rounded-full border mx-auto md:ml-0"
                  src={user.profileImage}
                  alt={user.name}
                />
              </div>
              {edit && (
                <span className="flex justify-center items-center gap-2 py-4 flex-col sm:ml-5 sm:py-4">
                  <label
                    htmlFor="file-upload"
                    className="w-fit flex gap-1 text-sm border rounded-lg py-2 px-5 cursor-pointer hover:border-highlight duration-150 mx-auto md:ml-0"
                  >
                    <TbPhotoPlus className="my-auto text-base" />
                    Upload new photo
                  </label>
                  <input
                    id="file-upload"
                    className="hidden"
                    type="file"
                    accept="image/jpeg, image/png, image/jpg, image/webp"
                    onChange={handleProfileChange}
                    name="profileImage"
                  />
                  <button
                    className="flex gap-1 border w-fit p-2 rounded-lg cursor-pointer text-xs text-red-500 hover:border-red-500 duration-150 py-2 px-5 mx-auto md:ml-0"
                    disabled={loadingProfileImage || user.profileImage === ""}
                    onClick={handleProfileImageDelete}
                  >
                    <MdDeleteOutline className="my-auto text-base" />
                    Delete
                  </button>
                </span>
              )}
            </div>

            <label className="mt-2 text-slate-600 font-light">Full name</label>
            <input
              type="text"
              placeholder="Vedant Nagar"
              disabled={!edit}
              name="name"
              value={user.name}
              minLength={3}
              maxLength={50}
              onChange={handleChange}
              className={`rounded-lg p-2 border ${edit ? "text-black" : ""}`}
            />

            <label className="mt-2 text-slate-600 font-light">
              Email Address
            </label>
            <input
              type="text"
              placeholder="pathaa@gmail.com"
              disabled={true}
              value={user.email}
              className="rounded-lg p-2 border"
            />
          </form>
          <div className="mt-2 mx-auto">
            <ButtonSecondary
              onClick={handleLogout}
              text="Logout"
              fullWidth={true}
              icon={<LogOutIcon size={16} />}
            />
          </div>
          {user.isVendor && (
            <div className="mx-auto mt-8">
              <ButtonSecondary
                onClick={() => navigate("/vendor-home")}
                text="My Vendor Profile"
                fullWidth={true}
              />
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default MyProfile
