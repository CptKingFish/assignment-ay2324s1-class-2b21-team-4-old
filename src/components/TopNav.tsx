import React from "react";

interface TopNavProps {
  drawer:() => void;
}

const TopNav:React.FC<TopNavProps> = ({drawer})=> {
  return (
    <div className="navbar bg-base-300">
      <div className="avatar pl-5">
        <div className="w-16 rounded-xl">
          <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" />
        </div>
      </div>
      <div className="flex-1">
        <span className="ms-5 text-xl normal-case cursor-pointer" onClick={drawer}>Test Team</span>
      </div>
      <div className="flex-none gap-2">
        <div className="form-control"></div>
        <div className="dropdown-end dropdown">
          <label tabIndex={0} className="btn-ghost btn-circle avatar btn">
            <div className="w-10 rounded-full">
              <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" />
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

export default TopNav;
