"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { BiSolidError } from "react-icons/bi";
import { createLoginSession, resendOTP, verifyOTP } from "@/lib/actions";
import { useFormState } from "react-dom";
import { HiOutlineRefresh } from "react-icons/hi";

const initialState = {
  message: "",
};

const Verify = ({ challengeId }) => {
  const [state, formAction] = useFormState(verifyOTP, initialState);
  const [timer, setTimer] = useState(60); // Timer state initialized to 60 seconds
  const [isResendDisabled, setIsResendDisabled] = useState(true);

 // Countdown logic
 useEffect(() => {
  let interval;
  if (isResendDisabled && timer > 0) {
    interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
  } else if (timer === 0) {
    setIsResendDisabled(false);
  }
  return () => clearInterval(interval); // Cleanup interval
}, [isResendDisabled, timer]);


  // Reset timer when resendOTP is triggered
  const handleResendOTP = async (event) => {
    event.preventDefault();
    setIsResendDisabled(true);
    setTimer(60); // Reset timer to 60 seconds
    await resendOTP(); // Trigger the resend OTP action
  };


  return (
    <div className="mx-4 md:max-w-[400px] w-full self-center justify-self-center bg-white/[0.34] backdrop-blur-md rounded-t-lg  ">
      <div className="p-6 pb-0">
        <div className="">
          <h2 className="text-center font-semibold text-2xl mb-2">
            OTP Verfication
          </h2>
          <p className="text-center">
            One Time Password has been sent to your email
          </p>
          {state?.message && (
            <p className="flex items-center gap-4 text-red-600 border-l-4 px-2 shadow-md border-l-red-600 bg-red-100 w-fit mx-auto py-1 mt-1 text-sm">
              <BiSolidError className="text-2xl" />
              {state?.message}
            </p>
          )}
        </div>
        <form onSubmit={handleResendOTP} className="py-1 flex items-center justify-center">
          {/* <input type="hidden" name="challengeId" value={challengeId} /> */}
          <button
            type="submit"
            disabled={isResendDisabled}
            // className="flex items-center justify-center gap-1 px-4 py-2 text-sm text-gray-700 hover:text-gray-100 dark:hover:bg-gray-600 z-50 "
            className={`flex items-center justify-center gap-1 px-4 py-2 text-sm ${
              isResendDisabled
                ? "cursor-not-allowed text-gray-700 "
                : "text-gray-700 hover:text-gray-100 dark:hover:bg-gray-600"
            }`}
          >
            <HiOutlineRefresh className="" />
            <span> Resend OTP  {isResendDisabled && `in ${timer}s`}</span>
          </button>
        </form>
        <form action={formAction}>
          <input type="hidden" name="challengeId" value={challengeId} />
          <Input
            label=""
            placeholder="Enter OTP Here..."
            type="text"
            name="otp"
          />

          <Button
            type="submit"
            className="flex gap-2 items-center justify-center   bg-gradient-to-r from-primary to-secondary mt-4 w-full hover:to-primary hover:from-secondary duration-500 ease-in-out"
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Verify;
