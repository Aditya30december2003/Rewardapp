"use client";
import React, { useRef, useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import { toast } from "react-toastify";
import { useFormState } from "react-dom";
import { addComment } from "@/lib/actions";
import Button from "@/components/common/Button";
import { IoIosArrowDropdown } from "react-icons/io";

const initialState = {
  message: "",
  type: "",
};

const AddComment = ({ caseId }) => {
    const [open, setOpen] = useState(false);
    const [state, formAction] = useFormState(addComment, initialState);
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
        <h3 className={`subheading ${open ? "text-gray-900" : "text-gray-500"}`}>  Add Comments</h3>
        <IoIosArrowDropdown className={`cursor-pointer text-2xl hover:text-primary ${open && "rotate-180"}`} />
      </div>

    {open &&  <form action={formAction} ref={formRef} className="px-8 py-4">
        <div className="mb-4">
            <label htmlFor="commentContent" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Comments
            </label>

            <textarea
                id="commentContent"
                name="commentContent"
                rows="4"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
                required
            ></textarea>
            <div className="flex items-center justify-start gap-2">
                <input type="checkbox" name="commentPermission" id="commentPermission" />
                <label htmlFor="commentPermission">Make this visible to client</label>
            </div>
            </div>
            <input type="hidden" name="caseId" value={caseId} />
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

export default AddComment;
