import Link from "next/link";
import React from "react";
import Avatar from "react-avatar-edit";
import toast from "react-hot-toast";
import { api } from "@/utils/api";


export default function Profile() {
    const [preview, setPreview] = React.useState(null);
    const [username, setUsername] = React.useState("");
    function onClose() {
        setPreview(null);
    }
    function onCrop(pv: any) {
        setPreview(pv);
    }
    function onBeforeFileLoad(elem: any) {
        if (elem.target.files[0].size > 71680) {
            toast.error("File is too big!");
            elem.target.value = "";
        }
    }

    const { data } = api.user.getMe.useQuery()
    React.useEffect(() => {
        setUsername(data?.username || "")
    }, [data])


    return (
        <>
            <input type="checkbox" id="profile" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box w-8/9 max-w-l justify-center">
                    <label htmlFor="profile" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                    <div className="flex flex-wrap">
                        <Avatar
                            width={300}
                            height={300}
                            onCrop={onCrop}
                            onClose={onClose}
                            onBeforeFileLoad={onBeforeFileLoad}
                            src={undefined}
                        />
                        <button className="btn btn-success btn-outline self-end ms-5">Upload Image</button>
                        {/* {preview && <img src={preview} alt="Preview" />} */}
                    </div>
                </div>
            </div>
            <input type="checkbox" id="username" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    <h3 className="text-lg font-bold">Change Username</h3>
                    <input type="text" value={username} className="input input-bordered w-full my-5" onChange={(e) => setUsername(e.target.value)}/>
                    <div className = "my-7"></div>
                    <div className = "flex flex-wrap absolute right-6 bottom-2">
                        <label htmlFor="username" className="link mt-2">Cancel</label>
                        <button className="btn btn-success btn-outline ms-5 px-10">Save</button>
                    </div>
                    
                </div>
            </div>
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col items-start justify-start p-5 ">
                {/* <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">Open drawer</label> */}
                <div className="flex flex-wrap w-full justify-between">
                    <div className="font-bold text-xl mb-5">My Account</div>
                    <div className="grid">
                        <Link className="btn btn-circle btn-outline" href="javascript:history.back()">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </Link>
                        <div className="text-center">Esc</div>
                    </div>
                </div>

                <div className="my-5 flex flex-wrap w-full justify-between">
                    <div className="avatar online me-5">
                        <div className="w-24 rounded-full">
                            <img src="https://picsum.photos/200/300" />
                        </div>
                    </div>
                    <div className="font-bold text-xl grid grid-flow-col">{data?.username}</div>
                    <label htmlFor="profile" className="btn btn-primary ml-auto">Edit Profile Image</label>
                </div>

                <div className="my-5 px-3 w-full bg-base-200 rounded">
                    <div className="mt-2 mb-5 flex flex-wrap w-full justify-between">
                        <div className="font-bold text-xs">USERNAME<div className="font-light text-xl">{data?.username}</div></div>
                        <label htmlFor="username" className="btn btn-primary">Edit</label>
                    </div>
                    <div className="mt-2 mb-5 flex flex-wrap w-full justify-between">
                        <div className="font-bold text-xs">EMAIL<div className="font-light text-xl">{data?.email}</div></div>
                        <a className="btn btn-primary">Edit</a>
                    </div>
                    {/* <div className="mt-2 mb-5 flex flex-wrap w-full justify-between">
                        <div className="font-bold text-xs">PHONE NUMBER<div className="font-light text-xl">1010010101010101001</div></div>
                        <a className="btn btn-primary">Edit</a>
                    </div> */}
                </div>
            </div>
        </>
    );
}
