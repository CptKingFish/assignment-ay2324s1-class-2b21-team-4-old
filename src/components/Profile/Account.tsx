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
      <AccountChangeProfile />

      <AccountChangeUsername />
      <AccountChangeEmail />
      <AccountChangePassword />
      {/* <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">Open drawer</label> */}
      <div className="flex w-full flex-wrap justify-between">
        <div className="mb-5 text-xl font-bold">My Account</div>
        <div className="grid">
          <Link href="#" onClick={() => window.history.back()} className="btn-outline btn-circle btn">
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
            <img src={user?.avatar || "/Profile.png"} />
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
