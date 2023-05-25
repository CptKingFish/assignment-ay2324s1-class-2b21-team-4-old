import { api } from "@/utils/api";
import React from "react";
import toast from "react-hot-toast";


interface GroupChangeIconProps {
    chatRoomID: string;
}

const GroupChangeIcon: React.FC<GroupChangeIconProps> = ({ chatRoomID }) => {
    const utils = api.useContext();
    const [groupIcon, setgroupIcon] = React.useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

    const { mutate: changeGroupIcon } = api.chat.changeGroupIcon.useMutation();

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
            changeGroupIcon({ chatRoomID, groupIcon }, { // Pass the profile picture as an object with groupIcon field
                onSuccess: (data) => {
                    toast.success("Profile picture changed successfully!");
                    utils.chat.getMessagesAndChatroomInfo.invalidate()
                    utils.chat.getChatrooms.invalidate()
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
        setgroupIcon(null);
        setPreviewUrl(null);
    };

    const handleCancelClick = () => {
        resetForm();
    };

    return (
        <>
            <input type="checkbox" id="groupIcon" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    <h3 className="text-lg font-bold">Change Group Icon</h3>
                    <input
                        type="file"
                        accept=".jpg, .jpeg, .png"
                        className="file-input"
                        onChange={handlegroupIconChange}
                    />
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
        </>
    );
};

export default GroupChangeIcon;
