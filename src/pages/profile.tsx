import Account from "@/components/Profile/Account";
import Appearance from "@/components/Profile/Appearance";
import React from "react";

const profile = () => {
    const [activeTab, setActiveTab] = React.useState(0);

    const handleTabChange = (index: number) => {
        setActiveTab(index);
      };
    return (
        <>
            <div className="drawer drawer-mobile">
                <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content flex flex-col items-start justify-start p-5 ">
                    {activeTab == 0 ? <Account /> : <Appearance />}
                </div>

                <div className="drawer-side">
                    <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
                    <ul className="menu p-4 w-80 bg-base-100 text-base-content border border-b-base-200">
                        <li className="font-bold">Settings</li>
                        <div className="divider"></div>
                        <div className="">
                            <li><a
                                className={
                                    "" + (activeTab == 0 ? "bg-base-200" : "")
                                }
                                onClick={() => handleTabChange(0)}
                            >
                                Account
                            </a></li>
                            <li>
                            <a
                                className={
                                    "" + (activeTab == 1 ? "bg-base-200" : "")
                                }
                                onClick={() => handleTabChange(1)}
                            >
                                Appearance
                            </a>
                            </li>
                        </div>
                    </ul>
                </div>

                {/* <div className="divider"></div>
                <li className="font-bold">App Settings?</li> */}


            </div >

        </>
    )
};

export default profile;
