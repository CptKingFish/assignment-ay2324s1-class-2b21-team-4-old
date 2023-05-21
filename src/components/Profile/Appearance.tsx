import Link from "next/link";
import React from "react";
import toast from "react-hot-toast";
import { api } from "@/utils/api";
import ProfileChangeUsername from "./AccountChangeUsername";
import ProfileChangeEmail from "./AccountChangeEmail";
import { useGlobalContext } from "@/context";
import { ThemeContext } from "../ThemeProvider";


export default function Account() {
    const { theme } = React.useContext(ThemeContext);
    const utils = api.useContext()
    const {
        user
    } = useGlobalContext()

    const { changeTheme } = React.useContext(ThemeContext);

    const handleThemeChange = (theme:string) => {
        changeTheme(theme);
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
            <input type="checkbox" id="username" className="modal-toggle" />
            <div className="modal">
                <ProfileChangeUsername/>
            </div>
            <input type="checkbox" id="email" className="modal-toggle" />
            <div className="modal">
                <ProfileChangeEmail/>
            </div>
            
                {/* <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">Open drawer</label> */}
                <div className="flex flex-wrap w-full justify-between">
                    <div className="font-bold text-xl mb-5">Appearance</div>
                    <div className="grid">
                        <Link className="btn btn-circle btn-outline" href="javascript:history.back()">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </Link>
                        <div className="text-center">Esc</div>
                    </div>
                </div>
                <div className="font-bold text-l mb-5">Theme</div>
                <ul className = "w-11/12 menu bg-base-200">
                    <li><a onClick={()=>handleThemeChange("corporate")}><input type="radio" name="radio-1" className="radio" checked={theme === 'corporate'}/>Light</a></li>
                    <li><a onClick={()=>handleThemeChange("business")}><input type="radio" name="radio-1" className="radio"checked={theme === 'business'}/>Dark</a></li>
                </ul>
                
        </>
    );
}
