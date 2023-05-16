import { api } from "@/utils/api"
import React from "react"
import toast from "react-hot-toast";

interface ProfileChangeEmailProps {
    prevEmail: string;
    refresh: (newemail: string) => void;
}

const ProfileChangeEmail: React.FC<ProfileChangeEmailProps> = ({ prevEmail, refresh }) => {
    const [email, setEmail] = React.useState("")
    const { mutate: changeEmail } = api.user.changeOwnEmail.useMutation()

    React.useEffect(() => {
        setEmail(email)
    }, [email])

    const handleChangeEmail = () => {

        changeEmail({ email },{
            onSuccess: (data) => {
                toast.success("Email Changed Successfully!");
                console.log(data)
                refresh(email);
            },
            onError: (error) => {
                toast.error("Invalid Email!");
                setEmail(prevEmail);
            },
        });
        
    }


    return (
        <>

            <div className="modal-box">
                <h3 className="text-lg font-bold">Change Email</h3>
                <input type="text" value={email} className="input input-bordered w-full my-5" onChange={(e) => setEmail(e.target.value)} />
                <div className="my-7"></div>
                <div className="flex flex-wrap absolute right-6 bottom-2">
                    <label htmlFor="email" className="link mt-2">Cancel</label>
                    <label htmlFor="email" onClick={handleChangeEmail} className="btn btn-success btn-outline ms-5 px-10">Save</label>
                </div>

            </div>
        </>
    )
}

export default ProfileChangeEmail;