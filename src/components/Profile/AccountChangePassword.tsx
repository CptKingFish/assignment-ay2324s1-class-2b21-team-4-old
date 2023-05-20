import { api } from "@/utils/api"
import React from "react"
import toast from "react-hot-toast";
import { useGlobalContext } from "@/context";

interface AccountChangePasswordProps {
}

const AccountChangePassword: React.FC<AccountChangePasswordProps> = ({ }) => {
    const utils = api.useContext()
    const [oldPassword, setOldPassword] = React.useState("")
    const [newPassword, setNewPassword] = React.useState("")
    const [confirmPassword, setConfirmPassword] = React.useState("")
    const { user } = useGlobalContext()

    const { mutate: changePassword } = api.user.changeOwnPassword.useMutation()

    React.useEffect(() => {
        setOldPassword("")
        setNewPassword("")
        setConfirmPassword("")
    }, [user])

    const handleChangePassword = () => {
        if (newPassword !== confirmPassword) {
            toast.error("New password and confirm password do not match!")
            return;
        }

        changePassword({ oldPassword, newPassword }, {
            onSuccess: (data) => {
                toast.success("Password changed successfully!")
                utils.user.getMe.invalidate()
            },
            onError: (error) => {
                toast.error("Invalid password!");
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
            },
        });
    }

    return (
        <>
            <input type="checkbox" id="password" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    <h3 className="text-lg font-bold">Change Password</h3>
                    <div>
                        <label className="block">Old Password</label>
                        <input type="password" value={oldPassword} className="input input-bordered w-full my-2" onChange={(e) => setOldPassword(e.target.value)} />
                    </div>
                    <div>
                        <label className="block">New Password</label>
                        <input type="password" value={newPassword} className="input input-bordered w-full my-2" onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                    <div>
                        <label className="block">Confirm Password</label>
                        <input type="password" value={confirmPassword} className="input input-bordered w-full my-2" onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                    <div className="my-10"></div>
                    <div className="flex flex-wrap absolute right-6 bottom-2">
                        <label htmlFor="password" className="link mt-2">Cancel</label>
                        <label htmlFor="password" onClick={handleChangePassword} className="btn btn-success btn-outline ms-5 px-10">Save</label>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AccountChangePassword;
