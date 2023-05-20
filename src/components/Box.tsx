import React from "react";


const Box = () => {


  return (
    <div className="h-full w-full">
       <div className="navbar bg-base-100">
      <div className="flex-1">
        <a className="text-xl normal-case">Name of Person</a>
      </div>
      <div className="flex-none">
        <div className="dropdown-end dropdown">
          <label tabIndex={0} className="btn-ghost btn-circle avatar btn">
            <div className="w-10 rounded-full">
              <img src="https://source.unsplash.com/random/?city,night" />
            </div>
          </label>
        </div>
      </div>
    </div>
      <div className="chat chat-start">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img src="https://source.unsplash.com/random/?city,night" />
          </div>
        </div>
        <div className="chat-header">
          Obi-Wan Kenobi
          <time className="text-xs opacity-50">12:45</time>
        </div>
        <div className="chat-bubble">You were the Chosen One!</div>
        <div className="chat-footer opacity-50">Delivered</div>
      </div>
      <div className="chat chat-end">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
          <img src="https://source.unsplash.com/random/?city,night" />
          </div>
        </div>
        <div className="chat-header">
          Anakin
          <time className="text-xs opacity-50">12:46</time>
        </div>
        <div className="chat-bubble">I hate you!</div>
        <div className="chat-footer opacity-50">Seen at 12:46</div>
      </div>
      <input type="text" placeholder="Type here" className="input input-bordered rounded-full input-lg w-5/6 mb-30" />

    </div>
  );
};

export default Box;