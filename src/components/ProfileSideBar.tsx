


export default function ProfileSideBar() {


    return (
        <div className="drawer-side">
            <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
            <ul className="menu p-4 w-80 bg-base-100 text-base-content border border-b-base-200">
                <li className="font-bold">Settings</li>
                <div className="divider"></div>
                <li className="bg-base-300"><a>Account</a></li>
                <li><a>Appearance</a></li>

                {/* <div className="divider"></div>
                <li className="font-bold">App Settings?</li> */}
            </ul>

        </div>
    );
}
