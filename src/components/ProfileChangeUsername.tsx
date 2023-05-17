import { api } from "@/utils/api"
import React from "react"
import toast from "react-hot-toast";

interface ProfileChangeUsernameProps {
    name: string;
    refresh: (newName: string) => void;
}

const ProfileChangeUsername: React.FC<ProfileChangeUsernameProps> = ({ name, refresh }) => {
    const [username, setUsername] = React.useState("")
    const { mutate: changeUsername } = api.user.changeOwnUsername.useMutation()

    React.useEffect(() => {
        setUsername(name)
    }, [name])

    const handleChangeUsername = () => {
        try {
            changeUsername({ username });
            refresh(username);
            toast.success("Username changed successfully!")
        }catch{
            toast.error("Something went wrong...")
        }
        
    }


    return (
        <>

            <div className="modal-box">
                <h3 className="text-lg font-bold">Change Username</h3>
                <input type="text" value={username} className="input input-bordered w-full my-5" onChange={(e) => setUsername(e.target.value)} />
                <div className="my-7"></div>
                <div className="flex flex-wrap absolute right-6 bottom-2">
                    <label htmlFor="username" className="link mt-2">Cancel</label>
                    <label htmlFor="username" onClick={handleChangeUsername} className="btn btn-success btn-outline ms-5 px-10">Save</label>
                </div>

            </div>
        </>
    )
}

export default ProfileChangeUsername;