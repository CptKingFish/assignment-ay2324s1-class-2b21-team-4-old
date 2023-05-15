import Link from "next/link";
import GroupParticipants from "./GroupParticipants";
import GroupParticipantModal from "./GroupParticipantsModal";
export default function UserSideBar() {
    const participants = [
        { key: '1', name: 'You', imageUrl: '', admin: false },
        { key: '2', name: 'Tim', imageUrl: '', admin: true },
        { key: '3', name: 'Elliott', imageUrl: '', admin: false },
        { key: '4', name: 'Sithu', imageUrl: '', admin: false },
        { key: '5', name: 'You', imageUrl: '', admin: false },
        { key: '6', name: 'Tim', imageUrl: '', admin: true },
        { key: '7', name: 'Elliott', imageUrl: '', admin: false },
        { key: '8', name: 'Sithu', imageUrl: '', admin: false },
        { key: '9', name: 'You', imageUrl: '', admin: false },
        { key: '10', name: 'Tim', imageUrl: '', admin: true },
        { key: '11', name: 'Elliott', imageUrl: '', admin: false },
        { key: '12', name: 'Sithu', imageUrl: '', admin: false },
        { key: '13', name: 'You', imageUrl: '', admin: false },
        { key: '14', name: 'Tim', imageUrl: '', admin: true },
        { key: '15', name: 'Elliott', imageUrl: '', admin: false },
        { key: '16', name: 'Sithu', imageUrl: '', admin: false },
      ];

    return (
        <>
            <input type="checkbox" id="my-modal-3" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box relative">
                    <GroupParticipantModal participants={participants}/>
                </div>
            </div>
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
                        <div className="mt-2">Group | {participants.length} participants</div>
                    </div>
                    <div className="divider"></div>
                    <div className="flex flex-wrap">
                        <li className="mx-2">{participants.length} Participants</li>
                        <label htmlFor = "my-modal-3" className = "cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </label>

                    </div>
                    <div>
                        {participants.map((participant, index) => (
                            <GroupParticipants
                                key={index}
                                name={participant.name}
                                imageUrl={participant.imageUrl}
                                admin={participant.admin}
                            />
                        ))}
                    </div>
                    <div className="divider"></div>
                    <div className="btn btn-outline btn-error mx-5"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                    </svg>
                        Leave Group</div>
                </ul>

            </div>
        </>
    );
}