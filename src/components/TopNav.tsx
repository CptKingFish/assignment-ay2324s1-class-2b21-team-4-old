import React from "react";

interface TopNavProps {
  chatroom_name: string;
  openSidebarDetails: () => void;
}

export default function TopNav({
  chatroom_name,
  openSidebarDetails,
}: TopNavProps) {
  return (
    <div className="navbar bg-base-300">
      <div className="flex-1" onClick={openSidebarDetails}>
        <div className="avatar pl-5">
          <div className="w-16 rounded-xl">
            {/* <span className="text-3xl">K</span> */}
            <img src="https://source.unsplash.com/random/?city,night" />
          </div>
        </div>
        <div className="">
          <span className="ms-5 text-xl normal-case">{chatroom_name}</span>
        </div>
      </div>
      <div className="flex-1">
        <span
          className="ms-5 cursor-pointer text-xl normal-case"
          onClick={drawer}
        >
          Test Team
        </span>
      </div>
      <div className="flex-none gap-2">
        <div className="form-control"></div>
        <div className="dropdown-end dropdown">
          <label tabIndex={0} className="btn-ghost btn-circle avatar btn">
            <div className="w-10 rounded-full">
              <img src="https://source.unsplash.com/random/?city,night" />
              {/* <span className="text-3xl">K</span> */}
            </div>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
