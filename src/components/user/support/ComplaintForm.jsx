"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useFormState } from "react-dom";

import { createNewUser } from "@/lib/actions";

import { toast } from "react-toastify";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import TextArea from "@/components/common/TextArea";
const initialState = {
  message: "",
  type: "",
};

export default function ComplaintForm() {
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
        className=" bg-white p-4 rounded-lg border"
        autoComplete="off"
        action={formAction}
        ref={formRef}
      >
        <Input
          label="Subject"
          type="text"
          name="name"
          placeholder="Enter Subject"
          required
        />
        <TextArea
          label="Description"
          type="email"
          name="email"
          required
          placeholder="Enter Details of your issue"
        />

        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/admin/overview"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 border"
          >
            Cancel
          </Link>
          <Button
            type="submit"
            className="flex gap-2 items-center justify-center bg-green-500 hover:bg-green-600  !w-fit"
          >
            Submit request
          </Button>
        </div>
      </form>

    </>
  );
}
