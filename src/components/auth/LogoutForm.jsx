import React from "react";

import { BiSolidError } from "react-icons/bi";

import LogoutBtn from "../ui/sidebar/LogoutBtn";

const LogoutForm = () => {
  return (
    <div className="mx-4 md:max-w-[400px] w-full self-center justify-self-center bg-white/[0.34] backdrop-blur-md rounded-lg shadow-[0_0_30px_0_rgba(0,0,0,0.05)] ">
      <div className="p-6">
        <div className="">
          <h2 className="text-center font-semibold text-2xl mb-2">Unable to Login??</h2>

          <p className="flex items-center gap-4 text-red-600 border-l-4 px-2 shadow-md border-l-red-600 bg-red-100 w-fit mx-auto py-1 mt-1 text-sm">
            <BiSolidError className="text-2xl" />
            Something Went Wrong with the Server <br/> Please Try Again Later
          </p>
        </div>
        <LogoutBtn />
      </div>
    </div>
  );
};

export default LogoutForm;
