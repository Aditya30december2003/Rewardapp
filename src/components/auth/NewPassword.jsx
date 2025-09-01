"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { BiSolidError } from "react-icons/bi";
import { createLoginSession, RecoverPassword, resendOTP, verifyOTP } from "@/lib/actions";
import { useFormState } from "react-dom";
import { HiOutlineRefresh } from "react-icons/hi";

const initialState = {
  message: "",
};

const NewPassword = ({userId,secret}) => {
  const [state, formAction] = useFormState(RecoverPassword, initialState);
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
  const handleResendLink = async (event) => {
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
            Password Recovery
          </h2>
          <p className="text-center">
            Reset the Password Here
          </p>
          {state?.message && (
            <p className="flex items-center gap-4 text-red-600 border-l-4 px-2 shadow-md border-l-red-600 bg-red-100 w-fit mx-auto py-1 mt-1 text-sm">
              <BiSolidError className="text-2xl" />
              {state?.message}
            </p>
          )}
        </div>

        <form action={formAction} className="flex flex-col gap-4 mt-4">
          <input type="hidden" name="userId" value={userId} />
          <input type="hidden" name="secret" value={secret} />
          <Input
            label=""
            placeholder="New Password"
            type="password"
            name="npwd"
          />
          <Input
            label=""
            placeholder="Confirm New Password"
            type="password"
            name="cnpwd"
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

export default NewPassword;
