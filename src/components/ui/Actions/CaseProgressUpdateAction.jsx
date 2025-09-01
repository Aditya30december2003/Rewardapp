"use client";
import React, { useRef, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useFormState } from "react-dom";
import { updateCaseProgress } from "@/lib/actions";
import Button from "@/components/common/Button";
import { IoIosArrowDropdown } from "react-icons/io";

const initialState = {
  message: "",
  type: "",
};

const CaseProgressUpdateAction = ({ caseId }) => {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useFormState(updateCaseProgress, initialState);
  const formRef = useRef(null);

  useEffect(() => {
    if (state.type === "success") {
      toast.success(state.message);
      formRef.current.reset();
    } else if (state.type === "error") {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <div className="border rounded-lg overflow-hidden">
      <div
        onClick={() => setOpen(!open)}
        className={`flex cursor-pointer items-center justify-between py-3 px-3 font-bold ${
          open ? "bg-light" : "bg-white"
        }`}
      >
        <h3
          className={`subheading ${open ? "text-gray-900" : "text-gray-500"}`}
        >
          Case Progress Update
        </h3>
        <IoIosArrowDropdown
          className={`cursor-pointer text-2xl hover:text-primary ${
            open && "rotate-180"
          }`}
        />
      </div>

      {open && (
        <form action={formAction} ref={formRef} className="px-8 py-4">
          <div className="mb-4">
            <label
              htmlFor="compensationLawyer"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Compensation Paid to Lawyer (€)
            </label>
            <input
              type="text"
              pattern="[0-9,]*"
              id="compensationLawyer"
              name="compensationLawyer"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="compensationstorekwil"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Compensation Paid to storekwil (€)
            </label>
            <input
              type="text"
              pattern="[0-9,]*"
              id="compensationstorekwil"
              name="compensationstorekwil"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="compensationVictim"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Compensation Paid to Victim (€)
            </label>
            <input
              type="text"
              pattern="[0-9,]*"
              id="compensationVictim"
              name="compensationVictim"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
              required
            />
          </div>

          <input type="hidden" name="caseId" value={caseId} />

          <Button
            type="submit"
            className="flex gap-2 items-center justify-center bg-secondary"
          >
            Submit
          </Button>
        </form>
      )}
    </div>
  );
};

export default CaseProgressUpdateAction;
