import { api } from "@/utils/api";
import React from "react";
import toast from "react-hot-toast";


interface AccountChangeProfileProps {}

const AccountChangeProfile: React.FC<AccountChangeProfileProps> = ({}) => {
  const utils = api.useContext();
  const [profilePic, setProfilePic] = React.useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  const { mutate: changeProfilePicture } = api.user.changeProfilePicture.useMutation();

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
    const allowedSize = 5 * 1024 * 1024; // 5MB

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
      changeProfilePicture({ profilePic }, { // Pass the profile picture as an object with profilePic field
        onSuccess: (data) => {
          toast.success("Profile picture changed successfully!");
          utils.user.getMe.invalidate();
          resetForm();
        },
        onError: (error) => {
          toast.error("Failed to change profile picture!");
        },
      });
    } else {
      toast.error("No profile picture selected!");
    }
  };

  const resetForm = () => {
    setProfilePic(null);
    setPreviewUrl(null);
  };

  const handleCancelClick = () => {
    resetForm();
  };

  return (
    <>
      <input type="checkbox" id="profilePic" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Change Profile Picture</h3>
          <input
            type="file"
            accept=".jpg, .jpeg, .png"
            className="file-input"
            onChange={handleProfilePicChange}
          />
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
  );
};

export default AccountChangeProfile;
