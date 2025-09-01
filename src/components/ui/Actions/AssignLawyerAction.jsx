"use client";
import React, { useRef, useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import { toast } from "react-toastify";
import { useFormState } from "react-dom";
import { assignLawyer } from "@/lib/actions";
import Button from "@/components/common/Button";
import { IoIosArrowDropdown } from "react-icons/io";

const initialState = {
  message: "",
  type: "",
};

const AssignLawyerAction = ({ caseId,lawyers,victimId }) => {
    const [open, setOpen] = useState(false);
    const [state, formAction] = useFormState(assignLawyer.bind(null, caseId, victimId), initialState);
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
    <div className="border rounded-lg overflow-hidden">
      {/* <h1 className="text-center py-3 bg-light text-accent font-bold">
        Add Comments
      </h1> */}

      <div onClick={() => setOpen(!open)} className={`flex cursor-pointer  items-center justify-between py-3 px-3 font-bold  ${open ? "bg-light" : "bg-white"}`}>
        <h3 className={`subheading ${open ? "text-gray-900" : "text-gray-500"}`}>  Assign Lawyer</h3>
        <IoIosArrowDropdown className={`cursor-pointer text-2xl hover:text-primary ${open && "rotate-180"}`} />
      </div>

    {open &&  <form action={formAction} ref={formRef} className="px-8 py-4">
        <div className="mb-4">
            <label htmlFor="commentContent" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Choose Lawyer to Assign to this case
            </label>

            <select
                  id="lawyer"
                  name="lawyerId"
                  className="peer block w-full cursor-pointer rounded-md border border-gray-200 p-2  text-sm outline-none focus:border-blue-400 placeholder:text-gray-500"
                  required
                >
                  <option value="" >
                    Select a Lawyer
                  </option>
                  {lawyers.map((lawyer) => (
                      <option key={lawyer.$id} value={lawyer.$id}>
                        {lawyer.name}
                      </option>
                    ))}
                </select>
           
            </div>
            <Button
            type="submit"
            className="flex gap-2 items-center justify-center bg-secondary"
          >
            Submit
          </Button>  
      
      </form>}
    </div>
  );
};

export default AssignLawyerAction;
