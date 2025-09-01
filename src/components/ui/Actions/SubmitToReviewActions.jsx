"use client";
import React, { useRef, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useFormState } from "react-dom";
import Button from "@/components/common/Button";
import { IoIosArrowDropdown } from "react-icons/io";
import {  submitForReview } from "@/lib/actions";
const initialState = {
  message: "",
  type: "",
};

const SubmitToReviewActions = ({ caseId }) => {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useFormState(submitForReview.bind(null,caseId), initialState);


  useEffect(() => {
    if (state.type === "success") {
      toast.success(state.message);
    } else if (state.type === "error") {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <div className="border rounded-lg overflow-hidden">
      <div
        onClick={() => setOpen(!open)}
        className={`flex cursor-pointer  items-center justify-between py-3 px-3 font-bold  ${
          open ? "bg-light" : "bg-white"
        }`}
      >
        <h3
          className={`subheading ${open ? "text-gray-900" : "text-gray-500"}`}
        >
          Submit to Supervisor
        </h3>
        <IoIosArrowDropdown
          className={`cursor-pointer text-2xl hover:text-primary ${
            open && "rotate-180"
          }`}
        />
      </div>

      {open && (
        <div className="">
            <p className="p-2 px-8 text-gray-500">Do you want to submit the case to supervisor for review ?</p>
          <div className="flex items-center ">
            <form action={formAction} className="px-8 py-4 flex-1">
      
              <Button
                type="submit"
                className="flex gap-2 items-center justify-center bg-secondary"
              >
                Submit
              </Button>
            </form>
      
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmitToReviewActions;
