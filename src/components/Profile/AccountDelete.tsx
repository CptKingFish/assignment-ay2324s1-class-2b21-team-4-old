import { api } from "@/utils/api"
import React from "react"
import toast from "react-hot-toast";
import { useGlobalContext } from "@/context";

interface AccountDelete {
}

const AccountDelete: React.FC<AccountDelete> = ({ }) => {
    const utils = api.useContext()
    const [password, setPassword] = React.useState("")

    const { mutate: deleteAccount } = api.user.deleteUser.useMutation()

    const handleAccountDelete = () => {
        deleteAccount({ password }, {
            onSuccess: (data) => {
                toast.success("Account deleted successfully!")
                utils.user.getMe.invalidate()
                window.location.href = "/authenticate"
                
            },
            onError: (error) => {
                toast.error(error.message);
                setPassword("");
            },
        });
    }

    return (
        <>
            <input type="checkbox" id="deletion" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    <h3 className="text-lg font-bold">Delete Account</h3>
                    <div>
                        <label className="block"> Password</label>
                        <input type="password" value={password} className="input input-bordered w-full my-2" onChange={(e) => setPassword(e.target.value)} />
                    </div>

                    <div className="my-10"></div>
                    <div className="flex flex-wrap absolute right-6 bottom-2">
                        <label htmlFor="deletion" className="link mt-2">Cancel</label>
                        <label htmlFor="deletion" onClick={handleAccountDelete} className="btn btn-error btn-outline ms-5 px-10">Delete Account</label>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AccountDelete;
