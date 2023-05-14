import React, { useState } from 'react';


const Scrum = () => {
  const [isOpen, setIsOpen] = useState(false);

  function handleButtonClick() {
    setIsOpen(!isOpen);
  }

  return (
    <div className="drawer drawer-mobile drawer-end">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <div className="navbar bg-base-100">
          <div className="flex-none">
            <ul className="menu menu-horizontal px-1">
              <li>
                <button
                  className={`btn btn-glass text-white ${
                    isOpen ? 'hidden' : ''
                  }`}
                  onClick={handleButtonClick}
                >
                  Group Chat Name
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <ul
          className={`items-center content-center border border-white menu p-4 w-80 bg-base-100 text-base-content ${
            isOpen ? '' : 'hidden'
          }`}
        >
          <button className="btn btn-glass" onClick={handleButtonClick}>
            Close Menu
          </button>
          <div className="divider"></div>

          <div className="avatar mb-5 btn">
            <div className="w-24 rounded-full">
              <button className="">
                <img src="https://picsum.photos/200/300" alt="Avatar" />
              </button>
            </div>
          </div>
          <br />
          <div className="mt-5 badge">Group Name</div>
          <button className="btn btn-icon btn-ghost btn-xs float-right mt-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </button>

          <div className="divider"></div>
          <div className="mt-5 badge">SCRUM</div>
          <div className="mt-5 badge">SCRUM</div>
          <div className="mt-5 badge">SCRUM</div>
          <div className="mt-5 badge">SCRUM</div>
          <div className="mt-5 badge">IDK</div>
          <div className="divider"></div>
          <div className="mt-5 badge">Participants</div>
          <div className="divider"></div>
          {/* Chat window */}
          <div className="overflow-y-auto flex-grow">
            {/* Render chat messages here */}
          </div>
          {/* Input box */}
        </ul>
      </div>
    </div>
  );
};

export default Scrum;
