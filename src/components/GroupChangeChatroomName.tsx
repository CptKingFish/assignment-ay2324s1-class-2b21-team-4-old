import { api } from "@/utils/api"
import React from "react"
import toast from "react-hot-toast";
import { useGlobalContext } from "@/context";
interface AccountChangeUsernameProps {
    chatRoomId:string;
    chatRoomName:string;
}

const GroupChangeChatroomName: React.FC<AccountChangeUsernameProps> = ({chatRoomId,chatRoomName}) => {
    const utils = api.useContext()
    const [roomName, setRoomName] = React.useState("")
    const {
        user
    } = useGlobalContext()

    const {mutate: editChatroomName} = api.chat.changeChatroomName.useMutation();

    React.useEffect(() => {
        setRoomName(chatRoomName || "")
    }, [user])
    const handleEditChatroomName= ()=>{
        if(roomName){
            editChatroomName({chatroom_id:chatRoomId, chatroom_name:roomName},{
                onSuccess: (data) => {
                    toast.success("Changed group name successfully!");
                    utils.chat.getMessagesAndChatroomInfo.invalidate()
                },
                onError: (error) => {
                    toast.error("Error when changing group name!");
                },
            });
        }
    }


    return (
        <>
            <input type="checkbox" id="chatname" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    <h3 className="text-lg font-bold">Change Chatroom Name</h3>
                    <input type="text" value={roomName} className="input input-bordered w-full my-5" onChange={(e) => setRoomName(e.target.value)} />
                    <div className="my-7"></div>
                    <div className="flex flex-wrap absolute right-6 bottom-2">
                        <label htmlFor="chatname" className="link mt-2">Cancel</label>
                        <label htmlFor="chatname" onClick={handleEditChatroomName} className="btn btn-success btn-outline ms-5 px-10">Save</label>
                    </div>

                </div>
            </div>
        </>
    )
}

export default GroupChangeChatroomName;