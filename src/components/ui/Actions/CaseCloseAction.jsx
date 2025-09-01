"use client";
import React, { useRef, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useFormState } from "react-dom";
import Button from "@/components/common/Button";
import { IoIosArrowDropdown } from "react-icons/io";
import {  wonLostDecision } from "@/lib/actions";
const initialState = {
  message: "",
  type: "",
};

const CaseCloseAction = ({ caseId }) => {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useFormState(wonLostDecision, initialState);


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
          Case Close Action
        </h3>
        <IoIosArrowDropdown
          className={`cursor-pointer text-2xl hover:text-primary ${
            open && "rotate-180"
          }`}
        />
      </div>

      {open && (
        <div className="">
            <p className="p-2 px-8 text-gray-500">Is the case won or lost?</p>
          <div className="flex items-center ">
            <form action={formAction} className="px-8 py-4 flex-1">
            <input type="hidden" name="caseId" value={caseId} />
            <input type="hidden" name="acceptance" value={true}/> 
              <Button
                type="submit"
                className="flex gap-2 items-center justify-center bg-purple-700 hover:bg-purple-500"
              >
                Won
              </Button>
            </form>
            <form action={formAction} className="px-8 py-4 flex-1">
            <input type="hidden" name="caseId" value={caseId} />
            <input type="hidden" name="acceptance" value={false}/> 
              <Button
                type="submit"
                className="flex gap-2 items-center justify-center bg-gray-700 hover:bg-gray-500"
              >
                Lost
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseCloseAction;
