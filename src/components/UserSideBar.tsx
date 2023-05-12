import Link from "next/link";
export default function UserSideBar() {


    return (
        <div className="drawer-side">
            <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
            <ul className="menu w-80 bg-base-100 text-base-content">
                <div className="flex flex-wrap bg-base-200 p-5">
                    <button className="">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    <li className=" ms-5">Group Info</li>
                </div>
                <div className="self-center text-center">
                    <div className="avatar mt-5 self-center">
                        <div className="w-24 rounded-full">
                            <img src="https://picsum.photos/200/300" />
                        </div>
                    </div>
                    <div className="mt-2 font-bold">ADES</div>
                    <div className="mt-2">Group | 4 participants</div>
                </div>
                <div className="divider"></div>
                <div className="flex flex-wrap">
                    <li className="mx-2">4 Participants</li>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                </div>
                <div className="flex flex-wrap mt-5">
                    <div className="avatar self-center">
                        <div className="w-10 rounded-full">
                            <img src="https://picsum.photos/200/300" />
                        </div>
                    </div>
                    <div className="font-bold ms-5">You</div>
                </div>
                <div className="flex flex-wrap mt-5 justify-between">
                    <div className="avatar self-center">
                        <div className="w-10 rounded-full">
                            <img src="https://picsum.photos/200/300" />
                        </div>
                    </div>
                    <div className="font-bold ms-5">Tim</div>
                    <div className="badge badge-outline ml-auto me-3">Group Admin</div>
                </div>
                <div className="flex flex-wrap mt-5">
                    <div className="avatar self-center">
                        <div className="w-10 rounded-full">
                            <img src="https://picsum.photos/200/300" />
                        </div>
                    </div>
                    <div className="font-bold ms-5">Elliott</div>
                </div>
                <div className="flex flex-wrap mt-5">
                    <div className="avatar self-center">
                        <div className="w-10 rounded-full">
                            <img src="https://picsum.photos/200/300" />
                        </div>
                    </div>
                    <div className="font-bold ms-5">Sithu</div>
                </div>
                <div className="divider"></div>
                <div className="btn btn-outline btn-error mx-5"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                    Leave Group</div>
            </ul>

        </div>
    );
}