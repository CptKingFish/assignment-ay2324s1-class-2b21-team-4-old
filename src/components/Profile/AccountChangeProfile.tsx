import { useGlobalContext } from "@/context";
import { api } from "@/utils/api";

import React, { useRef } from "react";
import toast from "react-hot-toast";


interface AccountChangeProfileProps { }

const AccountChangeProfile: React.FC<AccountChangeProfileProps> = ({ }) => {

  const utils = api.useContext();
  const { user } = useGlobalContext();
  const [profilePic, setProfilePic] = React.useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(user?.avatar || null);
  const [isLoading, setIsLoading] = React.useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: changeProfilePicture } = api.user.changeProfilePicture.useMutation();
  const { mutate: deleteProfilePicture } = api.user.removeAvatar.useMutation();

  React.useEffect(() => {
    setPreviewUrl(user?.avatar || null);
  }
    , [user]);

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && e.target.files[0] !== undefined) {
      const file = e.target.files[0];
      let validate = validateFile(file);
      if (validate == "") {
        const reader = new FileReader();
        reader.onload = () => {
          setProfilePic(reader.result as string);
          setPreviewUrl(reader.result as string);

        };
        reader.readAsDataURL(file);
      } else {
        e.target.value = ""; // Clear the file input
        toast.error(validate); // Show the error toast message
      }
    }
  };

  const validateFile = (file: File) => {

    const allowedExtensions = ["jpg", "jpeg", "png"];
    const allowedSize = 10 * 1024 * 1024; // 5MB

    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!(extension && allowedExtensions.includes(extension))) {
      return "Invalid File Format!";
    }
    if (!(file.size <= allowedSize)) {
      return "File size too large!";
    }

    return "";
  };

  const handleProfilePicUpload = () => {
    if (profilePic) {
      setIsLoading(true);
      changeProfilePicture({ profilePic }, { // Pass the profile picture as an object with profilePic field
        onSuccess: (data) => {
          setIsLoading(false);
          toast.success("Profile picture changed successfully!");
          utils.user.getMe.invalidate();
          handleCancelClick();
        },
        onError: (error) => {
          setIsLoading(false);
          toast.error("Failed to change profile picture!");
        },
      });
    } else {
      toast.error("No profile picture selected!");
    }
  };

  const handleRemoveFile = () => {
    if (user?.avatar) {
      deleteProfilePicture(undefined, {
        onSuccess: (data) => {
          toast.success("Profile picture removed successfully!");
          utils.user.getMe.invalidate();
          setProfilePic(null);
          setPreviewUrl(null);
        },
        onError: (error) => {
          toast.error("Failed to remove profile picture!");
        }
      });
    } else {
      setProfilePic(null);
      setPreviewUrl(null);
    }
  };

  const handleCancelClick = () => {
    setProfilePic(null);
    setPreviewUrl(user?.avatar || null);
  };

  const handleEditImage = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      {isLoading ? (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="text-base-200 absolute top-50 left-50 text-xl">Image Uploading</div>
          <progress className="progress w-56 mt-20"></progress>
        </div>
      ) : (
        <>
          <input type="checkbox" id="profilePic" className="modal-toggle" />
          <div className="modal">
            <div className="modal-box">
              <h3 className="text-lg font-bold">Change Profile Picture</h3>
              <div className="divider"></div>
              <div className="btn">
                <input
                  style={{ display: 'none' }}
                  type="file"
                  ref={fileInputRef}
                  accept=".jpg, .jpeg, .png"
                  className=""
                  onChange={handleProfilePicChange}
                />
                <button onClick={handleEditImage} className = "w-full h-full">
                  Edit Profile Image
                </button>
              </div>
              <div className="ms-5 btn btn-outline border-none">
                <button onClick={handleRemoveFile} className = "w-full h-full">
                  Remove Profile
                </button>
              </div>
              {previewUrl && (
                <img src={previewUrl} alt="Profile Preview" className="mt-4" style={{ width: "200px", height: "200px" }} />
              )}
              <div className="my-7"></div>
              <div className="flex flex-wrap absolute right-6 bottom-2">
                <label htmlFor="profilePic" className="link mt-2" onClick={handleCancelClick}>
                  Cancel
                </label>
                <label htmlFor="profilePic" onClick={handleProfilePicUpload} className="btn btn-success btn-outline ms-5 px-10">
                  Save
                </label>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AccountChangeProfile;
