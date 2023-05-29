import { api } from "@/utils/api"
import React from "react"
import toast from "react-hot-toast";
import { useGlobalContext } from "@/context";
interface AccountChangeUsernameProps {
}

const AccountChangeUsername: React.FC<AccountChangeUsernameProps> = ({ }) => {
    const utils = api.useContext()
    const [username, setUsername] = React.useState("")
    const {
        user
    } = useGlobalContext()

    const { mutate: changeUsername } = api.user.changeOwnUsername.useMutation()

    React.useEffect(() => {
        setUsername(user?.username || "")
    }, [user])
    const handleChangeUsername = () => {
        changeUsername({ username }, {
            onSuccess: (data) => {
                toast.success("Username changed successfully!")
                utils.user.getMe.invalidate()
            },
            onError: (error) => {
                toast.error(error.message);
                setUsername(user?.username || "");
            },
        });
    }


    return (
        <>
            <input type="checkbox" id="username" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    <h3 className="text-lg font-bold">Change Username</h3>
                    <input type="text" value={username} className="input input-bordered w-full my-5" onChange={(e) => setUsername(e.target.value)} />
                    <div className="my-7"></div>
                    <div className="flex flex-wrap absolute right-6 bottom-2">
                        <label htmlFor="username" className="link mt-2">Cancel</label>
                        <label htmlFor="username" onClick={handleChangeUsername} className="btn btn-success btn-outline ms-5 px-10">Save</label>
                    </div>

                </div>
            </div>
        </>
    )
}

export default AccountChangeUsername;