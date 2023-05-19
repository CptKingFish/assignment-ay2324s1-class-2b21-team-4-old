import Link from "next/link";
import React from "react";
import toast from "react-hot-toast";
import { api } from "@/utils/api";
import AccountChangeUsername from "./AccountChangeUsername";
import AccountChangeEmail from "./AccountChangeEmail";
import { useGlobalContext } from "@/context";
import { ThemeContext } from "../ThemeProvider";
import AccountChangePassword from "./AccountChangePassword";
import AccountChangeProfile from "./AccountChangeProfile";


export default function Account() {
    const utils = api.useContext()
    const {
        user
    } = useGlobalContext()

    const { changeTheme } = React.useContext(ThemeContext);

    const handleThemeChange = () => {
        changeTheme('corporate');
    };



    return (
        <>
            <input type="checkbox" id="profile" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box w-8/9 max-w-l justify-center">
                    <label htmlFor="profile" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                    <div className="">
                        <button className="btn btn-success btn-outline absolute bottom-2 right-2 ms-5 mt-5">Upload Image</button>
                        {/* {preview && <img src={preview} alt="Preview" />} */}
                    </div>
                </div>
            </div>
            <AccountChangeProfile/>
            <AccountChangeUsername />
            <AccountChangeEmail />
            <AccountChangePassword/>
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
                <div className="font-bold text-xl grid grid-flow-col">{user?.username}</div>
                <label htmlFor="profilePic" className="btn btn-primary ml-auto">Edit Profile Image</label>
            </div>

            <div className="my-5 px-3 w-full bg-base-200 rounded">
                <div className="mt-2 mb-5 flex flex-wrap w-full justify-between">
                    <div className="font-bold text-xs">USERNAME<div className="font-light text-xl">{user?.username}</div></div>
                    <label htmlFor="username" className="btn btn-primary">Edit</label>
                </div>
                <div className="mt-2 mb-5 flex flex-wrap w-full justify-between">
                    <div className="font-bold text-xs">EMAIL<div className="font-light text-xl">{user?.email}</div></div>
                    <label htmlFor="email" className="btn btn-primary">Edit</label>
                </div>
            </div>
            <div className="divider"> </div>
            <div className="font-bold text-xl mb-5">Password and Authentication</div>
            <label htmlFor="password" className="btn btn-primary" >Change Password</label>

        </>
    );
}
