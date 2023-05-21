import { useGlobalContext } from "@/context";
import { api } from "@/utils/api"
import React from "react"
import toast from "react-hot-toast";

interface ProfileChangeEmailProps {
}

const ProfileChangeEmail: React.FC<ProfileChangeEmailProps> = ({ }) => {
    const utils = api.useContext()
    const [email, setEmail] = React.useState("")
    const { mutate: changeEmail } = api.user.changeOwnEmail.useMutation()
    const {
        user
    } = useGlobalContext()

    React.useEffect(() => {
        setEmail(user?.email || "")
    }, [user])

    const handleChangeEmail = () => {

        changeEmail({ email }, {
            onSuccess: (data) => {
                toast.success("Email Changed Successfully!");
                utils.user.getMe.invalidate()
            },
            onError: (error) => {
                toast.error("Invalid Email!");
                setEmail(user?.email || "");
            },
        });

    }


    return (
        <>
            <input type="checkbox" id="email" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    <h3 className="text-lg font-bold">Change Email</h3>
                    <input type="text" value={email} className="input input-bordered w-full my-5" onChange={(e) => setEmail(e.target.value)} />
                    <div className="my-7"></div>
                    <div className="flex flex-wrap absolute right-6 bottom-2">
                        <label htmlFor="email" className="link mt-2">Cancel</label>
                        <label htmlFor="email" onClick={handleChangeEmail} className="btn btn-success btn-outline ms-5 px-10">Save</label>
                    </div>

                </div>
            </div>
        </>
    )
}

export default ProfileChangeEmail;