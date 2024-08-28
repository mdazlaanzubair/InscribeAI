import React from "react";
import { ProfileForm } from "./components";

const ProfileContainer = ({ data, changePage }) => {
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
        </div>
        {data && (
          <button
            onClick={changePage}
            className="px-2 py-2 rounded-lg text-sm bg-slate-200 hover:bg-slate-300/70 hover:shadow-sm transition-colors duration-500 ease-in-out"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
              />
            </svg>
          </button>
        )}
      </div>
      <hr className="bg-slate-400" />
      <ProfileForm data={data} changePage={changePage} />
    </div>
  );
};

export default ProfileContainer;
