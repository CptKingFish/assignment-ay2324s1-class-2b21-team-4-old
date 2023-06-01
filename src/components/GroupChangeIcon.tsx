import { api } from "@/utils/api";
import React from "react";
import toast from "react-hot-toast";


interface GroupChangeIconProps {
    chatRoomID: string;
    chatRoomAvatar: string;
}

const GroupChangeIcon: React.FC<GroupChangeIconProps> = ({ chatRoomID, chatRoomAvatar }) => {
    const utils = api.useContext();
    const [groupIcon, setgroupIcon] = React.useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(chatRoomAvatar || null);
    const [isLoading, setIsLoading] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const { mutate: changeGroupIcon } = api.chat.changeGroupIcon.useMutation();
    const { mutate: deleteGroupIcon } = api.chat.removeChatroomIcon.useMutation();

    const handlegroupIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0 && e.target.files[0] !== undefined) {
            const file = e.target.files[0];
            let validate = validateFile(file);
            if (validate == "") {
                const reader = new FileReader();
                reader.onload = () => {
                    setgroupIcon(reader.result as string);
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
        const allowedSize = 10 * 1024 * 1024;

        const extension = file.name.split(".").pop()?.toLowerCase();
        if (!(extension && allowedExtensions.includes(extension))) {
            return "Invalid File Format!";
        }
        if (!(file.size <= allowedSize)) {
            return "File size too large!";
        }

        return "";
    };

    const handlegroupIconUpload = () => {
        if (groupIcon) {
            setIsLoading(true);
            changeGroupIcon({ chatRoomID, groupIcon }, { // Pass the profile picture as an object with groupIcon field
                onSuccess: (data) => {
                    setIsLoading(false);
                    toast.success("Profile picture changed successfully!");
                    utils.chat.getMessagesAndChatroomInfo.invalidate()
                    utils.chat.getChatrooms.invalidate()
                    setPreviewUrl(groupIcon);
                },
                onError: (error) => {
                    setIsLoading(false);
                    toast.error("Failed to change profile picture!");
                },
            });

        }
    };

    const handleRemoveFile = () => {
        if (chatRoomAvatar != "/Profile.png") {
            console.log(chatRoomAvatar)
            deleteGroupIcon({ chatRoomID }, {
                onSuccess: (data) => {
                    toast.success("Profile picture removed successfully!");
                    utils.chat.getMessagesAndChatroomInfo.invalidate()
                    utils.chat.getChatrooms.invalidate()
                    setgroupIcon(null);
                    setPreviewUrl(null);
                },
                onError: (error) => {
                    toast.error("Failed to remove profile picture!");
                }
            });
        } else {
            setgroupIcon(null);
            setPreviewUrl(null);
        }
    };

    const handleEditImage = () => {
        fileInputRef.current?.click();
    };

    const handleCancelClick = () => {
        setgroupIcon(null);
        setPreviewUrl(chatRoomAvatar || null);
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
                    <input type="checkbox" id="groupIcon" className="modal-toggle" />
                    <div className="modal">
                        <div className="modal-box">
                            <h3 className="text-lg font-bold">Change Group Icon</h3>
                            <div className="btn">
                                <input
                                    style={{ display: 'none' }}
                                    type="file"
                                    ref={fileInputRef}
                                    accept=".jpg, .jpeg, .png"
                                    className=""
                                    onChange={handlegroupIconChange}
                                />
                                <button onClick={handleEditImage} className="w-full h-full">
                                    Edit Profile Image
                                </button>
                            </div>
                            <div className="ms-5 btn btn-outline border-none">
                                <button onClick={handleRemoveFile} className = "w-full h-full">
                                    Remove Profile
                                </button>
                            </div>
                            {previewUrl && (
                                <img src={previewUrl} alt="Group Icon Preview" className="mt-4" style={{ width: "200px", height: "200px" }} />
                            )}
                            <div className="my-7"></div>
                            <div className="flex flex-wrap absolute right-6 bottom-2">
                                <label htmlFor="groupIcon" className="link mt-2" onClick={handleCancelClick}>
                                    Cancel
                                </label>
                                <label htmlFor="groupIcon" onClick={handlegroupIconUpload} className="btn btn-success btn-outline ms-5 px-10">
                                    Save
                                </label>
                            </div>
                        </div>
                    </div>
                </>)}
        </>
    );
};

export default GroupChangeIcon;
