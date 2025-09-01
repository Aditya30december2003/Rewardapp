"use client";
import React from "react";
import { Oval } from "react-loader-spinner";

const LoadingUi = () => {
  return (
    <div className="flex flex-col items-center gap-4 justify-center min-h-screen flex-wrap bg-surface">
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <Oval
          visible={true}
          height="100"
          width="100"
          strokeWidth="4"
          color="#5064CE"
          secondaryColor="#666"
          ariaLabel="infinity-spin-loading"
        />
        {/* <h3 className='text-xl text-white'>{msg}</h3> */}
      </div>

      <img src="/logo.png" alt="storekwil-logo" className="h-[50px] mb-16" />
    </div>
  );
};

export default LoadingUi;
