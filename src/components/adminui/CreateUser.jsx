"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useFormState } from "react-dom";
import Input from "../common/Input";
import Button from "../common/Button";
import { createNewUser } from "@/lib/actions";
import { BiSolidCheckCircle, BiSolidError } from "react-icons/bi";
import { toast } from "react-toastify";
const initialState = {
  message: "",
  type: "",
};

export default function CreateUserForm() {
  const [state, formAction] = useFormState(createNewUser, initialState);
  const formRef = useRef(null); // Reference to the form element

  useEffect(() => {
    if (state.type === "success") {
      toast.success(state.message);
      formRef.current.reset(); // Resets the form fields
    } else if (state.type === "error") {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <>
      <form
        className=" bg-surface p-4 rounded-lg"
        autoComplete="off"
        action={formAction}
        ref={formRef}
      >
        <Input
          label="name"
          type="text"
          name="name"
          placeholder="Enter Full Name"
          required
        />
        <Input
          label="email"
          type="email"
          name="email"
          required
          placeholder="Enter Email"
        />
        {/* <Input
          label="phone"
          type="tel"
          name="phone"
          required
          placeholder="Enter Phone"

        /> */}
        <Input
          label="Password"
          placeholder="Enter Password"
          type="password"
          name="password"
          required
        />

        {/* Role */}
        <div className="mb-4">
          <label className="inline-block mb-1 pl-1 mt-4 font-semibold capitalize">
            Role
          </label>
          <select
            id="role"
            name="role"
            required
            className="px-3 py-2 rounded-lg border border-gray-200 outline-none w-full duration-200 focus:bg-gray-50"
            aria-describedby="role-error"
          >
            <option value="">Select a role</option>
            <option value="staff">Staff</option>
            <option value="lawyer">Lawyer</option>
          </select>
        </div>

        {/* <div className="flex items-center justify-start gap-4 mt-2 ">
            {" "}
            <input
              type="checkbox"
              checked={showPassword}
              id="showpwd"
              onChange={handleShowPwd}
            />
            <label htmlFor="showpwd">Show Characters</label>
          </div> */}

        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/admin/overview"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 border"
          >
            Cancel
          </Link>
          <Button
            type="submit"
            className="flex gap-2 items-center justify-center bg-storekwiltext/[0.9] hover:bg-secondary  !w-fit"
          >
            Create User
          </Button>
        </div>
      </form>
      {/* {state?.message && state?.type==="error" && (
            <p className="flex items-center gap-4 text-red-600 border-l-4 px-2 shadow-md border-l-red-600 bg-red-100 w-fit mx-auto py-1 mt-1 text-sm">
              <BiSolidError className="text-2xl" />
              {state?.message}
            </p>
          )} */}
      {/* {state?.message &&  state?.type==="success" && (
            <p className="flex items-center gap-4 text-green-600 border-l-4 px-2 shadow-md border-l-green-600 bg-green-100 w-fit mx-auto py-1 mt-1 text-sm">
              <BiSolidCheckCircle className="text-2xl" />
              {state?.message}
            </p>
          )} */}
    </>
  );
}
