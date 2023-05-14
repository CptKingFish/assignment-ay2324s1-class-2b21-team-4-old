export default function Profile() {

    return (
        <>
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col items-start justify-start p-5 ">
                {/* <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">Open drawer</label> */}
                <div className="flex flex-wrap w-full justify-between">
                    <div className="font-bold text-xl mb-5">My Account</div>
                    <div className="grid">
                        <button className="btn btn-circle btn-outline">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        <div className="text-center">Esc</div>
                    </div>
                </div>

                <div className="my-5 flex flex-wrap w-full justify-between">
                    <div className="avatar online me-5">
                        <div className="w-24 rounded-full">
                            <img src="https://picsum.photos/200/300" />
                        </div>
                    </div>
                    <div className="font-bold text-xl grid grid-flow-col">User 1<div className="font-light">#1011</div></div>
                    <a className="btn btn-primary ml-auto">Edit User Profile</a>
                </div>

                <div className="my-5 px-3 w-full bg-base-200 rounded">
                    <div className="mt-2 mb-5 flex flex-wrap w-full justify-between">
                        <div className="font-bold text-xs">USERNAME<div className="font-light text-xl">User 1#1011</div></div>
                        <a className="btn btn-primary">Edit</a>
                    </div>
                    <div className="mt-2 mb-5 flex flex-wrap w-full justify-between">
                        <div className="font-bold text-xs">EMAIL<div className="font-light text-xl">IhateFrontend@imsobadatthis.com</div></div>
                        <a className="btn btn-primary">Edit</a>
                    </div>
                    <div className="mt-2 mb-5 flex flex-wrap w-full justify-between">
                        <div className="font-bold text-xs">PHONE NUMBER<div className="font-light text-xl">1010010101010101001</div></div>
                        <a className="btn btn-primary">Edit</a>
                    </div>
                </div>
            </div>
        </>
    );
}
