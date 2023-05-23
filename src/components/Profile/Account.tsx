import { useGlobalContext } from "@/context";
import Link from "next/link";
import AccountChangeEmail from "./AccountChangeEmail";
import AccountChangePassword from "./AccountChangePassword";
import AccountChangeProfile from "./AccountChangeProfile";
import AccountChangeUsername from "./AccountChangeUsername";

export default function Account() {
  const { user } = useGlobalContext();

  return (
    <>
      <input type="checkbox" id="profile" className="modal-toggle" />
      <div className="modal">
        <div className="w-8/9 max-w-l modal-box justify-center">
          <label
            htmlFor="profile"
            className="btn-sm btn-circle btn absolute right-2 top-2"
          >
            ✕
          </label>
          <div className="">
            <button className="btn-outline btn-success btn absolute bottom-2 right-2 ms-5 mt-5">
              Upload Image
            </button>
            {/* {preview && <img src={preview} alt="Preview" />} */}
          </div>
        </div>
      </div>
      <AccountChangeProfile />
      <AccountChangeUsername />
      <AccountChangeEmail />
      <AccountChangePassword />
      {/* <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">Open drawer</label> */}
      <div className="flex w-full flex-wrap justify-between">
        <div className="mb-5 text-xl font-bold">My Account</div>
        <div className="grid">
          <Link
            className="btn-outline btn-circle btn"
            href="javascript:history.back()"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Link>
          <div className="text-center">Esc</div>
        </div>
      </div>

      <div className="my-5 flex w-full flex-wrap justify-between">
        <div className="online avatar me-5">
          <div className="w-24 rounded-full">
            <img src={user?.avatar || "/images/Profile.png"} />
          </div>
        </div>
        <div className="grid grid-flow-col text-xl font-bold">
          {user?.username}
        </div>
        <label htmlFor="profilePic" className="btn-primary btn ml-auto">
          Edit Profile Image
        </label>
      </div>

      <div className="my-5 w-full rounded bg-base-200 px-3">
        <div className="mb-5 mt-2 flex w-full flex-wrap justify-between">
          <div className="text-xs font-bold">
            USERNAME<div className="text-xl font-light">{user?.username}</div>
          </div>
          <label htmlFor="username" className="btn-primary btn">
            Edit
          </label>
        </div>
        <div className="mb-5 mt-2 flex w-full flex-wrap justify-between">
          <div className="text-xs font-bold">
            EMAIL<div className="text-xl font-light">{user?.email}</div>
          </div>
          <label htmlFor="email" className="btn-primary btn">
            Edit
          </label>
        </div>
      </div>
      <div className="divider"> </div>
      <div className="mb-5 text-xl font-bold">Password and Authentication</div>
      <label htmlFor="password" className="btn-primary btn">
        Change Password
      </label>
    </>
  );
}
