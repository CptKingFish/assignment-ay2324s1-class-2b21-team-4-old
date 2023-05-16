import Profile from "@/components/Profile";
import ProfileSideBar from "@/components/ProfileSideBar";
import React from "react";
import Avatar from "react-avatar-edit"

const profile = () => {
    return (
        <>
            <div className="drawer drawer-mobile">
                <Profile />
                <ProfileSideBar />
            </div>
        </>
    )
};

export default profile;
